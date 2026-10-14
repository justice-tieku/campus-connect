import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth";
import { Logo } from "../components/Logo";

const categories = [
  { label: "Students", count: "850+", icon: "fa-solid fa-graduation-cap", color: "bg-blue-600", desc: "Build teams, find mentors & projects" },
  { label: "Faculty", count: "120+", icon: "fa-solid fa-chalkboard-user", color: "bg-purple-600", desc: "Supervise research & post open labs" },
  { label: "Alumni", count: "340+", icon: "fa-solid fa-user-tie", color: "bg-emerald-600", desc: "Offer internships & guide projects" },
  { label: "Staff", count: "60+", icon: "fa-solid fa-building-user", color: "bg-amber-600", desc: "Campus updates & resource boards" },
];

const highlights = [
  {
    icon: "fa-solid fa-layer-group",
    title: "Curated Project Matching",
    desc: "Match with teammates based on verified skills, departments, and mutual goals.",
  },
  {
    icon: "fa-solid fa-briefcase",
    title: "Direct Campus Opportunities",
    desc: "Discover internships, research grants, and campus hackathons directly from your university.",
  },
  {
    icon: "fa-solid fa-shield-halved",
    title: "Verified Community",
    desc: "Authentic university network monitored by staff and faculty for safe collaboration.",
  },
];

export function Home() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"student" | "faculty">("student");

  return (
    <div className="animate-fade-in -mt-4 pb-20">

      {/* ─── Hero: Human Photography on one side, Portal/Actions on the other ─── */}
      <section className="relative overflow-hidden pt-6 pb-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">

            {/* Left Column (7 cols): Heading, Value Proposition & Real Student Imagery */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-8">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-brand-200/60 bg-brand-50/80 px-4 py-1.5 text-xs font-semibold text-brand-700 dark:border-brand-800 dark:bg-brand-900/30 dark:text-brand-300">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Verified University Network
                </div>
                <h1 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-surface-900 dark:text-surface-100 leading-[1.12]">
                  Where ambitious <br className="hidden sm:inline" />
                  <span className="text-brand-600">
                    campus minds connect
                  </span>{" "}
                  &amp; build.
                </h1>
                <p className="mt-4 text-base sm:text-lg text-surface-600 dark:text-surface-300 max-w-xl leading-relaxed">
                  Join students, professors, and alumni collaborating on innovative projects, sharing department resources, and discovering vetted career opportunities.
                </p>
              </div>

              {/* Realistic High-Quality Student Collaboration Photography */}
              <div className="relative rounded-2xl overflow-hidden shadow-lg border border-surface-200 dark:border-surface-800 bg-surface-100 dark:bg-surface-900 group">
                <img
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80"
                  alt="University students collaborating together"
                  className="w-full h-72 sm:h-84 object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />

                {/* Social Badge on Photo */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <div className="flex items-center gap-3 bg-white/90 dark:bg-surface-900/90 backdrop-blur-sm rounded-lg px-3 py-2">
                    <div className="flex -space-x-2">
                      <img className="h-8 w-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" alt="Student avatar" />
                      <img className="h-8 w-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80" alt="Student avatar" />
                      <img className="h-8 w-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80" alt="Student avatar" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-surface-900 dark:text-surface-100">1,200+ Members</p>
                      <p className="text-[10px] text-surface-500 dark:text-surface-400">18+ Departments</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick statistics row */}
              <div className="grid grid-cols-3 gap-4 border-t border-surface-200 dark:border-surface-800 pt-6">
                <div>
                  <p className="font-display text-2xl sm:text-3xl font-extrabold text-surface-900 dark:text-surface-100">140+</p>
                  <p className="text-xs sm:text-sm text-surface-500">Live projects</p>
                </div>
                <div>
                  <p className="font-display text-2xl sm:text-3xl font-extrabold text-surface-900 dark:text-surface-100">95%</p>
                  <p className="text-xs sm:text-sm text-surface-500">Placement rate</p>
                </div>
                <div>
                  <p className="font-display text-2xl sm:text-3xl font-extrabold text-surface-900 dark:text-surface-100">50+</p>
                  <p className="text-xs sm:text-sm text-surface-500">Partner companies</p>
                </div>
              </div>
            </div>

            {/* Right Column (5 cols): Interactive Auth & Direct Portal Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 p-6 sm:p-8 shadow-xl">
                
                {/* Header branding on card */}
                <div className="flex items-center gap-3 pb-6 border-b border-surface-100 dark:border-surface-800">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600">
                    <Logo size={32} />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-surface-900 dark:text-surface-100">
                      Campus Portal
                    </h3>
                    <p className="text-xs text-surface-500">
                      {user ? `Logged in as ${user.email}` : "Select how you would like to enter"}
                    </p>
                  </div>
                </div>

                {user ? (
                  /* User is authenticated view */
                  <div className="mt-6 space-y-4">
                    <div className="rounded-2xl bg-surface-50 dark:bg-surface-800/60 p-4 border border-surface-200/60 dark:border-surface-700">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white font-bold">
                          {user.email.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 truncate">
                          <p className="text-sm font-bold text-surface-900 dark:text-surface-100 truncate">{user.email}</p>
                          <span className="badge badge-brand text-[10px] mt-0.5">{user.role}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <Link to="/projects" className="btn-primary py-3 rounded-xl no-underline text-center">
                        <i className="fa-solid fa-folder-open text-xs mr-2"></i>
                        Projects
                      </Link>
                      <Link to="/profile" className="btn-secondary py-3 rounded-xl no-underline text-center">
                        <i className="fa-solid fa-user text-xs mr-2"></i>
                        Profile
                      </Link>
                    </div>

                    <Link to="/opportunities" className="block w-full py-2.5 text-center text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline">
                      Explore Open Opportunities &rarr;
                    </Link>
                  </div>
                ) : (
                  /* Guest view: Action-oriented Register & Login portal */
                  <div className="mt-6 space-y-5">
                    {/* Role tabs */}
                    <div className="flex rounded-xl bg-surface-100 dark:bg-surface-800 p-1">
                      <button
                        type="button"
                        onClick={() => setActiveTab("student")}
                        className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                          activeTab === "student"
                            ? "bg-white dark:bg-surface-900 text-brand-600 shadow-sm"
                            : "text-surface-600 dark:text-surface-400"
                        }`}
                      >
                        <i className="fa-solid fa-user-graduate mr-1.5"></i> Student / Alumni
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab("faculty")}
                        className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                          activeTab === "faculty"
                            ? "bg-white dark:bg-surface-900 text-brand-600 shadow-sm"
                            : "text-surface-600 dark:text-surface-400"
                        }`}
                      >
                        <i className="fa-solid fa-chalkboard-user mr-1.5"></i> Faculty / Staff
                      </button>
                    </div>

                    <p className="text-xs text-surface-500 leading-relaxed">
                      {activeTab === "student"
                        ? "Register with your student email to join project squads, showcase portfolios, and browse internships."
                        : "Connect with students for academic research, post department news, and supervise student initiatives."}
                    </p>

                    {/* Primary Portal CTAs */}
                    <div className="space-y-3 pt-1">
                      <Link
                        to="/register"
                        className="btn-primary w-full py-3.5 text-sm font-bold rounded-2xl no-underline flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                      >
                        <span>Create Free Account</span>
                        <i className="fa-solid fa-arrow-right text-xs"></i>
                      </Link>

                      <Link
                        to="/login"
                        className="btn-secondary w-full py-3.5 text-sm font-semibold rounded-2xl no-underline flex items-center justify-center gap-2"
                      >
                        <i className="fa-solid fa-right-to-bracket text-xs text-surface-400"></i>
                        <span>Sign In to Existing Account</span>
                      </Link>
                    </div>

                    <div className="pt-2 text-center">
                      <Link
                        to="/forgot-password"
                        className="text-xs font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 no-underline"
                      >
                        Forgot your password? Reset now
                      </Link>
                    </div>

                    {/* Trust badges */}
                    <div className="pt-4 border-t border-surface-100 dark:border-surface-800 flex items-center justify-center gap-4 text-xs text-surface-400">
                      <span><i className="fa-solid fa-lock mr-1 text-emerald-500"></i> Secure SSO</span>
                      <span>&bull;</span>
                      <span><i className="fa-solid fa-check mr-1 text-brand-500"></i> Free for Campus</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── Community Section: Who is on CampusConnect ─── */}
      <section className="py-12 bg-surface-100/60 dark:bg-surface-900/40 border-y border-surface-200 dark:border-surface-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-surface-900 dark:text-surface-100">
              Built for every role on campus
            </h2>
            <p className="mt-2 text-sm text-surface-500">
              One central network bridging student initiatives, academic leadership, and alumni networks.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((c) => (
              <div
                key={c.label}
                className="rounded-2xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`h-12 w-12 rounded-xl ${c.color} flex items-center justify-center text-white text-lg shadow-sm mb-4`}>
                  <i className={c.icon}></i>
                </div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-display text-base font-bold text-surface-900 dark:text-surface-100">{c.label}</h3>
                  <span className="text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/30 px-2 py-0.5 rounded-full">{c.count}</span>
                </div>
                <p className="text-xs text-surface-500 dark:text-surface-400 leading-relaxed mt-2">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Platform Features ─── */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-3">
            {highlights.map((h) => (
              <div
                key={h.title}
                className="rounded-3xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 p-8 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 dark:bg-brand-900/30 text-brand-600 mb-6">
                    <i className={`${h.icon} text-lg`}></i>
                  </div>
                  <h3 className="font-display text-lg font-bold text-surface-900 dark:text-surface-100 mb-2">
                    {h.title}
                  </h3>
                  <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">
                    {h.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
