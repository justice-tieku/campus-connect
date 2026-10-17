import { Router } from "express";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../middleware/asyncHandler";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.get(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: "desc" },
    });

    const notices = notifications.map((n) => ({
      id: n.id,
      recipient: req.user!.email,
      title: n.title,
      detail: n.body,
      createdAt: n.createdAt.toISOString(),
      read: Boolean(n.readAt),
    }));

    res.json({ notifications, notices });
  }),
);

router.patch(
  "/read",
  requireAuth,
  asyncHandler(async (req, res) => {
    await prisma.notification.updateMany({
      where: { userId: req.user!.id, readAt: null },
      data: { readAt: new Date() },
    });
    res.json({ ok: true });
  }),
);

export default router;
