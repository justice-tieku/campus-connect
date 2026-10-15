import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../auth";
import { Logo } from "./Logo";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-medium transition-colors pb-1 border-b-2 no-underline ${
    isActive
      ? "text-emerald-700 border-emerald-600 font-semibold"
      : "text-slate-600 hover:text-slate-900 border-transparent"
  }`;

export function Layout() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = (
    <>
      <NavLink to="/projects" className={linkClass} onClick={() => setOpen(false)}>
        Projects
      </NavLink>
      <NavLink to="/opportunities" className={linkClass} onClick={() => setOpen(false)}>
        Internships
      </NavLink>
      {user?.role === "ADMIN" && (
        <NavLink to="/admin" className={linkClass} onClick={() => setOpen(false)}>
          Admin
        </NavLink>
      )}
    </>
  );

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900">
      <header className="flex h-16 items-center justify-between px-4 sm:px-8 border-b border-slate-200 bg-white sticky top-0 z-40">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2.5 no-underline">
            <Logo size={28} />
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks}
          </nav>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {/* Role badge */}
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-800 text-xs font-medium rounded border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                {user.role ? user.role.charAt(0) + user.role.slice(1).toLowerCase() : "Student"}
              </span>

              {/* New Project CTA */}
              <Link
                to="/projects/new"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded transition-colors no-underline shadow-sm"
              >
                <span className="material-symbols-outlined text-[15px]">add</span>
                New Project
              </Link>

              {/* Profile Icon Link */}
              <Link
                to="/profile"
                className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors no-underline"
                title="Your Profile"
              >
                <span className="material-symbols-outlined text-[18px]">account_circle</span>
              </Link>

              {/* Logout button */}
              <button
                type="button"
                onClick={async () => {
                  await logout();
                  navigate("/login");
                }}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded border border-slate-200 transition-colors"
              >
                Log out
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link
                to="/login"
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors no-underline"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded transition-colors no-underline shadow-sm"
              >
                Create Account
              </Link>
            </div>
          )}

          {/* Mobile hamburger button */}
          <button
            className="md:hidden flex items-center justify-center p-1.5 text-slate-600 hover:text-slate-900"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined text-[22px]">
              {open ? "close" : "menu"}
            </span>
          </button>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {open && (
        <nav className="md:hidden border-b border-slate-200 bg-white px-4 py-3 space-y-3 shadow-sm">
          <div className="flex flex-col gap-2">
            {navLinks}
          </div>
          <div className="pt-2 border-t border-slate-200">
            {user ? (
              <div className="space-y-2">
                <Link
                  to="/projects/new"
                  className="flex items-center justify-center gap-1.5 w-full py-2 bg-emerald-600 text-white text-xs font-semibold rounded no-underline"
                  onClick={() => setOpen(false)}
                >
                  <span className="material-symbols-outlined text-[15px]">add</span>
                  New Project
                </Link>
                <div className="flex gap-2">
                  <Link
                    to="/profile"
                    className="flex-1 py-1.5 text-center text-xs font-medium bg-slate-100 text-slate-800 rounded no-underline"
                    onClick={() => setOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    className="flex-1 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded border border-slate-200"
                    onClick={async () => {
                      setOpen(false);
                      await logout();
                      navigate("/login");
                    }}
                  >
                    Log out
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  className="flex-1 py-2 text-center text-xs font-semibold border border-slate-300 rounded text-slate-800 no-underline"
                  onClick={() => setOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="flex-1 py-2 text-center text-xs font-semibold bg-emerald-600 text-white rounded no-underline"
                  onClick={() => setOpen(false)}
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </nav>
      )}

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Logo size={20} />
            <span>The collaborative software registry for university computer science.</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/projects" className="hover:text-slate-900 transition-colors no-underline">Projects</Link>
            <Link to="/opportunities" className="hover:text-slate-900 transition-colors no-underline">Internships</Link>
            <span>&copy; {new Date().getFullYear()} Campus Connect</span>
          </div>
        </div>
      </footer>
    </div>
  );
}