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
  const [showPassword, setShowPassword] = useState(false);
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
      console.error("Login failure:", err);
      const msg = err instanceof Error ? err.message : "Invalid credentials or network issue";
      setError(msg);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-8 px-4 animate-fade-in">
      <div className="w-full max-w-md">
        
        {/* Branding header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 no-underline mb-6">
            <Logo size={42} />
            <span className="font-display text-xl font-bold tracking-tight text-surface-900 dark:text-surface-100">
              Campus<span className="text-brand-600">Connect</span>
            </span>
          </Link>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-surface-900 dark:text-surface-100 tracking-tight">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-surface-500">
            Sign in with your campus credentials to access your projects
          </p>

          {message && (
            <div className="mt-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 p-3 text-xs font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2">
              <i className="fa-solid fa-circle-check text-emerald-500"></i>
              <span>{message}</span>
            </div>
          )}
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 p-8 shadow-xl">
          <form className="space-y-5" onSubmit={onSubmit}>
            
            {/* Email input */}
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-surface-700 dark:text-surface-300">
                Email address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-surface-400">
                  <i className="fa-solid fa-envelope text-sm"></i>
                </div>
                <input
                  className="input pl-10"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@university.edu"
                />
              </div>
            </div>

            {/* Password input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-surface-700 dark:text-surface-300">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 no-underline"
                >
                  Forgot password? Reset now
                </Link>
              </div>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-surface-400">
                  <i className="fa-solid fa-lock text-sm"></i>
                </div>
                <input
                  className="input pl-10 pr-10"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-surface-400 hover:text-surface-600"
                >
                  <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"} text-xs`}></i>
                </button>
              </div>
            </div>

            {/* Error banner */}
            {error && (
              <div className="rounded-xl bg-red-50 dark:bg-red-950/40 p-3.5 text-xs text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 flex items-start gap-2.5 animate-slide-down">
                <i className="fa-solid fa-circle-exclamation mt-0.5 text-red-500 shrink-0"></i>
                <span>{error}</span>
              </div>
            )}

            {/* Sign in button */}
            <button
              className="btn-primary w-full py-3.5 text-sm font-bold rounded-2xl shadow-md hover:shadow-lg transition-all"
              disabled={busy || googleBusy}
            >
              {busy ? (
                <>
                  <i className="fa-solid fa-circle-notch fa-spin text-sm mr-2"></i>
                  Signing in…
                </>
              ) : (
                <>
                  <span>Sign in to account</span>
                  <i className="fa-solid fa-arrow-right text-xs ml-2"></i>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6 text-center">
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
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-800 dark:text-surface-100 font-semibold text-sm hover:bg-surface-50 dark:hover:bg-surface-700/80 transition-all shadow-sm"
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

          {/* Bottom link */}
          <div className="mt-8 pt-6 border-t border-surface-100 dark:border-surface-800 text-center">
            <p className="text-sm text-surface-500">
              Don't have an account yet?{" "}
              <Link to="/register" className="font-bold text-brand-600 hover:text-brand-700 dark:text-brand-400 no-underline">
                Create account &rarr;
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
