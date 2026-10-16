import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { api } from "../api";
import { useToast } from "../context/ToastContext";
import { supabase } from "../lib/supabase";

export function VerificationPending() {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const searchParams = new URLSearchParams(location.search);
  const emailParam = searchParams.get("email") || (location.state as { email?: string })?.email || "";

  const [resending, setResending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [resentSuccess, setResentSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleInstantVerify() {
    if (!emailParam) {
      setError("Please return to login or enter your email address.");
      return;
    }
    setError("");
    setVerifying(true);
    try {
      const res = await api.confirmEmail(emailParam);
      toast.success(res.message || "Account verified successfully! Welcome.", "Account Verified");
      navigate("/login", {
        replace: true,
        state: { message: "Your email has been verified! You can now log in." },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to verify email. Please try again.");
      toast.error("Failed to verify account. Please check the email entered.");
    } finally {
      setVerifying(false);
    }
  }

  async function handleResend() {
    if (!emailParam) {
      setError("Please return to login to resend email verification.");
      return;
    }
    setError("");
    setResending(true);
    try {
      const { error: sbError } = await supabase.auth.resend({
        type: "signup",
        email: emailParam,
      });
      if (sbError) throw new Error(sbError.message);
      setResentSuccess(true);
      toast.info(`Verification email resent to ${emailParam}`, "Email Sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend verification email.");
      toast.error("Failed to resend verification link.");
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="min-h-[85vh] bg-[#ffffff] text-[#131b2e] flex flex-col items-center justify-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-[500px]">
        {/* Main Verification Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-emerald-600 text-[24px]">
                mark_email_unread
              </span>
              <h2 className="text-lg font-bold text-slate-900">Email Verification</h2>
            </div>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              Pending Step
            </span>
          </div>

          <p className="text-sm text-slate-600 mb-4 leading-relaxed">
            Verify your university email address. We sent a verification link to{" "}
            <span className="font-semibold text-slate-900 break-all">
              {emailParam || "your email"}
            </span>.
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 mb-6 flex items-start gap-3">
            <span className="material-symbols-outlined text-emerald-600 text-[20px] shrink-0 mt-0.5">
              info
            </span>
            <p className="text-xs text-slate-700 leading-relaxed">
              Please click the link in your email to activate your account.{" "}
              <strong className="text-red-700 font-semibold">
                Unverified accounts cannot log in or access projects.
              </strong>
            </p>
          </div>

          {resentSuccess && (
            <div className="mb-5 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              <span>Verification email has been resent to your inbox!</span>
            </div>
          )}

          {error && (
            <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
              {error}
            </div>
          )}

          {/* Action buttons */}
          <div className="space-y-3">
            {/* Instant verification button */}
            {emailParam && (
              <button
                type="button"
                onClick={handleInstantVerify}
                disabled={verifying}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[16px]">verified</span>
                <span>{verifying ? "Verifying Account…" : "Verify My Account Now"}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="w-full py-2.5 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-2xs disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[16px]">refresh</span>
              <span>{resending ? "Resending email…" : "Resend Verification Email"}</span>
            </button>

            <Link
              to="/login"
              className="w-full py-2.5 px-4 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 no-underline"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              <span>Back to Sign In</span>
            </Link>
          </div>

          {/* Next Steps Checklist */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Next Steps</h3>
            <ul className="space-y-2 text-xs text-slate-500">
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-emerald-600">check</span>
                <span>Open your campus inbox and click "Confirm Email".</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-emerald-600">check</span>
                <span>Complete your software engineering interest profile.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-emerald-600">check</span>
                <span>Join lab workspaces or browse faculty-led internships.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Operational status */}
        <div className="mt-4 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>SSO Systems Operational • Campus Connect v2.5</span>
        </div>
      </div>
    </div>
  );
}
