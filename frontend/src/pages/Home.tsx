import { Link } from "react-router-dom";
import { useAuth } from "../auth";
import { Logo } from "../components/Logo";

const stats = [
  { label: "Active projects", value: "100+", icon: "fa-solid fa-folder-open" },
  { label: "Student profiles", value: "500+", icon: "fa-solid fa-users" },
  { label: "Opportunities listed", value: "50+", icon: "fa-solid fa-rocket" },
];

const features = [
  {
    icon: "fa-solid fa-circle-nodes",
    title: "Build your profile",
    desc: "Showcase your skills, GitHub, portfolio, and programme details in one place.",
    color: "bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400",
  },
  {
    icon: "fa-solid fa-rocket",
    title: "Publish projects",
    desc: "Set team capacity, list required skills and recruit the right teammates.",
    color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  },
  {
    icon: "fa-solid fa-magnifying-glass",
    title: "Search & discover",
    desc: "Filter projects by keyword, skill or status — then request to join.",
    color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  {
    icon: "fa-solid fa-handshake",
    title: "Collaborate",
    desc: "Project owners accept teammates; admins moderate to keep the board clean.",
    color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  },
];

const accountTypes = [
  { label: "Students", icon: "fa-solid fa-graduation-cap", color: "bg-brand-600" },
  { label: "Faculty", icon: "fa-solid fa-chalkboard-user", color: "bg-purple-600" },
  { label: "Alumni", icon: "fa-solid fa-user-tie", color: "bg-emerald-600" },
  { label: "Staff", icon: "fa-solid fa-id-badge", color: "bg-amber-500" },
];

export function Home() {
  const { user } = useAuth();

  return (
    <div className="animate-fade-in">

      {/* ─── Hero Section ─── */}
      <section className="relative overflow-hidden">
        {/* Background gradient blobs */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-purple-50 dark:from-surface-900 dark:via-surface-950 dark:to-surface-900" />
          <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-brand-200/40 blur-3xl dark:bg-brand-800/20" />
          <div className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-purple-200/40 blur-3xl dark:bg-purple-900/20" />
          <div className="absolute top-1/2 right-10 h-60 w-60 rounded-full bg-accent-200/30 blur-3xl dark:bg-accent-800/10" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">

            {/* Left — headline + CTA */}
            <div>
              {/* Live status pill */}
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                </span>
                Open to all campus members
              </div>

              <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-surface-900 dark:text-surface-100 sm:text-5xl lg:text-6xl">
                Find your people.{" "}
                <span className="relative whitespace-nowrap">
                  <span className="relative text-brand-600">Build together.</span>
                </span>
              </h1>

              <p className="mt-5 max-w-lg text-lg leading-relaxed text-surface-500 dark:text-surface-400">
                CampusConnect brings students, faculty, alumni and staff onto one platform — publish projects, find collaborators by skill, and browse real opportunities posted by your institution.
              </p>

              {/* Who is it for badges */}
              <div className="mt-5 flex flex-wrap gap-2">
                {accountTypes.map((a) => (
                  <span key={a.label} className="inline-flex items-center gap-1.5 rounded-full bg-surface-100 px-3 py-1 text-xs font-semibold text-surface-700 dark:bg-surface-800 dark:text-surface-300">
                    <i className={`${a.icon} text-xs`}></i>
                    {a.label}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to={user ? "/projects" : "/register"}
                  className="btn-primary text-base px-7 py-3 rounded-2xl no-underline shadow-md hover:shadow-lg"
                >
                  {user ? "Browse projects" : "Get started — it's free"}
                  <i className="fa-solid fa-arrow-right text-sm"></i>
                </Link>
                <Link
                  to="/opportunities"
                  className="btn-secondary text-base px-7 py-3 rounded-2xl no-underline"
                >
                  <i className="fa-solid fa-rocket text-sm text-brand-600"></i>
                  Opportunity board
                </Link>
              </div>

              {/* Stats */}
              <div className="mt-12 flex gap-8 border-t border-surface-200 dark:border-surface-800 pt-8">
                {stats.map((s) => (
                  <div key={s.label} className="text-center">
                    <p className="font-display text-2xl font-extrabold text-surface-900 dark:text-surface-100">
                      {s.value}
                    </p>
                    <p className="mt-0.5 text-xs text-surface-400 dark:text-surface-500">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — visual illustration card */}
            <div className="relative">
              {/* Main card */}
              <div className="relative rounded-3xl border border-surface-200 bg-white p-6 shadow-xl dark:border-surface-800 dark:bg-surface-900">

                {/* Header row */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <Logo size={36} />
                    <div>
                      <p className="font-display text-sm font-bold text-surface-900 dark:text-surface-100">CampusConnect</p>
                      <p className="text-xs text-surface-400">Connect · Collaborate · Create</p>
                    </div>
                  </div>
                  <span className="badge badge-success">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5 inline-block"></span>
                    Live
                  </span>
                </div>

                {/* Member types */}
                <div className="mb-5">
                  <p className="text-xs font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-wider mb-3">
                    Community members
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {accountTypes.map((a) => (
                      <div key={a.label} className="flex flex-col items-center gap-1.5 rounded-xl bg-surface-50 py-3 px-2 dark:bg-surface-800">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${a.color}`}>
                          <i className={`${a.icon} text-xs text-white`}></i>
                        </div>
                        <span className="text-xs font-medium text-surface-600 dark:text-surface-400">{a.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sample project cards */}
                <p className="text-xs font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-wider mb-3">
                  Active projects
                </p>
                <div className="space-y-2.5">
                  {[
                    { icon: "fa-solid fa-code", color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400", title: "Campus Marketplace App", tags: "React · Node.js", badge: "badge-success", status: "Open" },
                    { icon: "fa-solid fa-mobile-screen", color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400", title: "Student Health Tracker", tags: "Flutter · Firebase", badge: "badge-brand", status: "In Progress" },
                    { icon: "fa-solid fa-robot", color: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400", title: "AI Lecture Summariser", tags: "Python · LangChain", badge: "badge-accent", status: "New" },
                  ].map((p) => (
                    <div key={p.title} className="flex items-center gap-3 rounded-xl bg-surface-50 p-3 dark:bg-surface-800">
                      <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${p.color}`}>
                        <i className={`${p.icon} text-sm`}></i>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-surface-900 dark:text-surface-100 truncate">{p.title}</p>
                        <p className="text-xs text-surface-400">{p.tags}</p>
                      </div>
                      <span className={`badge ${p.badge} flex-shrink-0`}>{p.status}</span>
                    </div>
                  ))}
                </div>

                {/* Avatar row */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {["JD", "SK", "MR", "AB"].map((init, i) => {
                      const colors = ["bg-brand-600", "bg-emerald-600", "bg-purple-600", "bg-orange-500"];
                      return (
                        <div key={init} className={`flex h-7 w-7 items-center justify-center rounded-full ${colors[i]} text-xs font-bold text-white ring-2 ring-white dark:ring-surface-900`}>
                          {init}
                        </div>
                      );
                    })}
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-200 text-xs font-bold text-surface-600 ring-2 ring-white dark:bg-surface-700 dark:text-surface-300 dark:ring-surface-900">
                      +50
                    </div>
                  </div>
                  <p className="text-xs text-surface-400 dark:text-surface-500">500+ members joined</p>
                </div>
              </div>

              {/* Floating badge — top right */}
              <div className="absolute -top-4 -right-4 animate-bounce" style={{ animationDuration: "3s" }}>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-400 shadow-lg ring-4 ring-white dark:ring-surface-950">
                  <i className="fa-solid fa-lightbulb text-xl text-surface-900"></i>
                </div>
              </div>

              {/* Floating badge — bottom left */}
              <div className="absolute -bottom-4 -left-4 animate-bounce" style={{ animationDuration: "4s", animationDelay: "1s" }}>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 shadow-lg ring-4 ring-white dark:ring-surface-950">
                  <i className="fa-solid fa-users text-lg text-white"></i>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── Features Section ─── */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="inline-block rounded-full bg-brand-100 px-4 py-1.5 text-xs font-bold text-brand-700 dark:bg-brand-900/30 dark:text-brand-400 mb-4">
              Everything you need
            </span>
            <h2 className="font-display text-3xl font-bold text-surface-900 dark:text-surface-100">
              How CampusConnect works
            </h2>
            <p className="mt-3 text-surface-500 dark:text-surface-400 max-w-lg mx-auto">
              A complete platform for campus collaboration — from idea to team to delivery.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <div key={f.title} className="group relative rounded-2xl border border-surface-200 bg-white p-6 transition-all duration-300 hover:border-brand-300 hover:shadow-lg dark:border-surface-800 dark:bg-surface-900 dark:hover:border-brand-700">
                <div className="mb-2 text-xs font-bold text-surface-300 dark:text-surface-600">0{i + 1}</div>
                <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl ${f.color}`}>
                  <i className={`${f.icon} text-lg`}></i>
                </div>
                <h3 className="font-display text-base font-bold text-surface-900 dark:text-surface-100 mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Who can join section ─── */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="rounded-3xl bg-gradient-to-br from-surface-100 to-brand-50 dark:from-surface-900 dark:to-surface-800 p-8 lg:p-12">
            <div className="grid gap-8 lg:grid-cols-2 items-center">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">Open to everyone</span>
                <h2 className="mt-3 font-display text-2xl font-bold text-surface-900 dark:text-surface-100">
                  One platform for the whole campus community
                </h2>
                <p className="mt-3 text-surface-500 dark:text-surface-400">
                  Whether you're a first-year student, a lecturer, a recent graduate, or support staff — there's a place for you here.
                </p>
                <div className="mt-5 flex flex-col gap-3">
                  {[
                    { type: "Students", desc: "Find teammates, publish projects, browse internships." },
                    { type: "Faculty", desc: "Post research opportunities and connect with students." },
                    { type: "Alumni", desc: "Mentor students, share job leads, stay connected." },
                    { type: "Staff", desc: "Post campus events, scholarships, and announcements." },
                  ].map((item) => (
                    <div key={item.type} className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-brand-600">
                        <i className="fa-solid fa-check text-[10px] text-white"></i>
                      </div>
                      <p className="text-sm text-surface-700 dark:text-surface-300">
                        <span className="font-semibold">{item.type}:</span> {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {accountTypes.map((a) => (
                  <div key={a.label} className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-white py-8 px-4 shadow-sm dark:bg-surface-800">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${a.color}`}>
                      <i className={`${a.icon} text-2xl text-white`}></i>
                    </div>
                    <span className="text-sm font-bold text-surface-900 dark:text-surface-100">{a.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA Section ─── */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl bg-surface-900 px-8 py-14 text-center sm:px-16 dark:bg-surface-950">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-brand-500 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-purple-500 blur-3xl"></div>
            </div>
            <div className="relative">
              <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-white/80 mb-4">
                Free forever for campus members
              </span>
              <h2 className="font-display text-2xl font-bold text-white sm:text-4xl">
                Ready to build something great?
              </h2>
              <p className="mx-auto mt-4 max-w-md text-surface-300 leading-relaxed">
                Join CampusConnect today. Create your profile, publish your idea, and find the team you need — in minutes.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link
                  to={user ? "/projects" : "/register"}
                  className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-3.5 text-sm font-bold text-surface-900 no-underline transition-all duration-200 hover:bg-surface-100 hover:shadow-lg active:scale-[0.98]"
                >
                  {user ? "Go to projects" : "Create your account"}
                  <i className="fa-solid fa-arrow-right text-xs"></i>
                </Link>
                {!user && (
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-8 py-3.5 text-sm font-semibold text-white no-underline transition-all duration-200 hover:bg-white/20"
                  >
                    Log in
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
