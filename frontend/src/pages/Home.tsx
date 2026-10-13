import { Link } from "react-router-dom";
import { useAuth } from "../auth";

const features = [
  {
    icon: "fa-solid fa-users",
    title: "Build your profile",
    desc: "Showcase skills, GitHub, portfolio, and programme details.",
  },
  {
    icon: "fa-solid fa-rocket",
    title: "Publish projects",
    desc: "Set capacity, required skills, and recruit teammates.",
  },
  {
    icon: "fa-solid fa-magnifying-glass",
    title: "Search & discover",
    desc: "Filter by keyword, skill, or status — then request to join.",
  },
  {
    icon: "fa-solid fa-handshake",
    title: "Collaborate",
    desc: "Owners accept teammates; admins keep the board clean.",
  },
];

const stats = [
  { label: "Active projects", value: "100+" },
  { label: "Student profiles", value: "500+" },
  { label: "Opportunities listed", value: "50+" },
];

export function Home() {
  const { user } = useAuth();

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            {/* Left — copy */}
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 rounded-full border border-surface-300 bg-white/80 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold text-surface-700 shadow-sm dark:bg-surface-900/80 dark:border-surface-700 dark:text-surface-300">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                For campus builders
              </div>
              <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-surface-900 sm:text-5xl lg:text-6xl dark:text-surface-100">
                Find teammates.{" "}
                <span className="text-brand-600">Ship the project.</span>
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-surface-500 dark:text-surface-400">
                CampusConnect helps students publish project ideas, recruit
                collaborators by skill, and browse internships and events — with
                admin moderation so the board stays useful.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to={user ? "/projects" : "/register"}
                  className="btn-primary text-base px-7 py-3 rounded-2xl no-underline"
                >
                  <i className="fa-solid fa-arrow-right text-sm"></i>
                  {user ? "Browse projects" : "Get started free"}
                </Link>
                <Link
                  to="/opportunities"
                  className="btn-secondary text-base px-7 py-3 rounded-2xl no-underline"
                >
                  <i className="fa-solid fa-rocket text-sm text-brand-600"></i>
                  Opportunity board
                </Link>
              </div>

              {/* Stats row */}
              <div className="mt-12 flex gap-8">
                {stats.map((s) => (
                  <div key={s.label}>
                    <p className="font-display text-2xl font-bold text-surface-900 dark:text-surface-100">{s.value}</p>
                    <p className="text-xs text-surface-400 dark:text-surface-500">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — feature cards */}
            <div className="grid gap-4 sm:grid-cols-2" style={{ animationDelay: "0.2s" }}>
              {features.map((f, i) => (
                <div
                  key={f.title}
                  className="card p-5 animate-slide-up"
                  style={{ animationDelay: `${0.1 * (i + 1)}s` }}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
                    <i className={`${f.icon}`}></i>
                  </div>
                  <h3 className="mt-3 font-display text-sm font-bold text-surface-900 dark:text-surface-100">
                    {f.title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-surface-500 dark:text-surface-400">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="rounded-3xl bg-surface-900 px-8 py-14 text-center sm:px-16 dark:bg-surface-950">
            <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
              Ready to build something great?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-surface-300">
              Join CampusConnect today and start collaborating with talented
              students on your campus.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to={user ? "/projects" : "/register"}
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-7 py-3 text-sm font-bold text-surface-900 no-underline transition-all duration-200 hover:bg-surface-100 active:scale-[0.98] dark:bg-surface-100 dark:hover:bg-surface-200"
              >
                {user ? "Go to projects" : "Create your account"}
                <i className="fa-solid fa-arrow-right text-xs"></i>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
