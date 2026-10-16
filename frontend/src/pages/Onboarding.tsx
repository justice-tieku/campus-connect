import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../auth";
import { Logo } from "../components/Logo";

const AVAILABLE_SKILLS = [
  "React",
  "TypeScript",
  "Python",
  "Node.js",
  "Next.js",
  "FastAPI",
  "Docker",
  "PostgreSQL",
  "PyTorch",
  "GraphQL",
  "Go",
  "Rust",
  "AWS",
  "Tailwind CSS",
  "MongoDB",
  "C++",
];

export function Onboarding() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [bio, setBio] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>(["React", "TypeScript", "Python"]);
  const [experienceLevel, setExperienceLevel] = useState<"beginner" | "intermediate" | "advanced">("intermediate");
  const [availability, setAvailability] = useState("5–10 hrs / wk");
  const [githubUrl, setGithubUrl] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // Load existing profile if available
  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await api.getProfile();
        if (res.profile) {
          if (res.profile.biography) setBio(res.profile.biography);
          if (res.profile.skills && res.profile.skills.length > 0) setSelectedSkills(res.profile.skills);
          if (res.profile.githubLink) setGithubUrl(res.profile.githubLink);
          if (res.profile.portfolioLink) setPortfolioUrl(res.profile.portfolioLink);
        }
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    }
    loadProfile();
  }, []);

  function toggleSkill(skill: string) {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  }

  async function handleSubmit(e?: FormEvent) {
    if (e) e.preventDefault();
    setBusy(true);
    setError("");

    try {
      await api.updateProfile({
        biography: bio.trim(),
        skills: selectedSkills,
        githubLink: githubUrl.trim() || undefined,
        portfolioLink: portfolioUrl.trim() || undefined,
        institution: user?.role === "STAFF" ? "Faculty Staff" : "Undergraduate Campus",
      });
      navigate("/dashboard", { replace: true, state: { message: "Profile setup completed!" } });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#131b2e] antialiased flex flex-col justify-between">
      {/* Header */}
      <header className="w-full bg-white border-b border-[#e2e8f0] px-4 md:px-8 py-3 sticky top-0 z-30 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 no-underline">
              <Logo size={24} />
              <span className="text-sm font-bold text-slate-900 tracking-tight">Campus Connect</span>
            </Link>
            <div className="h-4 w-[1px] bg-[#e2e8f0]"></div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              <span className="material-symbols-outlined text-[14px]">verified</span>
              <span>{user?.role === "STAFF" ? "Staff Verified" : "Student Verified"}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate("/dashboard", { replace: true })}
            className="text-xs text-slate-500 hover:text-slate-900 transition-colors font-medium"
          >
            Skip for now
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-10 flex-1">
        {/* Step Indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0] mb-4">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-emerald-600 text-white text-xs font-bold">
                1
              </span>
              <span className="text-xs text-slate-800 font-semibold uppercase tracking-wider">
                Step 1 of 1 • Profile & Matching Setup
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-700 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
              <span className="font-semibold">Intelligent Match Engine Active</span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Complete Your Developer Profile
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Tell us about your skills so we can match you with the right team builds and tech opportunities.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
            {error}
          </div>
        )}

        {/* Multi-section Form Canvas */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 md:p-8 space-y-8 shadow-sm">
          {/* Section 1: Brief Bio */}
          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700" htmlFor="bio-input">
                Developer Bio & Academic Focus
              </label>
              <span className="text-xs text-slate-400 font-mono">{bio.length} / 280</span>
            </div>
            <p className="text-xs text-slate-500">
              Summarize your degree program, primary engineering interests, and what you want to build.
            </p>
            <div className="relative">
              <textarea
                id="bio-input"
                maxLength={280}
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="e.g. Sophomore CS student passionate about distributed systems and React Native. Looking for team project collaborations."
                className="w-full bg-white border border-[#e2e8f0] rounded-lg p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors resize-none"
              />
            </div>
          </section>

          <div className="h-[1px] bg-[#f1f5f9] w-full"></div>

          {/* Section 2: Tech Stack Tags & Skills */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Tech Stack & Core Competencies
                </label>
                <p className="text-xs text-slate-500">
                  Select libraries, languages, and tools you actively build with.
                </p>
              </div>
              <span className="text-xs text-emerald-700 font-semibold">{selectedSkills.length} Selected</span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {AVAILABLE_SKILLS.map((skill) => {
                const active = selectedSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                      active
                        ? "border-emerald-300 bg-emerald-50 text-emerald-800 shadow-sm"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[15px]">
                      {active ? "check" : "add"}
                    </span>
                    <span>{skill}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <div className="h-[1px] bg-[#f1f5f9] w-full"></div>

          {/* Section 3: Engineering Experience Level */}
          <section className="space-y-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Engineering Experience Level
              </label>
              <p className="text-xs text-slate-500">
                Helps project owners balance juniors and system architects.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Beginner */}
              <div
                onClick={() => setExperienceLevel("beginner")}
                className={`border rounded-xl p-4 cursor-pointer transition-all flex flex-col justify-between ${
                  experienceLevel === "beginner"
                    ? "border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-600/30"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900">Beginner / Learner</span>
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        experienceLevel === "beginner" ? "border-emerald-600 bg-emerald-600" : "border-slate-300"
                      }`}
                    >
                      {experienceLevel === "beginner" && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Working through core coursework, eager to contribute to starter repos and learn workflows.
                  </p>
                </div>
                <div className="pt-3 mt-3 border-t border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-400">Level 1 • Contributor</span>
                </div>
              </div>

              {/* Intermediate */}
              <div
                onClick={() => setExperienceLevel("intermediate")}
                className={`border rounded-xl p-4 cursor-pointer transition-all flex flex-col justify-between ${
                  experienceLevel === "intermediate"
                    ? "border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-600/30"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-emerald-800">Intermediate</span>
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        experienceLevel === "intermediate" ? "border-emerald-600 bg-emerald-600" : "border-slate-300"
                      }`}
                    >
                      {experienceLevel === "intermediate" && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Built several projects, comfortable shipping independently and reviewing peer code.
                  </p>
                </div>
                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-emerald-700">Level 2 • Builder</span>
                  <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                    Active
                  </span>
                </div>
              </div>

              {/* Advanced */}
              <div
                onClick={() => setExperienceLevel("advanced")}
                className={`border rounded-xl p-4 cursor-pointer transition-all flex flex-col justify-between ${
                  experienceLevel === "advanced"
                    ? "border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-600/30"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900">Advanced / Lead</span>
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        experienceLevel === "advanced" ? "border-emerald-600 bg-emerald-600" : "border-slate-300"
                      }`}
                    >
                      {experienceLevel === "advanced" && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Ready to architect builds, lead repos, or mentor student peers in technical sprints.
                  </p>
                </div>
                <div className="pt-3 mt-3 border-t border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-400">Level 3 • Architect</span>
                </div>
              </div>
            </div>
          </section>

          <div className="h-[1px] bg-[#f1f5f9] w-full"></div>

          {/* Section 4: Weekly Availability */}
          <section className="space-y-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Weekly Availability for Lab Projects
              </label>
              <p className="text-xs text-slate-500">Realistic commitment hours outside of regular lectures.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
              {["< 5 hrs / wk", "5–10 hrs / wk", "10–20 hrs / wk", "20+ hrs / wk"].map((hrs) => {
                const active = availability === hrs;
                return (
                  <button
                    key={hrs}
                    type="button"
                    onClick={() => setAvailability(hrs)}
                    className={`py-2 px-3 rounded-lg border text-xs text-center font-semibold transition-all ${
                      active
                        ? "border-emerald-600 bg-emerald-50 text-emerald-800 shadow-sm"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    {active && <span className="material-symbols-outlined text-[14px] mr-1 align-middle">check</span>}
                    <span>{hrs}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <div className="h-[1px] bg-[#f1f5f9] w-full"></div>

          {/* Section 5: External Links & Verification */}
          <section className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                External Links & Verification
              </label>
              <p className="text-xs text-slate-500">
                Connect external accounts to qualify for team leads and faculty research sponsorships.
              </p>
            </div>
            <div className="space-y-3">
              <div className="space-y-1">
                <span className="text-xs text-slate-600 font-medium">GitHub Profile URL</span>
                <div className="relative flex items-center rounded-lg border border-slate-200 bg-white px-3 py-2 focus-within:border-emerald-600 focus-within:ring-1 focus-within:ring-emerald-600 transition-colors">
                  <span className="material-symbols-outlined text-slate-400 text-[18px] mr-2">code</span>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/username"
                    className="w-full bg-transparent border-0 p-0 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-0 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-slate-600 font-medium">Personal Portfolio or Domain</span>
                <div className="relative flex items-center rounded-lg border border-slate-200 bg-white px-3 py-2 focus-within:border-emerald-600 focus-within:ring-1 focus-within:ring-emerald-600 transition-colors">
                  <span className="material-symbols-outlined text-slate-400 text-[18px] mr-2">language</span>
                  <input
                    type="url"
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                    placeholder="https://yourportfolio.dev"
                    className="w-full bg-transparent border-0 p-0 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-0 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Bottom Action Hub */}
          <div className="pt-4 border-t border-[#f1f5f9] flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-400 text-center md:text-left order-2 md:order-1">
              Preferences can be modified anytime in Workspace Settings.
            </p>
            <button
              type="button"
              onClick={() => handleSubmit()}
              disabled={busy}
              className="w-full md:w-auto order-1 md:order-2 inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm disabled:opacity-50"
            >
              <span>{busy ? "Saving..." : "Complete Setup & Enter Dashboard"}</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[#e2e8f0] bg-white py-4 px-6 text-center text-xs text-slate-400">
        Campus Connect University Ecosystem • All verified rights reserved
      </footer>
    </div>
  );
}
