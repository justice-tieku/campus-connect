import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../auth";
import { Logo } from "../components/Logo";

export function Register() {
  const { refresh } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState<"STUDENT" | "FACULTY" | "ALUMNI" | "STAFF">("STUDENT");
  const [institution, setInstitution] = useState("");
  const [programme, setProgramme] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await api.register({
        email,
        password,
        role,
        firstName,
        lastName,
        institution,
        programme,
      });
      await refresh();
      navigate("/profile");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center animate-fade-in">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600">
            <Logo size={32} />
          </div>
          <h1 className="mt-5 page-heading">Create your account</h1>
          <p className="mt-2 text-surface-500">
            Join CampusConnect to collaborate on projects and discover opportunities.
          </p>
        </div>

        {/* Card */}
        <div className="panel p-8">
          <form className="space-y-5" onSubmit={onSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-surface-700">
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
                <label className="mb-1.5 block text-sm font-medium text-surface-700">
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

            <div>
              <label className="mb-1.5 block text-sm font-medium text-surface-700">
                Account type
              </label>
              <select
                className="input"
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
              >
                <option value="STUDENT">Student</option>
                <option value="FACULTY">Faculty</option>
                <option value="ALUMNI">Alumni</option>
                <option value="STAFF">Staff</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-surface-700">
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

            <div>
              <label className="mb-1.5 block text-sm font-medium text-surface-700">
                Institution
              </label>
              <input
                className="input"
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="University name"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-surface-700">
                Programme/Department
              </label>
              <input
                className="input"
                type="text"
                value={programme}
                onChange={(e) => setProgramme(e.target.value)}
                placeholder="Computer Science, Engineering, etc."
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-surface-700">
                Password
                <span className="ml-1 font-normal text-surface-400">(min 8 characters)</span>
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <i className="fa-solid fa-lock text-xs text-surface-400"></i>
                </div>
                <input
                  className="input pl-10"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-700 ring-1 ring-red-200 animate-slide-down">
                <i className="fa-solid fa-circle-exclamation mt-0.5 text-red-500"></i>
                {error}
              </div>
            )}

            <button className="btn-primary w-full py-3" disabled={busy}>
              {busy ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin text-xs"></i>
                  Creating account…
                </>
              ) : (
                <>
                  Create account
                  <i className="fa-solid fa-arrow-right text-xs"></i>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-surface-500">
              Already registered?{" "}
              <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
