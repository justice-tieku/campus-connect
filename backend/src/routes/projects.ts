import { Router } from "express";
import { Prisma, ProjectStatus } from "@prisma/client";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../middleware/asyncHandler";
import { optionalAuth, requireAuth } from "../middleware/auth";
import { HttpError } from "../lib/httpError";

const router = Router();

const projectSchema = z.object({
  title: z.string().trim().min(3).max(120),
  description: z.string().trim().min(10).max(5000),
  requiredSkills: z.array(z.string().trim().min(1).max(50)).max(20).default([]),
  status: z.nativeEnum(ProjectStatus).optional(),
  teamCapacity: z.number().int().min(1).max(50),
});

const updateSchema = projectSchema.partial();

const joinSchema = z.object({
  message: z.string().trim().max(500).optional(),
});

function memberCountInclude() {
  return {
    creator: { select: { id: true, email: true, profile: { select: { institution: true, programme: true, imageUrl: true } } } },
    _count: { select: { members: true, joinRequests: true } },
  } satisfies Prisma.ProjectInclude;
}

router.get(
  "/",
  optionalAuth,
  asyncHandler(async (req, res) => {
    const q = typeof req.query.q === "string" ? req.query.q.trim() : "";
    const skill = typeof req.query.skill === "string" ? req.query.skill.trim() : "";
    const statusRaw = typeof req.query.status === "string" ? req.query.status : "";
    const status = Object.values(ProjectStatus).includes(statusRaw as ProjectStatus)
      ? (statusRaw as ProjectStatus)
      : undefined;

    const where: Prisma.ProjectWhereInput = {
      AND: [
        q
          ? {
              OR: [
                { title: { contains: q, mode: "insensitive" } },
                { description: { contains: q, mode: "insensitive" } },
              ],
            }
          : {},
        skill ? { requiredSkills: { has: skill } } : {},
        status ? { status } : {},
      ],
    };

    const projects = await prisma.project.findMany({
      where,
      include: memberCountInclude(),
      orderBy: { createdAt: "desc" },
    });
    res.json({ projects });
  }),
);

router.post(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const data = projectSchema.parse(req.body);
    const project = await prisma.$transaction(async (tx) => {
      const created = await tx.project.create({
        data: {
          ...data,
          creatorId: req.user!.id,
        },
        include: memberCountInclude(),
      });
      await tx.projectMember.create({
        data: { projectId: created.id, userId: req.user!.id },
      });
      return created;
    });
    res.status(201).json({ project });
  }),
);

router.get(
  "/:id",
  optionalAuth,
  asyncHandler(async (req, res) => {
    const id = req.params.id as string;
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            email: true,
            profile: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                profile: { select: { institution: true, programme: true, imageUrl: true, skills: true } },
              },
            },
          },
        },
      },
    });
    if (!project) {
      throw new HttpError(404, "Project not found");
    }

    const isOwner = req.user?.id === project.creatorId;
    const isAdmin = req.user?.role === "ADMIN";
    const myMembership = req.user
      ? project.members.find((m) => m.userId === req.user!.id)
      : undefined;

    let joinRequests = undefined;
    if (isOwner || isAdmin) {
      joinRequests = await prisma.joinRequest.findMany({
        where: { projectId: project.id },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              profile: { select: { biography: true, skills: true, institution: true, imageUrl: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    }

    const myJoinRequest = req.user
      ? await prisma.joinRequest.findUnique({
          where: { projectId_userId: { projectId: project.id, userId: req.user.id } },
        })
      : null;

    res.json({
      project,
      isOwner,
      isMember: Boolean(myMembership),
      joinRequests,
      myJoinRequest,
    });
  }),
);

router.patch(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const id = req.params.id as string;
    const data = updateSchema.parse(req.body);
    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      throw new HttpError(404, "Project not found");
    }
    if (existing.creatorId !== req.user!.id && req.user!.role !== "ADMIN") {
      throw new HttpError(403, "You cannot edit this project");
    }
    const project = await prisma.project.update({
      where: { id: existing.id },
      data,
      include: memberCountInclude(),
    });
    res.json({ project });
  }),
);

router.delete(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const id = req.params.id as string;
    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      throw new HttpError(404, "Project not found");
    }
    if (existing.creatorId !== req.user!.id && req.user!.role !== "ADMIN") {
      throw new HttpError(403, "You cannot delete this project");
    }
    await prisma.project.delete({ where: { id: existing.id } });
    res.status(204).send();
  }),
);

router.post(
  "/:id/join-requests",
  requireAuth,
  asyncHandler(async (req, res) => {
    const id = req.params.id as string;
    const { message } = joinSchema.parse(req.body ?? {});
    const project = await prisma.project.findUnique({
      where: { id },
      include: { _count: { select: { members: true } } },
    });
    if (!project) {
      throw new HttpError(404, "Project not found");
    }
    if (project.creatorId === req.user!.id) {
      throw new HttpError(400, "You already own this project");
    }
    if (project.status !== "OPEN") {
      throw new HttpError(400, "This project is not accepting members");
    }
    if (project._count.members >= project.teamCapacity) {
      throw new HttpError(400, "This project team is full");
    }
    const alreadyMember = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId: project.id, userId: req.user!.id } },
    });
    if (alreadyMember) {
      throw new HttpError(400, "You are already on this team");
    }
    const existingRequest = await prisma.joinRequest.findUnique({
      where: { projectId_userId: { projectId: project.id, userId: req.user!.id } },
    });
    if (existingRequest?.status === "PENDING") {
      throw new HttpError(409, "You already requested to join this project");
    }
    if (existingRequest?.status === "APPROVED") {
      throw new HttpError(400, "You are already on this team");
    }
    const joinRequest = existingRequest
      ? await prisma.joinRequest.update({
          where: { id: existingRequest.id },
          data: { status: "PENDING", message },
        })
      : await prisma.joinRequest.create({
          data: {
            projectId: project.id,
            userId: req.user!.id,
            message,
          },
        });
    res.status(existingRequest ? 200 : 201).json({ joinRequest });
  }),
);

export default router;
