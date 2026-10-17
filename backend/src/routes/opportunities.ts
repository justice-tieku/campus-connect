import { Router } from "express";
import { z } from "zod";
import { OpportunityType } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../middleware/asyncHandler";
import { requireAuth } from "../middleware/auth";

const router = Router();

const opportunitySchema = z.object({
  title: z.string().trim().min(3),
  description: z.string().trim().default(""),
  company: z.string().trim().optional(),
  location: z.string().trim().optional(),
  skills: z.union([z.array(z.string().trim()), z.string()]).optional(),
  type: z.nativeEnum(OpportunityType).optional(),
  link: z.string().trim().url().optional(),
  applyUrl: z.string().trim().url().optional(),
});

function formatOpportunity(opp: any) {
  return {
    id: opp.id,
    title: opp.title,
    description: opp.description,
    company: opp.company || "Partner Organization",
    location: opp.location || "Remote",
    skills: opp.skills || [],
    applyUrl: opp.link || "https://linkedin.com",
    type: opp.type,
    createdAt: opp.createdAt.toISOString(),
  };
}

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    const raw = await prisma.opportunity.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        createdBy: { select: { id: true, email: true } },
      },
    });

    const opportunities = raw.map(formatOpportunity);
    res.json({ opportunities });
  }),
);

router.post(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const data = opportunitySchema.parse(req.body);
    const parsedSkills = Array.isArray(data.skills)
      ? data.skills
      : typeof data.skills === "string"
      ? data.skills.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    const link = data.applyUrl || data.link;

    const opp = await prisma.opportunity.create({
      data: {
        title: data.title,
        description: data.description || `${data.company || "Partner"} opportunity`,
        company: data.company,
        location: data.location || "Remote",
        skills: parsedSkills,
        type: data.type || OpportunityType.INTERNSHIP,
        link,
        createdById: req.user!.id,
      },
    });

    res.status(201).json({ opportunity: formatOpportunity(opp) });
  }),
);

export default router;
