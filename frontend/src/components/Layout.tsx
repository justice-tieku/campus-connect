import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../auth";
import { Logo } from "./Logo";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-medium transition-colors pb-1 border-b-2 ${
    isActive
      ? "text-primary border-primary"
      : "text-on-surface-variant hover:text-on-surface border-transparent"
  }`;

export function Layout() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const navLinks = (
    <>
      <NavLink to="/projects" className={linkClass} onClick={() => setOpen(false)}>
        Projects
      </NavLink>
      <NavLink to="/opportunities" className={linkClass} onClick={() => setOpen(false)}>
        Internships
      </NavLink>
      <NavLink to="/messages" className={linkClass} onClick={() => setOpen(false)}>
        Messages
      </NavLink>
    </>
  );

  return (
    <div className="flex min-h-screen flex-col bg-surface-container-lowest text-on-surface">
      <header className="flex h-16 items-center justify-between px-4 sm:px-6 border-b border-surface-container-highest bg-surface-container-lowest sticky top-0 z-40">
        <Link to="/" className="flex items-center gap-2 no-underline">
          <Logo size={32} />
        </Link>

        <nav className="hidden md:flex items-center gap-6 ml-6">
          {navLinks}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link
                to="/profile"
                className="hidden sm:flex items-center gap-1.5 p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low rounded transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">account_circle</span>
              </Link>
              <button
                className="btn-secondary text-sm"
                onClick={() => void logout()}
              >
                Log out
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn-ghost text-sm">
                Log in
              </Link>
              <Link to="/register" className="btn-primary text-sm">
                Get Started
              </Link>
            </div>
          )}
          <button
            className="md:hidden flex items-center justify-center p-2 text-on-surface-variant hover:text-on-surface"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined text-[24px]">
              {open ? "close" : "menu"}
            </span>
          </button>
        </div>
      </header>

      {open && (
        <nav className="md:hidden border-b border-surface-container-highest bg-surface-container-lowest px-4 py-3 space-y-2">
          {navLinks}
          <div className="pt-2 border-t border-surface-container-highest">
            {user ? (
              <button
                className="btn-secondary w-full text-sm"
                onClick={() => {
                  setOpen(false);
                  void logout();
                }}
              >
                Log out
              </button>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" className="btn-secondary flex-1 text-sm" onClick={() => setOpen(false)}>
                  Log in
                </Link>
                <Link to="/register" className="btn-primary flex-1 text-sm" onClick={() => setOpen(false)}>
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </nav>
      )}

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-surface-container-highest bg-surface-container-lowest py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Logo size={24} />
            <span className="text-sm text-on-surface-variant">
              The collaborative software registry for university computer science.
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-on-surface-variant">
            <Link to="/projects" className="hover:text-on-surface transition-colors no-underline">Projects</Link>
            <Link to="/opportunities" className="hover:text-on-surface transition-colors no-underline">Internships</Link>
            <span>&copy; {new Date().getFullYear()} Campus Connect</span>
          </div>
        </div>
      </footer>
    </div>
  );
}