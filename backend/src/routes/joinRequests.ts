import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../middleware/asyncHandler";
import { requireAuth } from "../middleware/auth";
import { HttpError } from "../lib/httpError";

const router = Router();

const decisionSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
});

router.patch(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const { status } = decisionSchema.parse(req.body);
    const id = req.params.id as string;
    const joinRequest = await prisma.joinRequest.findUnique({
      where: { id },
      include: { project: { include: { _count: { select: { members: true } } } } },
    });
    if (!joinRequest) {
      throw new HttpError(404, "Join request not found");
    }
    const isOwner = joinRequest.project.creatorId === req.user!.id;
    if (!isOwner && req.user!.role !== "ADMIN") {
      throw new HttpError(403, "Only the project owner can decide join requests");
    }
    if (joinRequest.status !== "PENDING") {
      throw new HttpError(400, "This request has already been decided");
    }

    if (status === "REJECTED") {
      const updated = await prisma.joinRequest.update({
        where: { id: joinRequest.id },
        data: { status: "REJECTED" },
      });
      return res.json({ joinRequest: updated });
    }

    if (joinRequest.project._count.members >= joinRequest.project.teamCapacity) {
      throw new HttpError(400, "This project team is full");
    }

    const updated = await prisma.$transaction(async (tx) => {
      const request = await tx.joinRequest.update({
        where: { id: joinRequest.id },
        data: { status: "APPROVED" },
      });
      await tx.projectMember.upsert({
        where: {
          projectId_userId: {
            projectId: joinRequest.projectId,
            userId: joinRequest.userId,
          },
        },
        update: {},
        create: {
          projectId: joinRequest.projectId,
          userId: joinRequest.userId,
        },
      });
      return request;
    });

    res.json({ joinRequest: updated });
  }),
);

export default router;
