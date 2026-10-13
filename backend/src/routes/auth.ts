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

    const token = signToken({ userId: user.id, role: user.role });
    setAuthCookie(res, { userId: user.id, role: user.role });
    res.status(201).json({ user, token });
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

    const token = signToken({ userId: user.id, role: user.role });
    setAuthCookie(res, { userId: user.id, role: user.role });
    res.json({
      user: { id: user.id, email: user.email, role: user.role },
      token,
    });
  }),
);

router.post("/logout", asyncHandler(async (req, res) => {
  clearAuthCookie(res);
  res.json({ ok: true });
}));

router.post(
  "/sync-oauth",
  asyncHandler(async (req, res) => {
    const { email, id } = z.object({
      email: z.string().trim().email(),
      id: z.string(),
    }).parse(req.body);

    // Upsert user in our database
    let user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, role: true, isActive: true },
    });

    if (!user) {
      // Check if user exists with this email under different id
      const existingByEmail = await prisma.user.findUnique({ where: { email } });
      if (existingByEmail) {
        user = existingByEmail;
      } else {
        user = await prisma.user.create({
          data: {
            id,
            email,
            role: "STUDENT",
            profile: { create: {} },
          },
          select: { id: true, email: true, role: true, isActive: true },
        });
      }
    }

    if (!user.isActive) {
      throw new HttpError(401, "Account is deactivated");
    }

    const token = signToken({ userId: user.id, role: user.role });
    setAuthCookie(res, { userId: user.id, role: user.role });
    res.json({
      user: { id: user.id, email: user.email, role: user.role },
      token,
    });
  }),
);

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

router.post(
  "/forgot-password",
  authLimiter,
  asyncHandler(async (req, res) => {
    const { email } = z.object({ email: z.string().trim().email() }).parse(req.body);
    const origin = req.headers.origin || process.env.CLIENT_ORIGIN || "https://campusconnect-gh.vercel.app";
    const redirectTo = `${origin}/reset-password`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    if (error) {
      throw new HttpError(400, error.message);
    }
    res.json({ message: "Password reset link sent to your email." });
  }),
);

router.post(
  "/reset-password",
  authLimiter,
  asyncHandler(async (req, res) => {
    const { password, token } = z.object({
      password: z.string().min(8),
      token: z.string().optional(),
    }).parse(req.body);

    if (token) {
      // If token provided via admin / verify
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: "recovery",
      });
      if (error) throw new HttpError(400, error.message);
      if (data.user) {
        await supabaseAdmin.auth.admin.updateUserById(data.user.id, { password });
      }
    }
    res.json({ message: "Password successfully updated." });
  }),
);

export default router;
