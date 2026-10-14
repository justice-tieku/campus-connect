import { useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../auth";
import { Logo } from "./Logo";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 no-underline border border-transparent ${
    isActive
      ? "bg-brand-50 text-brand-700 border-brand-200 dark:bg-brand-950/50 dark:text-brand-400 dark:border-brand-800"
      : "text-surface-600 hover:bg-surface-100 hover:text-surface-900 dark:text-surface-400 dark:hover:bg-surface-800 dark:hover:text-surface-100"
  }`;

export function Layout() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  const navLinks = (
    <>
      <NavLink to="/" className={linkClass} onClick={() => setOpen(false)}>
        <i className="fa-solid fa-home text-sm"></i>
        Home
      </NavLink>
      <NavLink to="/projects" className={linkClass} onClick={() => setOpen(false)}>
        <i className="fa-solid fa-folder-open text-sm"></i>
        Projects
      </NavLink>
      <NavLink to="/opportunities" className={linkClass} onClick={() => setOpen(false)}>
        <i className="fa-solid fa-rocket text-sm"></i>
        Opportunities
      </NavLink>
      {user && (
        <NavLink to="/profile" className={linkClass} onClick={() => setOpen(false)}>
          <i className="fa-solid fa-user text-sm"></i>
          Profile
        </NavLink>
      )}
      {user?.role === "ADMIN" && (
        <NavLink to="/admin" className={linkClass} onClick={() => setOpen(false)}>
          <i className="fa-solid fa-shield-halved text-sm"></i>
          Admin
        </NavLink>
      )}
    </>
  );

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-surface-950">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-surface-200 dark:bg-surface-950/80 dark:border-surface-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link to="/" className="group flex items-center gap-2.5 no-underline">
            <Logo size={32} />
            <span className="font-display text-lg font-bold tracking-tight text-surface-900 dark:text-surface-100">
              Campus<span className="text-brand-600">Connect</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">{navLinks}</nav>

          <div className="hidden items-center gap-3 md:flex">
            {user ? (
              <>
                <div className="flex items-center gap-2 rounded-lg bg-surface-100 py-1.5 pl-1.5 pr-3 dark:bg-surface-800">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-600 text-xs font-bold text-white">
                    {user.email.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[8rem] truncate text-xs font-medium text-surface-700 dark:text-surface-300">
                    {user.email}
                  </span>
                </div>
                <button className="btn-secondary px-4 py-2 text-sm" onClick={() => void logout()}>
                  Log out
                </button>
              </>
            ) : (
              <Link to="/login" className="btn-ghost text-sm no-underline">
                Log in
              </Link>
            )}
          </div>

          <button
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-surface-200 text-surface-600 transition-all duration-200 hover:bg-surface-100 dark:border-surface-700 dark:text-surface-400 dark:hover:bg-surface-800 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Toggle navigation"
          >
            <i className={`fa-solid ${open ? "fa-xmark" : "fa-bars"} text-sm`}></i>
          </button>
        </div>

{open && (
          <nav className="animate-slide-down space-y-1 border-t border-surface-200 bg-white/95 backdrop-blur-sm px-4 py-4 md:hidden dark:bg-surface-950/95 dark:border-surface-800">
              {navLinks}
              <div className="mt-3 border-t border-surface-200 pt-3 dark:border-surface-800">
                {user ? (
                  <button
                    className="btn-secondary w-full text-sm"
                    onClick={() => {
                      setOpen(false);
                      void logout();
                    }}
                  >
                    <i className="fa-solid fa-right-from-bracket text-xs mr-2"></i>
                    Log out
                  </button>
                ) : (
                  <Link to="/login" className="btn-secondary w-full text-sm no-underline" onClick={() => setOpen(false)}>
                    Log in
                  </Link>
                )}
              </div>
            </nav>
          )}
      </header>

      <main className={`mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 ${isHome ? "py-0" : "py-8 lg:py-12"}`}>
        <Outlet />
      </main>

      <footer className="border-t border-surface-200 bg-surface-50 dark:border-surface-800 dark:bg-surface-950 mt-auto">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <Logo size={24} />
              <span className="font-display text-sm font-bold text-surface-900 dark:text-surface-100">
                Campus<span className="text-brand-600">Connect</span>
              </span>
            </div>
            <div className="flex items-center gap-6 text-xs text-surface-500 dark:text-surface-400">
              <Link to="/projects" className="hover:text-surface-900 dark:hover:text-surface-100 no-underline">Projects</Link>
              <Link to="/opportunities" className="hover:text-surface-900 dark:hover:text-surface-100 no-underline">Opportunities</Link>
              <span>© {new Date().getFullYear()}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
