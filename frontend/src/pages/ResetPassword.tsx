import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { Logo } from "../components/Logo";

export function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [sessionReady, setSessionReady] = useState<boolean | null>(null);

  // Supabase sends the user here with a hash fragment that auto-establishes a session
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSessionReady(!!data.session);
    });

    // Also listen for the PASSWORD_RECOVERY event (Supabase fires this after hash parse)
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setSessionReady(true);
      }
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const strength = (() => {
    if (password.length === 0) return 0;
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  })();

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", "bg-red-500", "bg-amber-500", "bg-yellow-400", "bg-emerald-500"][strength];

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords don't match. Please check and try again.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setBusy(true);
    try {
      const { error: sbError } = await supabase.auth.updateUser({ password });
      if (sbError) throw new Error(sbError.message);
      navigate("/login", { state: { message: "Password updated successfully — please log in." } });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset password. Please request a new link.");
    } finally {
      setBusy(false);
    }
  }

  // Loading state while we check session
  if (sessionReady === null) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="text-center">
          <i className="fa-solid fa-spinner fa-spin text-2xl text-brand-600 mb-3"></i>
          <p className="text-surface-500">Verifying reset link…</p>
        </div>
      </div>
    );
  }

  // No session = invalid/expired link
  if (!sessionReady) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center animate-fade-in px-4">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 mb-5">
            <i className="fa-solid fa-link-slash text-3xl text-red-600 dark:text-red-400"></i>
          </div>
          <h1 className="font-display text-2xl font-bold text-surface-900 dark:text-surface-100 mb-2">
            Link expired or invalid
          </h1>
          <p className="text-surface-500 dark:text-surface-400 mb-8">
            This password reset link has expired or is no longer valid. Request a new one below.
          </p>
          <Link to="/forgot-password" className="btn-primary no-underline w-full">
            <i className="fa-solid fa-rotate-right text-xs"></i>
            Request a new reset link
          </Link>
          <div className="mt-4">
            <Link to="/login" className="text-sm text-brand-600 hover:text-brand-700 dark:text-brand-400 font-medium">
              Back to login
            </Link>
          </div>
        </div>
      </div>
    );
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
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-100 dark:bg-brand-900/30 mb-4">
            <i className="fa-solid fa-lock-open text-2xl text-brand-600 dark:text-brand-400"></i>
          </div>
          <h1 className="mt-3 font-display text-2xl font-bold text-surface-900 dark:text-surface-100">
            Set a new password
          </h1>
          <p className="mt-2 text-sm text-surface-500 dark:text-surface-400">
            Choose a strong password you haven't used before.
          </p>
        </div>

        {/* Card */}
        <div className="panel p-8 shadow-sm dark:shadow-none">
          <form className="space-y-5" onSubmit={onSubmit}>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">
                New password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <i className="fa-solid fa-lock text-xs text-surface-400"></i>
                </div>
                <input
                  className="input pl-10 pr-10"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-surface-400 hover:text-surface-600"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"} text-xs`}></i>
                </button>
              </div>
              {/* Strength bar */}
              {password.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          i <= strength ? strengthColor : "bg-surface-200 dark:bg-surface-700"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-surface-400">
                    Strength: <span className="font-medium text-surface-700 dark:text-surface-300">{strengthLabel}</span>
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">
                Confirm new password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <i className="fa-solid fa-lock text-xs text-surface-400"></i>
                </div>
                <input
                  className="input pl-10 pr-10"
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-surface-400 hover:text-surface-600"
                  onClick={() => setShowConfirm(!showConfirm)}
                  tabIndex={-1}
                >
                  <i className={`fa-solid ${showConfirm ? "fa-eye-slash" : "fa-eye"} text-xs`}></i>
                </button>
              </div>
              {confirmPassword.length > 0 && password !== confirmPassword && (
                <p className="mt-1 text-xs text-red-500">
                  <i className="fa-solid fa-circle-xmark mr-1"></i>
                  Passwords don't match
                </p>
              )}
              {confirmPassword.length > 0 && password === confirmPassword && password.length >= 8 && (
                <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
                  <i className="fa-solid fa-circle-check mr-1"></i>
                  Passwords match
                </p>
              )}
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
                  Updating password…
                </>
              ) : (
                <>
                  <i className="fa-solid fa-shield-check text-xs"></i>
                  Update password
                </>
              )}
            </button>
          </form>

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
