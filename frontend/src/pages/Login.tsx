import { FormEvent, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../auth";
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
              disabled={busy}
            >
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </form>

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
