import { Router } from "express";
import { OpportunityType } from "@prisma/client";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../middleware/asyncHandler";
import { requireAuth, requireRole } from "../middleware/auth";
import { HttpError } from "../lib/httpError";

const router = Router();

router.use(requireAuth, requireRole("ADMIN"));

const opportunitySchema = z.object({
  title: z.string().trim().min(3).max(160),
  description: z.string().trim().min(10).max(5000),
  type: z.nativeEnum(OpportunityType).optional(),
  link: z.string().trim().url().max(500).optional().or(z.literal("").transform(() => undefined)),
});

const userPatchSchema = z.object({
  isActive: z.boolean().optional(),
  role: z.enum(["STUDENT", "ADMIN"]).optional(),
});

const reportPatchSchema = z.object({
  status: z.enum(["RESOLVED", "DISMISSED"]),
});

router.get(
  "/users",
  asyncHandler(async (_req, res) => {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        profile: { select: { institution: true, programme: true } },
      },
    });
    res.json({ users });
  }),
);

router.patch(
  "/users/:id",
  asyncHandler(async (req, res) => {
    const data = userPatchSchema.parse(req.body);
    const id = req.params.id as string;
    if (id === req.user!.id && data.isActive === false) {
      throw new HttpError(400, "You cannot deactivate your own account");
    }
    const user = await prisma.user.update({
      where: { id },
      data,
      select: { id: true, email: true, role: true, isActive: true },
    });
    res.json({ user });
  }),
);

router.get(
  "/projects",
  asyncHandler(async (_req, res) => {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        creator: { select: { id: true, email: true } },
        _count: { select: { members: true } },
      },
    });
    res.json({ projects });
  }),
);

router.delete(
  "/projects/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id as string;
    await prisma.project.delete({ where: { id } });
    res.status(204).send();
  }),
);

router.get(
  "/reports",
  asyncHandler(async (_req, res) => {
    const reports = await prisma.report.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        reporter: { select: { id: true, email: true } },
        reportedUser: { select: { id: true, email: true } },
        project: { select: { id: true, title: true } },
      },
    });
    res.json({ reports });
  }),
);

router.patch(
  "/reports/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id as string;
    const { status } = reportPatchSchema.parse(req.body);
    const report = await prisma.report.update({
      where: { id },
      data: { status },
    });
    res.json({ report });
  }),
);

router.post(
  "/opportunities",
  asyncHandler(async (req, res) => {
    const data = opportunitySchema.parse(req.body);
    const opportunity = await prisma.opportunity.create({
      data: {
        ...data,
        createdById: req.user!.id,
      },
    });
    res.status(201).json({ opportunity });
  }),
);

export default router;
