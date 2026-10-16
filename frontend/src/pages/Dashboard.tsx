import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, type Project, type Profile } from "../api";
import { useAuth } from "../auth";

export function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const [projRes, profRes] = await Promise.allSettled([
          api.listProjects({}),
          api.getProfile(),
        ]);
        if (projRes.status === "fulfilled") {
          setProjects(projRes.value.projects || []);
        }
        if (profRes.status === "fulfilled" && profRes.value.profile) {
          setProfile(profRes.value.profile);
        }
      } catch (err) {
        console.error("Error loading dashboard data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const userSkills = profile?.skills || ["React", "TypeScript", "Node.js"];
  const userProjects = projects.filter((p) => p.creatorId === user?.id || p.members?.some((m) => m.userId === user?.id));
  const openProjects = projects.filter((p) => p.status === "OPEN");
  
  // Filter recommended projects
  const filteredProjects = projects.filter((p) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.requiredSkills.some((s) => s.toLowerCase().includes(query))
    );
  });

  const displayName = user?.email ? user.email.split("@")[0] : "Student";
  const formattedName = displayName.charAt(0).toUpperCase() + displayName.slice(1);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#faf8ff] text-[#131b2e] flex flex-col md:flex-row antialiased">
      {/* VERTICAL SIDEBAR */}
      <aside className="w-full md:w-64 bg-white border-r border-[#e2e8f0] flex-shrink-0 flex flex-col justify-between hidden md:flex">
        <div className="p-4 space-y-4">
          {/* Sidebar Workspace Header */}
          <div className="flex items-center gap-3 pb-3 border-b border-[#e2e8f0]">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
              <span className="material-symbols-outlined text-[20px]">school</span>
            </div>
            <div className="min-w-0">
              <h2 className="font-semibold text-sm text-slate-900 truncate">Engineering Hub</h2>
              <p className="text-xs text-slate-500 truncate">{profile?.institution || "Verified University"}</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <Link
              to="/dashboard"
              className="flex items-center gap-2.5 px-3 py-2 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-semibold border-l-2 border-emerald-600 no-underline"
            >
              <span className="material-symbols-outlined text-[18px]">dashboard</span>
              <span>Dashboard</span>
            </Link>
            <Link
              to="/projects"
              className="flex items-center gap-2.5 px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg text-xs font-medium no-underline transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">code_blocks</span>
              <span>All Projects</span>
            </Link>
            <Link
              to="/opportunities"
              className="flex items-center gap-2.5 px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg text-xs font-medium no-underline transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">work</span>
              <span>Internships</span>
            </Link>
            <Link
              to="/profile"
              className="flex items-center gap-2.5 px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg text-xs font-medium no-underline transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">person</span>
              <span>Profile Settings</span>
            </Link>
          </nav>

          {/* Action Button */}
          <div className="pt-2">
            <Link
              to="/projects/new"
              className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 no-underline transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">add_circle</span>
              <span>Create Project</span>
            </Link>
          </div>
        </div>

        {/* Sidebar Footer User Pill */}
        <div className="p-4 border-t border-[#e2e8f0] space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs uppercase">
                {displayName.charAt(0)}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-slate-900 truncate">{formattedName}</p>
                <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={async () => {
                await logout();
                navigate("/login");
              }}
              title="Log Out"
              className="text-slate-400 hover:text-slate-700 p-1"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN VIEWPORT */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* 1. Header Area with Term and Search */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Hello, {formattedName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Active engineering projects matching verified university student skills.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              Term: Active Academic 2025
            </span>
          </div>
        </div>

        {/* 2. Stat Pills Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Available Projects</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{openProjects.length}</p>
              <p className="text-xs text-slate-500 mt-0.5">Open for collaboration</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
              <span className="material-symbols-outlined text-[22px]">hub</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Your Workspaces</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{userProjects.length}</p>
              <p className="text-xs text-slate-500 mt-0.5">Created or joined</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700">
              <span className="material-symbols-outlined text-[22px]">deployed_code</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Skills Registered</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{userSkills.length}</p>
              <p className="text-xs text-slate-500 mt-0.5">Verified competencies</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700">
              <span className="material-symbols-outlined text-[22px]">verified</span>
            </div>
          </div>
        </div>

        {/* 3. Recommended Projects Section */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Recommended Projects</h2>
              <p className="text-xs text-slate-500">Curated based on university department & demonstrated competencies</p>
            </div>
            {/* Quick search input */}
            <div className="relative w-full sm:w-64">
              <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search skills, title..."
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 transition-colors"
              />
            </div>
          </div>

          {loading ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500 text-sm">
              Loading active projects...
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500 space-y-3">
              <p className="text-sm">No matching projects found.</p>
              <Link
                to="/projects/new"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg no-underline"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                Create the First Project
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProjects.slice(0, 6).map((proj) => {
                const openSeats = Math.max(0, proj.teamCapacity - (proj._count?.members || 0));
                return (
                  <div
                    key={proj.id}
                    className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between hover:border-slate-300 transition-colors shadow-sm"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold ${
                            proj.status === "OPEN"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              proj.status === "OPEN" ? "bg-emerald-600" : "bg-slate-400"
                            }`}
                          ></span>
                          {openSeats > 0 ? `Recruiting ${openSeats} Contributors` : "Full Team"}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          Cap: {proj.teamCapacity}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 mb-2 line-clamp-1">
                        {proj.title}
                      </h3>
                      <p className="text-xs text-slate-600 mb-4 line-clamp-3 leading-relaxed">
                        {proj.description}
                      </p>

                      {/* Required Skills Badges */}
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {proj.requiredSkills.slice(0, 4).map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-slate-50 text-slate-700 border border-slate-200 rounded text-[11px]"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold flex items-center justify-center uppercase">
                          {proj.creator?.email?.charAt(0) || "U"}
                        </div>
                        <span className="text-xs text-slate-500 truncate max-w-[120px]">
                          {proj.creator?.email?.split("@")[0] || "Author"}
                        </span>
                      </div>

                      <Link
                        to={`/projects/${proj.id}`}
                        className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5 no-underline"
                      >
                        <span>View Specs</span>
                        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
