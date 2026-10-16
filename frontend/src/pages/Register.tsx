import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../auth";
import { supabase } from "../lib/supabase";

type AccountRole = "STUDENT" | "STAFF";

interface RoleOption {
  id: AccountRole;
  label: string;
  icon: string;
  description: string;
  placeholder: string;
}

const ROLES: RoleOption[] = [
  {
    id: "STUDENT",
    label: "Student",
    icon: "school",
    description: "Undergraduate or postgraduate researcher",
    placeholder: "student@university.edu",
  },
  {
    id: "STAFF",
    label: "Staff",
    icon: "badge",
    description: "Campus staff and department coordinator",
    placeholder: "staff@university.edu",
  },
];

export function Register() {
  const { refresh } = useAuth();
  const navigate = useNavigate();

  const [activeRole, setActiveRole] = useState<AccountRole>("STUDENT");
  const [fullName, setFullName] = useState("");
  const [university, setUniversity] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);

  function handleSelectRole(role: AccountRole) {
    setError("");
    setActiveRole(role);
  }

  async function handleGoogleRegister() {
    setError("");
    setGoogleBusy(true);
    try {
      const { error: sbError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (sbError) throw new Error(sbError.message);
    } catch (err) {
      console.error("Google sign up error:", err);
      setError(err instanceof Error ? err.message : "Failed to sign up with Google.");
      setGoogleBusy(false);
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!agreed) {
      setError("Please accept the Terms of Service and Honor Code to continue.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setBusy(true);
    try {
      const res = await api.register({
        email: email.trim().toLowerCase(),
        password,
        role: activeRole,
        firstName: fullName.trim() || undefined,
        institution: university.trim() || undefined,
      });

      if (!res || !res.user) {
        throw new Error("Registration failed. Please try again.");
      }

      await refresh();
      // Navigate to email verification pending screen with email parameter
      navigate(`/verify-email?email=${encodeURIComponent(email.trim().toLowerCase())}`, {
        state: { email: email.trim().toLowerCase() },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center py-10 px-4 sm:px-6">
      <div className="w-full max-w-[480px] flex flex-col">
        {/* Header Section */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto mb-3 shadow-sm">
            <span className="material-symbols-outlined text-[26px]">hub</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mb-1">
            Create your account
          </h1>
          <p className="text-sm text-slate-500">
            Select your account persona to begin
          </p>
        </div>

        {/* Roles 2-Option Switcher */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl mb-4 border border-slate-200">
          {ROLES.map((role) => {
            const isSelected = activeRole === role.id;
            return (
              <button
                key={role.id}
                type="button"
                onClick={() => handleSelectRole(role.id)}
                className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  isSelected
                    ? "bg-white text-emerald-800 shadow-sm border border-slate-200"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {role.icon}
                </span>
                <span>{role.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <form className="space-y-4" onSubmit={onSubmit}>
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="fullName">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder="e.g. Alex Chen"
                className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors"
              />
            </div>

            {/* University Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="university">
                University / Institution Name
              </label>
              <input
                id="university"
                type="text"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                required
                placeholder="e.g. Stanford University or MIT"
                className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors"
              />
            </div>

            {/* Institutional Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="email">
                {activeRole === "STUDENT" ? "Student" : "Staff"} Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder={activeRole === "STUDENT" ? "student@university.edu" : "staff@university.edu"}
                className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors"
              />
            </div>

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  placeholder="Min. 8 chars"
                  className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  placeholder="Re-enter password"
                  className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors"
                />
              </div>
            </div>

            {/* Security Checklist */}
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
              <span className="block text-[11px] font-semibold uppercase text-slate-500 mb-1.5">
                Security Standards Check
              </span>
              <div className="grid grid-cols-2 gap-1.5 text-xs text-slate-600">
                <div className={`flex items-center gap-1 ${password.length >= 8 ? "text-emerald-700 font-semibold" : ""}`}>
                  <span className="material-symbols-outlined text-[15px]">
                    {password.length >= 8 ? "check_circle" : "radio_button_unchecked"}
                  </span>
                  <span>8+ chars</span>
                </div>
                <div className={`flex items-center gap-1 ${/[a-z]/.test(password) && /[A-Z]/.test(password) ? "text-emerald-700 font-semibold" : ""}`}>
                  <span className="material-symbols-outlined text-[15px]">
                    {/[a-z]/.test(password) && /[A-Z]/.test(password) ? "check_circle" : "radio_button_unchecked"}
                  </span>
                  <span>Upper & lower</span>
                </div>
                <div className={`flex items-center gap-1 ${/[0-9]/.test(password) ? "text-emerald-700 font-semibold" : ""}`}>
                  <span className="material-symbols-outlined text-[15px]">
                    {/[0-9]/.test(password) ? "check_circle" : "radio_button_unchecked"}
                  </span>
                  <span>1+ number</span>
                </div>
                <div className={`flex items-center gap-1 ${/[^A-Za-z0-9]/.test(password) ? "text-emerald-700 font-semibold" : ""}`}>
                  <span className="material-symbols-outlined text-[15px]">
                    {/[^A-Za-z0-9]/.test(password) ? "check_circle" : "radio_button_unchecked"}
                  </span>
                  <span>Special symbol</span>
                </div>
              </div>
            </div>

            {/* Policy Agreement Checkbox */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-xs text-slate-600 leading-relaxed">
                  I agree to the <span className="font-semibold text-emerald-700">Terms of Service</span>, university <span className="font-semibold text-emerald-700">Honor Code</span>, and <span className="font-semibold text-emerald-700">Privacy Policy</span>.
                </span>
              </label>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 p-2.5 text-xs text-red-700 border border-red-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={busy || googleBusy}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              <span>{busy ? "Creating account…" : `Create ${activeRole === "STUDENT" ? "Student" : "Staff"} Account`}</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-5 flex items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-3 text-xs uppercase tracking-wider text-slate-400 bg-white px-2">
              or continue with
            </span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleRegister}
            disabled={busy || googleBusy}
            className="w-full py-2.5 px-4 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2.5 shadow-sm disabled:opacity-50"
          >
            {googleBusy ? (
              <span className="text-xs text-slate-500">Connecting to Google…</span>
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>
        </div>

        {/* Footer Redirect to Login */}
        <div className="text-center mt-5">
          <p className="text-xs text-slate-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-emerald-700 hover:text-emerald-800 hover:underline no-underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
