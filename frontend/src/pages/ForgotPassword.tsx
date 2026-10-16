import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";
import { supabase } from "../lib/supabase";

export function ForgotPassword({ defaultTab = "request" }: { defaultTab?: "request" | "reset" }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"request" | "reset">(defaultTab);

  // View 1 states
  const [email, setEmail] = useState("");
  const [requestBusy, setRequestBusy] = useState(false);
  const [requestError, setRequestError] = useState("");
  const [dispatched, setDispatched] = useState(false);

  // View 2 states
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [resetBusy, setResetBusy] = useState(false);
  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);

  // Password criteria check
  const hasLen = newPassword.length >= 8;
  const hasSpec = /[^A-Za-z0-9]/.test(newPassword);
  const hasNum = /[0-9]/.test(newPassword);
  const hasCase = /[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword);

  const criteriaCount = [hasLen, hasSpec, hasNum, hasCase].filter(Boolean).length;
  const strengthText =
    criteriaCount === 0
      ? "None"
      : criteriaCount <= 2
      ? "Weak"
      : criteriaCount === 3
      ? "Moderate"
      : "Strong";

  async function handleSendLink(e: FormEvent) {
    e.preventDefault();
    setRequestError("");
    setRequestBusy(true);
    try {
      const { error: sbError } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      try {
        await api.forgotPassword(email.trim().toLowerCase());
      } catch (_) {}

      if (sbError) {
        console.warn("Supabase notice:", sbError.message);
      }
      setDispatched(true);
    } catch (err) {
      setRequestError(err instanceof Error ? err.message : "Failed to dispatch reset link.");
    } finally {
      setRequestBusy(false);
    }
  }

  async function handleUpdatePassword(e: FormEvent) {
    e.preventDefault();
    setResetError("");

    if (newPassword !== confirmPassword) {
      setResetError("Passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setResetError("Password must be at least 8 characters long.");
      return;
    }

    setResetBusy(true);
    try {
      const { error: sbError } = await supabase.auth.updateUser({ password: newPassword });
      if (sbError) throw new Error(sbError.message);
      setResetSuccess(true);
      setTimeout(() => {
        navigate("/login", { state: { message: "Password updated successfully — please sign in." } });
      }, 2000);
    } catch (err) {
      setResetError(err instanceof Error ? err.message : "Failed to update password. Please request a new link.");
    } finally {
      setResetBusy(false);
    }
  }

  return (
    <div className="min-h-[85vh] bg-[#ffffff] text-[#131b2e] flex flex-col justify-between py-10 px-4 sm:px-6">
      <main className="flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-[540px]">
          {/* Stepper / Status Indicator */}
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              <span className="text-xs uppercase font-semibold text-slate-500 tracking-wider">
                Account Recovery
              </span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
              <span className="material-symbols-outlined text-emerald-600 text-[18px]">timer</span>
              <span className="text-xs text-slate-700 font-semibold">15m Token Expiry</span>
            </div>
          </div>

          {/* Centered Recovery Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm">
            {/* Toggle Tabs */}
            <div className="flex items-center border border-slate-200 rounded-lg p-1 mb-6 bg-slate-50">
              <button
                type="button"
                onClick={() => setTab("request")}
                className={`flex-1 py-1.5 px-3 rounded-lg text-center text-xs font-semibold transition-all ${
                  tab === "request"
                    ? "bg-white text-slate-900 border border-slate-200 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                1. Request Link
              </button>
              <button
                type="button"
                onClick={() => setTab("reset")}
                className={`flex-1 py-1.5 px-3 rounded-lg text-center text-xs font-semibold transition-all ${
                  tab === "reset"
                    ? "bg-white text-slate-900 border border-slate-200 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                2. Set New Password
              </button>
            </div>

            {/* VIEW 1: Request Password Reset Link */}
            {tab === "request" && (
              <section className="space-y-5">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mb-2">
                    Reset your password
                  </h1>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Enter your verified university email address and we will send a secure password reset link (expires in 15 minutes).
                  </p>
                </div>

                {dispatched ? (
                  <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-3">
                    <div className="flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-emerald-600 mt-0.5 text-[20px]">
                        check_circle
                      </span>
                      <div>
                        <p className="text-xs font-bold text-emerald-900">Link dispatched successfully</p>
                        <p className="text-xs text-emerald-700 mt-0.5">
                          We sent a verification link to <span className="font-semibold">{email}</span>. Please check your inbox and campus spam filter.
                        </p>
                      </div>
                    </div>
                    <div className="pt-2 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setDispatched(false)}
                        className="text-xs font-semibold text-emerald-700 hover:underline"
                      >
                        Resend to another email
                      </button>
                      <button
                        type="button"
                        onClick={() => setTab("reset")}
                        className="text-xs font-semibold bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition-colors"
                      >
                        Have token? Continue
                      </button>
                    </div>
                  </div>
                ) : (
                  <form className="space-y-4" onSubmit={handleSendLink}>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="university-email">
                        University Email Address
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3 text-slate-400 material-symbols-outlined text-[18px]">
                          mail
                        </span>
                        <input
                          id="university-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          placeholder="student_id@university.edu"
                          className="w-full pl-9 pr-14 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors"
                        />
                        <span className="absolute right-2 px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-500">
                          .edu
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-400">Must be an active accredited institutional domain</p>
                    </div>

                    {requestError && (
                      <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
                        {requestError}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={requestBusy}
                      className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[16px]">send</span>
                      <span>{requestBusy ? "Dispatching link…" : "Send Reset Link"}</span>
                    </button>
                  </form>
                )}
              </section>
            )}

            {/* VIEW 2: Set New Password */}
            {tab === "reset" && (
              <section className="space-y-5">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold mb-2">
                    <span className="material-symbols-outlined text-[16px]">verified_user</span>
                    <span>Security Verification</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mb-1">
                    Create new password
                  </h2>
                  <p className="text-sm text-slate-500">
                    Establish a strong password that meets the university's cybersecurity standards.
                  </p>
                </div>

                {resetSuccess ? (
                  <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-center space-y-2">
                    <span className="material-symbols-outlined text-emerald-600 text-3xl">check_circle</span>
                    <p className="text-sm font-bold">Password Updated Successfully!</p>
                    <p className="text-xs text-slate-500">Redirecting to login…</p>
                  </div>
                ) : (
                  <form className="space-y-4" onSubmit={handleUpdatePassword}>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="new-password">
                        New Password
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3 text-slate-400 material-symbols-outlined text-[18px]">lock</span>
                        <input
                          id="new-password"
                          type={showPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                          minLength={8}
                          placeholder="Enter strong password"
                          className="w-full pl-9 pr-10 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 text-slate-400 hover:text-slate-600"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            {showPassword ? "visibility_off" : "visibility"}
                          </span>
                        </button>
                      </div>

                      {/* Password Strength Meter */}
                      <div className="mt-2.5 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-slate-500">Strength rating</span>
                          <span className="text-[11px] font-semibold text-emerald-700">{strengthText}</span>
                        </div>
                        <div className="grid grid-cols-4 gap-1 h-1.5 w-full bg-slate-100 rounded overflow-hidden">
                          <div className={`transition-all ${criteriaCount >= 1 ? "bg-emerald-600" : "bg-slate-200"}`}></div>
                          <div className={`transition-all ${criteriaCount >= 2 ? "bg-emerald-600" : "bg-slate-200"}`}></div>
                          <div className={`transition-all ${criteriaCount >= 3 ? "bg-emerald-600" : "bg-slate-200"}`}></div>
                          <div className={`transition-all ${criteriaCount >= 4 ? "bg-emerald-600" : "bg-slate-200"}`}></div>
                        </div>
                      </div>

                      {/* Requirements checklist */}
                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-500">
                        <div className={`flex items-center gap-1.5 ${hasLen ? "text-emerald-700 font-semibold" : ""}`}>
                          <span className="material-symbols-outlined text-[16px]">
                            {hasLen ? "check_circle" : "radio_button_unchecked"}
                          </span>
                          <span>8+ characters</span>
                        </div>
                        <div className={`flex items-center gap-1.5 ${hasSpec ? "text-emerald-700 font-semibold" : ""}`}>
                          <span className="material-symbols-outlined text-[16px]">
                            {hasSpec ? "check_circle" : "radio_button_unchecked"}
                          </span>
                          <span>Special character</span>
                        </div>
                        <div className={`flex items-center gap-1.5 ${hasNum ? "text-emerald-700 font-semibold" : ""}`}>
                          <span className="material-symbols-outlined text-[16px]">
                            {hasNum ? "check_circle" : "radio_button_unchecked"}
                          </span>
                          <span>Numeric digits (0-9)</span>
                        </div>
                        <div className={`flex items-center gap-1.5 ${hasCase ? "text-emerald-700 font-semibold" : ""}`}>
                          <span className="material-symbols-outlined text-[16px]">
                            {hasCase ? "check_circle" : "radio_button_unchecked"}
                          </span>
                          <span>Upper & lowercase</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="confirm-password">
                        Confirm New Password
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3 text-slate-400 material-symbols-outlined text-[18px]">lock_reset</span>
                        <input
                          id="confirm-password"
                          type={showConfirm ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          minLength={8}
                          placeholder="Re-enter password"
                          className="w-full pl-9 pr-10 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm(!showConfirm)}
                          className="absolute right-3 text-slate-400 hover:text-slate-600"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            {showConfirm ? "visibility_off" : "visibility"}
                          </span>
                        </button>
                      </div>
                    </div>

                    {resetError && (
                      <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
                        {resetError}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={resetBusy}
                      className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[16px]">vpn_key</span>
                      <span>{resetBusy ? "Updating password…" : "Update Password & Log In"}</span>
                    </button>
                  </form>
                )}
              </section>
            )}

            {/* Institutional Security Notice */}
            <div className="mt-6 pt-4 border-t border-slate-100">
              <div className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-slate-400 text-[18px] mt-0.5 shrink-0">shield</span>
                <p className="text-xs text-slate-500 leading-relaxed">
                  <span className="font-semibold text-slate-700">Security Policy:</span> For institutional security, password reset tokens expire after 15 minutes. If your account uses Campus SSO, contact your university IT department.
                </p>
              </div>
            </div>

            {/* Back to Login Link */}
            <div className="mt-4 pt-3 text-center border-t border-slate-100">
              <Link
                to="/login"
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center justify-center gap-1 no-underline"
              >
                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                <span>Back to Login</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
