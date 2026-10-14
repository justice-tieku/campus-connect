import { FormEvent, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../auth";
import { supabase } from "../lib/supabase";
import { Logo } from "../components/Logo";

export function Login() {
  const { refresh } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string; message?: string } | null)?.from || "/projects";
  const message = (location.state as { from?: string; message?: string } | null)?.message;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);

  async function handleGoogleLogin() {
    setError("");
    setGoogleBusy(true);
    try {
      const { error: sbError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/projects`,
        },
      });
      if (sbError) throw new Error(sbError.message);
    } catch (err) {
      console.error("Google sign in error:", err);
      setError(err instanceof Error ? err.message : "Failed to sign in with Google.");
      setGoogleBusy(false);
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await api.login(email.trim().toLowerCase(), password);
      if (!res || !res.user) {
        throw new Error("Unable to sign in. Please verify your email and password.");
      }
      await refresh();
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Invalid credentials or network issue";
      setError(msg);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-10 px-4 bg-surface-50 dark:bg-surface-950">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 no-underline mb-3">
            <Logo size={40} />
            <span className="font-display text-xl font-bold text-surface-900 dark:text-surface-100">
              Campus<span className="text-brand-600">Connect</span>
            </span>
          </Link>
          <h1 className="font-display text-2xl font-bold text-surface-900 dark:text-surface-100">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">
            Sign in with your email and password
          </p>

          {message && (
            <div className="mt-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 p-3 text-xs font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              {message}
            </div>
          )}
        </div>

        {/* Card Form */}
        <div className="panel p-6 shadow-sm dark:shadow-none">
          <form className="space-y-4" onSubmit={onSubmit}>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">
                Email
              </label>
              <input
                className="input"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@university.edu"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 no-underline"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                className="input"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 dark:bg-red-950/40 p-3 text-xs text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn-primary w-full py-2.5 text-sm font-semibold"
              disabled={busy || googleBusy}
            >
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-5 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-surface-200 dark:border-surface-800"></div>
            </div>
            <span className="relative bg-white dark:bg-surface-900 px-3 text-xs uppercase tracking-wider text-surface-400 font-semibold">
              Or continue with
            </span>
          </div>

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={busy || googleBusy}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-800 dark:text-surface-100 font-semibold text-sm hover:bg-surface-50 dark:hover:bg-surface-700/80 transition-all shadow-sm"
          >
            {googleBusy ? (
              <>
                <i className="fa-solid fa-circle-notch fa-spin text-sm"></i>
                <span>Connecting to Google…</span>
              </>
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

          <div className="mt-6 text-center">
            <p className="text-sm text-surface-500 dark:text-surface-400">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 no-underline"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
