import { useState, useEffect } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../auth";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-xl transition-all duration-200 no-underline ${
    isActive
      ? "bg-brand-600 text-white"
      : "text-surface-600 hover:bg-surface-100 hover:text-surface-900 dark:text-surface-400 dark:hover:bg-surface-800 dark:hover:text-surface-100"
  }`;

export function Layout() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (saved === "true" || (!saved && prefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("darkMode", (!darkMode).toString());
  };

  const navLinks = (
    <>
      <NavLink to="/projects" className={linkClass} onClick={() => setOpen(false)}>
        <i className="fa-solid fa-folder-open text-xs"></i>
        Projects
      </NavLink>
      <NavLink to="/opportunities" className={linkClass} onClick={() => setOpen(false)}>
        <i className="fa-solid fa-rocket text-xs"></i>
        Opportunities
      </NavLink>
      {user && (
        <NavLink to="/profile" className={linkClass} onClick={() => setOpen(false)}>
          <i className="fa-solid fa-user text-xs"></i>
          Profile
        </NavLink>
      )}
      {user?.role === "ADMIN" && (
        <NavLink to="/admin" className={linkClass} onClick={() => setOpen(false)}>
          <i className="fa-solid fa-shield-halved text-xs"></i>
          Admin
        </NavLink>
      )}
    </>
  );

  return (
    <div className="flex min-h-screen flex-col bg-surface-50 dark:bg-surface-950">
      {/* Navigation */}
      <header className="sticky top-0 z-50 glass-nav">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          {/* Logo */}
          <Link to="/" className="group flex items-center gap-2.5 no-underline">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 transition-transform duration-200 group-hover:-rotate-6">
              <i className="fa-solid fa-graduation-cap text-sm text-white"></i>
            </div>
            <span className="font-display text-lg font-bold tracking-tight text-surface-900 dark:text-surface-100">
              Campus<span className="text-brand-600">Connect</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">{navLinks}</nav>

          {/* Desktop auth */}
          <div className="hidden items-center gap-2 md:flex">
            <button
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-surface-300 text-surface-700 transition-all duration-200 hover:bg-surface-100 hover:border-brand-500 dark:border-surface-700 dark:text-surface-300 dark:hover:bg-surface-800 dark:hover:border-brand-500"
              onClick={toggleDarkMode}
              aria-label="Toggle dark mode"
            >
              <i className={`fa-solid ${darkMode ? "fa-sun" : "fa-moon"} text-sm`}></i>
            </button>
            {user ? (
              <>
                <div className="flex items-center gap-2 rounded-xl bg-surface-100 py-1.5 pl-1.5 pr-3 dark:bg-surface-800">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600 text-xs font-bold text-white">
                    {user.email.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[10rem] truncate text-xs font-semibold text-surface-700 dark:text-surface-300">
                    {user.email}
                  </span>
                </div>
                <button className="btn-secondary px-4 py-2" onClick={() => void logout()}>
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost no-underline">
                  Log in
                </Link>
                <Link to="/register" className="btn-primary no-underline">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-surface-300 text-surface-700 transition-all duration-200 hover:bg-surface-100 hover:border-brand-500 dark:border-surface-700 dark:text-surface-300 dark:hover:bg-surface-800 dark:hover:border-brand-500 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Toggle navigation"
          >
            <i className={`fa-solid ${open ? "fa-xmark" : "fa-bars"} text-sm`}></i>
          </button>
        </div>

        {/* Mobile nav dropdown */}
        {open && (
          <nav className="animate-slide-down space-y-1 border-t border-surface-200 bg-white/95 backdrop-blur-sm px-4 py-4 md:hidden dark:bg-surface-950/95 dark:border-surface-800">
            {navLinks}
            <div className="mt-2 border-t border-surface-200 pt-3 dark:border-surface-800">
              <button
                className="btn-secondary w-full mb-2"
                onClick={() => {
                  toggleDarkMode();
                }}
              >
                <i className={`fa-solid ${darkMode ? "fa-sun" : "fa-moon"} text-xs`}></i>
                {darkMode ? "Light mode" : "Dark mode"}
              </button>
              {user ? (
                <button
                  className="btn-secondary w-full"
                  onClick={() => {
                    setOpen(false);
                    void logout();
                  }}
                >
                  <i className="fa-solid fa-right-from-bracket text-xs"></i>
                  Log out
                </button>
              ) : (
                <div className="flex gap-2">
                  <Link to="/login" className="btn-secondary flex-1 no-underline" onClick={() => setOpen(false)}>
                    Log in
                  </Link>
                  <Link to="/register" className="btn-primary flex-1 no-underline" onClick={() => setOpen(false)}>
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </nav>
        )}
      </header>


      {/* Main content */}
      <main className={`mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 ${isHome ? "py-0" : "py-8 lg:py-12"}`}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-surface-200 bg-white dark:border-surface-800 dark:bg-surface-950">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600">
                <i className="fa-solid fa-graduation-cap text-[10px] text-white"></i>
              </div>
              <span className="font-display text-sm font-bold text-surface-900 dark:text-surface-100">
                Campus<span className="text-brand-600">Connect</span>
              </span>
            </div>
            <p className="text-xs text-surface-500 dark:text-surface-400">
              © {new Date().getFullYear()} CampusConnect. Built for students, by students.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
