import { Link } from "react-router-dom";
import { useAuth } from "../auth";
import { Logo } from "../components/Logo";



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
      <section className="relative overflow-hidden py-16 lg:py-24">
        {/* Background pattern */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-accent-50 dark:from-surface-900 dark:via-surface-950 dark:to-surface-900"></div>
          <div className="absolute inset-0 opacity-30 dark:opacity-10">
            <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-brand-200 blur-3xl dark:bg-brand-800"></div>
            <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-accent-200 blur-3xl dark:bg-accent-800"></div>
          </div>
        </div>

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

            {/* Right — hero illustration */}
            <div className="relative animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <div className="relative mx-auto w-full max-w-lg">
                {/* Main illustration card */}
                <div className="card p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100">
                      <Logo size={32} />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-surface-900 dark:text-surface-100">CampusConnect</h3>
                      <p className="text-xs text-surface-500">Connect • Collaborate • Create</p>
                    </div>
                  </div>

                  {/* Mock project cards */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 rounded-xl bg-surface-50 p-3 dark:bg-surface-800">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                        <i className="fa-solid fa-code text-sm"></i>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-surface-900 dark:text-surface-100">Web App Project</p>
                        <p className="text-xs text-surface-500">React • TypeScript • Node.js</p>
                      </div>
                      <span className="badge badge-success">Open</span>
                    </div>

                    <div className="flex items-center gap-3 rounded-xl bg-surface-50 p-3 dark:bg-surface-800">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                        <i className="fa-solid fa-mobile-screen text-sm"></i>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-surface-900 dark:text-surface-100">Mobile App</p>
                        <p className="text-xs text-surface-500">Flutter • Firebase</p>
                      </div>
                      <span className="badge badge-brand">In Progress</span>
                    </div>

                    <div className="flex items-center gap-3 rounded-xl bg-surface-50 p-3 dark:bg-surface-800">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                        <i className="fa-solid fa-robot text-sm"></i>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-surface-900 dark:text-surface-100">AI Research</p>
                        <p className="text-xs text-surface-500">Python • TensorFlow</p>
                      </div>
                      <span className="badge badge-warning">New</span>
                    </div>
                  </div>

                  {/* User avatars */}
                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex -space-x-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white ring-2 ring-white dark:ring-surface-900">JD</div>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white ring-2 ring-white dark:ring-surface-900">SK</div>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 text-xs font-bold text-white ring-2 ring-white dark:ring-surface-900">MR</div>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-200 text-xs font-bold text-surface-600 ring-2 ring-white dark:bg-surface-700 dark:text-surface-300 dark:ring-surface-900">+50</div>
                    </div>
                    <p className="text-xs text-surface-500">50+ students joined</p>
                  </div>
                </div>

                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 animate-bounce" style={{ animationDuration: "3s" }}>
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-400 shadow-lg">
                    <i className="fa-solid fa-lightbulb text-xl text-surface-900"></i>
                  </div>
                </div>
                <div className="absolute -bottom-4 -left-4 animate-bounce" style={{ animationDuration: "4s", animationDelay: "1s" }}>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 shadow-lg">
                    <i className="fa-solid fa-users text-lg text-white"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl bg-surface-900 px-8 py-14 text-center sm:px-16 dark:bg-surface-950">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-brand-500 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-accent-500 blur-3xl"></div>
            </div>

            <div className="relative">
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
                  className="inline-flex items-center gap-2 rounded-2xl bg-white px-7 py-3 text-sm font-bold text-surface-900 no-underline transition-all duration-200 hover:bg-surface-100 hover:shadow-lg active:scale-[0.98] dark:bg-surface-100 dark:hover:bg-surface-200"
                >
                  {user ? "Go to projects" : "Create your account"}
                  <i className="fa-solid fa-arrow-right text-xs"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
