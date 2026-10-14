import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../auth";
import { Logo } from "../components/Logo";

type AccountRole = "STUDENT" | "STAFF" | "ADMIN" | "ALUMNI";

interface RoleOption {
  id: AccountRole;
  label: string;
  description: string;
  placeholder: string;
}

const ROLES: RoleOption[] = [
  {
    id: "STUDENT",
    label: "Student",
    description: "For undergraduate and postgraduate students",
    placeholder: "student@university.edu",
  },
  {
    id: "STAFF",
    label: "Staff",
    description: "For campus staff and department coordinators",
    placeholder: "staff@university.edu",
  },
  {
    id: "ADMIN",
    label: "Admin",
    description: "For platform and institutional administrators",
    placeholder: "admin@university.edu",
  },
  {
    id: "ALUMNI",
    label: "Alumni",
    description: "For graduates and alumni mentors",
    placeholder: "alumni@university.edu",
  },
];

export function Register() {
  const { refresh } = useAuth();
  const navigate = useNavigate();

  const [activeRole, setActiveRole] = useState<AccountRole | null>("STUDENT");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function handleSelectRole(role: AccountRole) {
    setError("");
    setActiveRole((prev) => (prev === role ? null : role));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!activeRole) {
      setError("Please select an account type above");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setBusy(true);
    try {
      const res = await api.register({
        email: email.trim().toLowerCase(),
        password,
        role: activeRole,
      });

      if (!res || !res.user) {
        throw new Error("Registration failed. Please try again.");
      }

      await refresh();
      navigate("/projects", { state: { message: "Account created successfully!" } });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed. Please try again.");
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
            Create an Account
          </h1>
          <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">
            Choose your role to get started
          </p>
        </div>

        {/* Roles Accordion List */}
        <div className="space-y-3">
          {ROLES.map((role) => {
            const isOpen = activeRole === role.id;
            return (
              <div
                key={role.id}
                className={`panel overflow-hidden transition-all duration-200 border ${
                  isOpen
                    ? "border-brand-600 ring-1 ring-brand-600/30 dark:border-brand-500"
                    : "border-surface-200 dark:border-surface-800 hover:border-surface-300 dark:hover:border-surface-700"
                }`}
              >
                {/* Role Header Button */}
                <button
                  type="button"
                  onClick={() => handleSelectRole(role.id)}
                  className="w-full p-4 flex items-center justify-between text-left transition-colors bg-white dark:bg-surface-900"
                >
                  <div>
                    <span
                      className={`block text-base font-semibold ${
                        isOpen
                          ? "text-brand-600 dark:text-brand-400"
                          : "text-surface-900 dark:text-surface-100"
                      }`}
                    >
                      {role.label}
                    </span>
                    <span className="block text-xs text-surface-500 dark:text-surface-400 mt-0.5">
                      {role.description}
                    </span>
                  </div>
                  <div
                    className={`h-7 w-7 rounded-full flex items-center justify-center text-xs transition-transform duration-200 ${
                      isOpen
                        ? "bg-brand-50 text-brand-600 dark:bg-brand-950/50 dark:text-brand-400 rotate-90"
                        : "bg-surface-100 text-surface-400 dark:bg-surface-800 dark:text-surface-500"
                    }`}
                  >
                    ▶
                  </div>
                </button>

                {/* Drop-down Form for Active Role */}
                {isOpen && (
                  <div className="px-5 pb-5 pt-2 border-t border-surface-100 dark:border-surface-800/80 bg-surface-50/50 dark:bg-surface-900/50 animate-fade-in">
                    <form className="space-y-3.5" onSubmit={onSubmit}>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-surface-700 dark:text-surface-300">
                          {role.label} Email
                        </label>
                        <input
                          className="input"
                          type="email"
                          autoComplete="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          placeholder={role.placeholder}
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-medium text-surface-700 dark:text-surface-300">
                          Password
                        </label>
                        <input
                          className="input"
                          type="password"
                          autoComplete="new-password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          minLength={8}
                          placeholder="At least 8 characters"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-medium text-surface-700 dark:text-surface-300">
                          Confirm Password
                        </label>
                        <input
                          className="input"
                          type="password"
                          autoComplete="new-password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          minLength={8}
                          placeholder="Re-enter password"
                        />
                      </div>

                      {error && (
                        <div className="rounded-lg bg-red-50 dark:bg-red-950/40 p-2.5 text-xs text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800">
                          {error}
                        </div>
                      )}

                      <button
                        type="submit"
                        className="btn-primary w-full py-2.5 text-sm font-semibold mt-1"
                        disabled={busy}
                      >
                        {busy ? "Creating account…" : `Register as ${role.label}`}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Link to Login */}
        <div className="mt-6 text-center">
          <p className="text-sm text-surface-500 dark:text-surface-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 no-underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
