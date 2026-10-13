import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { Logo } from "../components/Logo";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const { error: sbError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (sbError) throw new Error(sbError.message);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send reset email. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center animate-fade-in px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 no-underline mb-6">
            <Logo size={36} />
            <span className="font-display text-lg font-bold text-surface-900 dark:text-surface-100">
              Campus<span className="text-brand-600">Connect</span>
            </span>
          </Link>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-900/30 mb-4">
            <i className="fa-solid fa-key text-2xl text-amber-600 dark:text-amber-400"></i>
          </div>
          <h1 className="mt-3 font-display text-2xl font-bold text-surface-900 dark:text-surface-100">
            Forgot your password?
          </h1>
          <p className="mt-2 text-sm text-surface-500 dark:text-surface-400">
            No worries — enter your email and we'll send a secure reset link straight to your inbox.
          </p>
        </div>

        {/* Card */}
        <div className="panel p-8 shadow-sm dark:shadow-none">
          {success ? (
            <div className="text-center py-4">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-5">
                <i className="fa-solid fa-paper-plane text-3xl text-emerald-600 dark:text-emerald-400"></i>
              </div>
              <h2 className="text-xl font-bold text-surface-900 dark:text-surface-100 mb-2">
                Check your inbox!
              </h2>
              <p className="text-sm text-surface-500 dark:text-surface-400 mb-1">
                We sent a reset link to:
              </p>
              <p className="font-semibold text-brand-600 dark:text-brand-400 mb-6 break-all">
                {email}
              </p>
              <p className="text-xs text-surface-400 dark:text-surface-500 mb-6">
                Didn't get it? Check your spam folder or{" "}
                <button
                  className="text-brand-600 hover:text-brand-700 dark:text-brand-400 font-medium"
                  onClick={() => setSuccess(false)}
                >
                  try again
                </button>
                .
              </p>
              <Link to="/login" className="btn-primary w-full no-underline">
                <i className="fa-solid fa-arrow-left text-xs"></i>
                Back to login
              </Link>
            </div>
          ) : (
            <form className="space-y-5" onSubmit={onSubmit}>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">
                  Email address
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <i className="fa-solid fa-envelope text-xs text-surface-400"></i>
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

              {error && (
                <div className="flex items-start gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-700 ring-1 ring-red-200 animate-slide-down dark:bg-red-900/20 dark:text-red-300 dark:ring-red-800">
                  <i className="fa-solid fa-circle-exclamation mt-0.5 text-red-500 dark:text-red-400 flex-shrink-0"></i>
                  <span>{error}</span>
                </div>
              )}

              <button className="btn-primary w-full py-3" disabled={busy}>
                {busy ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin text-xs"></i>
                    Sending reset link…
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-paper-plane text-xs"></i>
                    Send reset link
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-6 text-center border-t border-surface-100 dark:border-surface-800 pt-5">
            <p className="text-sm text-surface-500 dark:text-surface-400">
              Remember your password?{" "}
              <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
