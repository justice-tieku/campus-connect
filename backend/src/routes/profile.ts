import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../middleware/asyncHandler";
import { requireAuth } from "../middleware/auth";

const router = Router();

const optionalUrl = z
  .string()
  .trim()
  .url()
  .max(500)
  .optional()
  .or(z.literal("").transform(() => undefined));

const profileSchema = z.object({
  biography: z.string().max(2000).optional(),
  institution: z.string().max(200).optional(),
  programme: z.string().max(200).optional(),
  skills: z.array(z.string().trim().min(1).max(50)).max(30).optional(),
  githubLink: optionalUrl,
  portfolioLink: optionalUrl,
  imageUrl: optionalUrl,
});

router.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    const profile = await prisma.profile.findUnique({
      where: { userId: req.user!.id },
    });
    res.json({ profile });
  }),
);

router.patch(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    const data = profileSchema.parse(req.body);
    const profile = await prisma.profile.upsert({
      where: { userId: req.user!.id },
      update: data,
      create: { userId: req.user!.id, ...data },
    });
    res.json({ profile });
  }),
);

export default router;
