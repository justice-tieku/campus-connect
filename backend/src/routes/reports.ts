import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../middleware/asyncHandler";
import { requireAuth } from "../middleware/auth";
import { HttpError } from "../lib/httpError";

const router = Router();

const reportSchema = z
  .object({
    reason: z.string().trim().min(5).max(1000),
    projectId: z.string().uuid().optional(),
    reportedUserId: z.string().uuid().optional(),
  })
  .refine((data) => data.projectId || data.reportedUserId, {
    message: "A project or user must be specified",
  });

router.post(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const data = reportSchema.parse(req.body);
    if (data.reportedUserId === req.user!.id) {
      throw new HttpError(400, "You cannot report yourself");
    }
    const report = await prisma.report.create({
      data: {
        reason: data.reason,
        projectId: data.projectId,
        reportedUserId: data.reportedUserId,
        reporterId: req.user!.id,
      },
    });
    res.status(201).json({ report });
  }),
);

export default router;
