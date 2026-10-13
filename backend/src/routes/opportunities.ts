import { Router } from "express";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../middleware/asyncHandler";

const router = Router();

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    const opportunities = await prisma.opportunity.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        createdBy: { select: { id: true, email: true } },
      },
    });
    res.json({ opportunities });
  }),
);

export default router;
