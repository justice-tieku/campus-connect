import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../auth";
import { Logo } from "../components/Logo";

type AccountType = "STUDENT" | "FACULTY" | "ALUMNI" | "STAFF";

const accountTypes: {
  value: AccountType;
  label: string;
  icon: string;
  desc: string;
  color: string;
  activeColor: string;
}[] = [
  {
    value: "STUDENT",
    label: "Student",
    icon: "fa-solid fa-graduation-cap",
    desc: "Undergraduate or postgraduate",
    color: "border-surface-200 hover:border-brand-400",
    activeColor: "border-brand-500 bg-brand-50 dark:bg-brand-900/20 dark:border-brand-500",
  },
  {
    value: "FACULTY",
    label: "Faculty",
    icon: "fa-solid fa-chalkboard-user",
    desc: "Lecturer or researcher",
    color: "border-surface-200 hover:border-purple-400",
    activeColor: "border-purple-500 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-500",
  },
  {
    value: "ALUMNI",
    label: "Alumni",
    icon: "fa-solid fa-user-tie",
    desc: "Graduate of any campus",
    color: "border-surface-200 hover:border-emerald-400",
    activeColor: "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-500",
  },
  {
    value: "STAFF",
    label: "Staff",
    icon: "fa-solid fa-id-badge",
    desc: "Admin or support staff",
    color: "border-surface-200 hover:border-amber-400",
    activeColor: "border-amber-500 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-500",
  },
];

export function Register() {
  const { refresh } = useAuth();
  const navigate = useNavigate();

  const [accountType, setAccountType] = useState<AccountType>("STUDENT");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [institution, setInstitution] = useState("");
  const [programme, setProgramme] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // Password strength
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
      setError("Password must be at least 8 characters.");
      return;
    }

    setBusy(true);
    try {
      const res = await api.register({
        email: email.trim().toLowerCase(),
        password,
        role: "STUDENT",
        firstName: firstName.trim() || undefined,
        lastName: lastName.trim() || undefined,
        institution: institution.trim() || undefined,
        programme: programme.trim() || undefined,
      });

      if (!res || !res.user) {
        throw new Error("Registration failed. Please check your details and try again.");
      }

      // After registration, store account type in biography
      if (accountType !== "STUDENT") {
        try {
          await api.updateProfile({ biography: `[${accountType}]` });
        } catch (_) {}
      }

      await refresh();
      navigate("/projects", { state: { message: "Account created! Welcome to CampusConnect." } });
    } catch (err) {
      console.error("Registration error:", err);
      setError(err instanceof Error ? err.message : "Registration failed. Please check your information.");
    } finally {
      setBusy(false);
    }
  }

  const selectedType = accountTypes.find((t) => t.value === accountType)!;

  return (
    <div className="min-h-screen py-10 px-4 animate-fade-in">
      <div className="mx-auto w-full max-w-lg">
        {/* Logo + heading */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 no-underline mb-5">
            <Logo size={36} />
            <span className="font-display text-lg font-bold text-surface-900 dark:text-surface-100">
              Campus<span className="text-brand-600">Connect</span>
            </span>
          </Link>
          <h1 className="font-display text-3xl font-bold text-surface-900 dark:text-surface-100">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-surface-500 dark:text-surface-400">
            Join thousands of campus builders — free forever.
          </p>
        </div>

        <div className="panel p-8 shadow-sm dark:shadow-none">
          <form className="space-y-6" onSubmit={onSubmit}>

            {/* ── Account type selector ── */}
            <div>
              <label className="mb-3 block text-sm font-semibold text-surface-700 dark:text-surface-300">
                I am a…
              </label>
              <div className="grid grid-cols-2 gap-3">
                {accountTypes.map((t) => {
                  const isActive = accountType === t.value;
                  return (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setAccountType(t.value)}
                      className={`flex flex-col items-start gap-1 rounded-xl border-2 p-3.5 text-left transition-all duration-150 ${
                        isActive ? t.activeColor : t.color + " dark:border-surface-700 dark:hover:border-surface-500"
                      }`}
                    >
                      <div className="flex items-center gap-2 w-full">
                        <i className={`${t.icon} text-sm ${isActive ? "text-brand-600 dark:text-brand-400" : "text-surface-400"}`}></i>
                        <span className={`text-sm font-semibold ${isActive ? "text-surface-900 dark:text-surface-100" : "text-surface-600 dark:text-surface-400"}`}>
                          {t.label}
                        </span>
                        {isActive && (
                          <i className="fa-solid fa-circle-check ml-auto text-xs text-brand-600 dark:text-brand-400"></i>
                        )}
                      </div>
                      <span className="text-xs text-surface-400 dark:text-surface-500 pl-5">
                        {t.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-xs text-surface-400 dark:text-surface-500">
                <i className="fa-solid fa-circle-info mr-1"></i>
                Admin accounts are provisioned separately by the platform team.
              </p>
            </div>

            {/* ── Name fields ── */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">
                  First name
                </label>
                <input
                  className="input"
                  type="text"
                  autoComplete="given-name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">
                  Last name
                </label>
                <input
                  className="input"
                  type="text"
                  autoComplete="family-name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                />
              </div>
            </div>

            {/* ── Email ── */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">
                Email address <span className="text-red-500">*</span>
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

            {/* ── Institution + Programme ── */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">
                  Institution
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <i className="fa-solid fa-building-columns text-xs text-surface-400"></i>
                  </div>
                  <input
                    className="input pl-10"
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="University name"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">
                  {accountType === "FACULTY" || accountType === "STAFF" ? "Department" : "Programme"}
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <i className="fa-solid fa-book-open text-xs text-surface-400"></i>
                  </div>
                  <input
                    className="input pl-10"
                    type="text"
                    value={programme}
                    onChange={(e) => setProgramme(e.target.value)}
                    placeholder={accountType === "FACULTY" || accountType === "STAFF" ? "e.g. Computer Science" : "e.g. BSc. Engineering"}
                  />
                </div>
              </div>
            </div>

            {/* ── Password ── */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">
                Password <span className="text-red-500">*</span>
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
                  placeholder="Min. 8 characters"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"} text-xs`}></i>
                </button>
              </div>
              {/* Strength indicator */}
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
                    <span className="ml-2 text-surface-300 dark:text-surface-600">
                      — use uppercase, numbers & symbols for a strong password
                    </span>
                  </p>
                </div>
              )}
            </div>

            {/* ── Confirm password ── */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">
                Confirm password <span className="text-red-500">*</span>
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
                  placeholder="Repeat your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300"
                  onClick={() => setShowConfirm(!showConfirm)}
                  tabIndex={-1}
                >
                  <i className={`fa-solid ${showConfirm ? "fa-eye-slash" : "fa-eye"} text-xs`}></i>
                </button>
              </div>
              {confirmPassword.length > 0 && password !== confirmPassword && (
                <p className="mt-1 text-xs text-red-500">
                  <i className="fa-solid fa-circle-xmark mr-1"></i>Passwords don't match
                </p>
              )}
              {confirmPassword.length > 0 && password === confirmPassword && password.length >= 8 && (
                <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
                  <i className="fa-solid fa-circle-check mr-1"></i>Looks good!
                </p>
              )}
            </div>

            {/* ── Error ── */}
            {error && (
              <div className="flex items-start gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-700 ring-1 ring-red-200 dark:bg-red-900/20 dark:text-red-300 dark:ring-red-800">
                <i className="fa-solid fa-circle-exclamation mt-0.5 text-red-500 dark:text-red-400 flex-shrink-0"></i>
                <span>{error}</span>
              </div>
            )}

            {/* ── Submit ── */}
            <button
              className="btn-primary w-full py-3 text-base"
              disabled={busy}
            >
              {busy ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin text-sm"></i>
                  Creating your account…
                </>
              ) : (
                <>
                  <i className={`${selectedType.icon} text-sm`}></i>
                  Join as {selectedType.label}
                </>
              )}
            </button>

            <p className="text-center text-xs text-surface-400 dark:text-surface-500">
              By signing up you agree to our{" "}
              <span className="text-brand-600 cursor-pointer hover:underline">Terms</span> &amp;{" "}
              <span className="text-brand-600 cursor-pointer hover:underline">Privacy Policy</span>.
            </p>
          </form>

          <div className="mt-6 text-center border-t border-surface-100 dark:border-surface-800 pt-5">
            <p className="text-sm text-surface-500 dark:text-surface-400">
              Already have an account?{" "}
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
