import { Router } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { supabase, supabaseAdmin } from "../lib/supabase";
import { clearAuthCookie, setAuthCookie } from "../lib/auth";
import { asyncHandler } from "../middleware/asyncHandler";
import { requireAuth } from "../middleware/auth";
import { HttpError } from "../lib/httpError";

const router = Router();

const credentialsSchema = z.object({
  email: z.string().trim().email().max(255).transform((v) => v.toLowerCase()),
  password: z.string().min(8).max(128),
  role: z.enum(["STUDENT", "ADMIN", "FACULTY", "ALUMNI", "STAFF"]).optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  institution: z.string().optional(),
  programme: z.string().optional(),
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many attempts. Try again later." },
});

router.post(
  "/register",
  authLimiter,
  asyncHandler(async (req, res) => {
    const { email, password, role, firstName, lastName, institution, programme } = credentialsSchema.parse(req.body);

    // Check if user already exists in our database
    const existingDbUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingDbUser) {
      throw new HttpError(400, "An account with this email address already exists. Please log in instead.");
    }

    // Register with Supabase Admin (bypasses default email rate-limits and auto-confirms email)
    let authUser: { id: string; email?: string } | null = null;

    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const { data: adminData, error: adminError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

      if (adminError) {
        throw new HttpError(400, adminError.message);
      }
      authUser = adminData.user;
    } else {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (authError) {
        throw new HttpError(400, authError.message);
      }
      authUser = authData.user;
    }

    if (!authUser) {
      throw new HttpError(400, "Failed to create user");
    }

    // Create user in our database with Supabase user ID
    const user = await prisma.user.create({
      data: {
        id: authUser.id,
        email: authUser.email!,
        password,
        role: role || "STUDENT",
        firstName,
        lastName,
        institution,
        programme,
        profile: { create: {} },
      },
      select: { id: true, email: true, role: true },
    });

    setAuthCookie(res, { userId: user.id, role: user.role });
    res.status(201).json({ user });
  }),
);

router.post(
  "/login",
  authLimiter,
  asyncHandler(async (req, res) => {
    const { email, password } = credentialsSchema.parse(req.body);

    // Login with Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      throw new HttpError(401, "Invalid email or password");
    }

    if (!authData.user) {
      throw new HttpError(401, "Invalid email or password");
    }

    // Get or create user in our database
    let user = await prisma.user.findUnique({
      where: { id: authData.user.id },
      select: { id: true, email: true, role: true, isActive: true },
    });

    if (!user) {
      // User exists in Supabase but not in our DB (might have been created directly in Supabase)
      user = await prisma.user.create({
        data: {
          id: authData.user.id,
          email: authData.user.email!,
          role: "STUDENT",
          profile: { create: {} },
        },
        select: { id: true, email: true, role: true, isActive: true },
      });
    }

    if (!user.isActive) {
      throw new HttpError(401, "Account is deactivated");
    }

    setAuthCookie(res, { userId: user.id, role: user.role });
    res.json({
      user: { id: user.id, email: user.email, role: user.role },
    });
  }),
);

router.post("/logout", asyncHandler(async (req, res) => {
  clearAuthCookie(res);
  res.json({ ok: true });
}));

router.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        profile: true,
      },
    });
    res.json({ user });
  }),
);

export default router;
