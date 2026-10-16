import { FormEvent, useEffect, useState } from "react";
import { api, type Profile as ProfileType } from "../api";
import { useAuth } from "../auth";
import { useToast } from "../context/ToastContext";

const empty: Partial<ProfileType> = {
  biography: "",
  institution: "",
  programme: "",
  skills: [],
  githubLink: "",
  portfolioLink: "",
  imageUrl: "",
};

export function Profile() {
  const { user } = useAuth();
  const [form, setForm] = useState(empty);
  const [skillInput, setSkillInput] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void api.getProfile().then((data) => {
      if (data.profile) {
        setForm(data.profile);
      }
    });
  }, []);

  function addSkill() {
    const skill = skillInput.trim();
    if (!skill) return;
    const skills = Array.from(new Set([...(form.skills || []), skill]));
    setForm({ ...form, skills });
    setSkillInput("");
  }

  function removeSkill(skillToRemove: string) {
    const skills = (form.skills || []).filter((s) => s !== skillToRemove);
    setForm({ ...form, skills });
  }

  const toast = useToast();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setSaved("");
    try {
      const { profile } = await api.updateProfile({
        biography: form.biography,
        institution: form.institution,
        programme: form.programme,
        skills: form.skills,
        githubLink: form.githubLink || undefined,
        portfolioLink: form.portfolioLink || undefined,
        imageUrl: form.imageUrl || undefined,
      });
      setForm(profile);
      setSaved("Profile updated successfully!");
      toast.success("Profile updated successfully!", "Saved");
      setTimeout(() => setSaved(""), 4000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Save failed";
      setError(msg);
      toast.error(msg, "Save Failed");
    } finally {
      setBusy(false);
    }
  }

  const displayName = user?.email ? user.email.split("@")[0] : "Student";
  const formattedName = displayName.charAt(0).toUpperCase() + displayName.slice(1);

  return (
    <div className="min-h-[85vh] bg-[#faf8ff] text-[#131b2e] py-8 px-4 sm:px-6 antialiased">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header / Identity Banner */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-2xl uppercase shadow-sm">
              {displayName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  {formattedName}
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                  {user?.role ? user.role.charAt(0) + user.role.slice(1).toLowerCase() : "Student"}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-slate-400">mail</span>
                <span>{user?.email}</span>
                <span className="text-slate-300">•</span>
                <span>{form.institution || "Verified University"}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Success Alert */}
        {saved && (
          <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2 shadow-sm">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            <span>{saved}</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-xs font-semibold text-red-700 flex items-center gap-2 shadow-sm">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{error}</span>
          </div>
        )}

        {/* Form Card */}
        <form className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6 shadow-sm" onSubmit={onSubmit}>
          {/* Bio */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700" htmlFor="bio">
                Developer Bio & Research Focus
              </label>
              <span className="text-xs text-slate-400 font-mono">{(form.biography || "").length} / 280</span>
            </div>
            <p className="text-xs text-slate-500 mb-2">
              Shown to team leads when you request to join a project or apply for an internship.
            </p>
            <textarea
              id="bio"
              rows={3}
              maxLength={280}
              value={form.biography || ""}
              onChange={(e) => setForm({ ...form, biography: e.target.value })}
              placeholder="Tell others what you build and your primary software interests..."
              className="w-full bg-white border border-slate-200 rounded-lg p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Institution */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5" htmlFor="institution">
                University / Institution
              </label>
              <input
                id="institution"
                type="text"
                value={form.institution || ""}
                onChange={(e) => setForm({ ...form, institution: e.target.value })}
                placeholder="e.g. Stanford University or MIT"
                className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors"
              />
            </div>

            {/* Programme */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5" htmlFor="programme">
                Degree / Department
              </label>
              <input
                id="programme"
                type="text"
                value={form.programme || ""}
                onChange={(e) => setForm({ ...form, programme: e.target.value })}
                placeholder="e.g. B.S. Computer Science"
                className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors"
              />
            </div>
          </div>

          {/* Tech Stack Skills */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Tech Stack Skills
            </label>
            <p className="text-xs text-slate-500 mb-2">
              Add programming languages, frameworks, and tools to power project matching.
            </p>

            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill();
                  }
                }}
                placeholder="Type a skill (e.g. Python, Docker) and press Add..."
                className="flex-1 bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors"
              />
              <button
                type="button"
                onClick={addSkill}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                <span>Add</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 min-h-[32px] p-2 bg-slate-50 rounded-lg border border-slate-200">
              {(form.skills || []).length === 0 ? (
                <span className="text-xs text-slate-400">No skills added yet.</span>
              ) : (
                form.skills?.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-white text-emerald-800 border border-emerald-200 rounded text-xs font-semibold shadow-2xs"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="text-slate-400 hover:text-red-600 transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* GitHub URL */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5" htmlFor="github">
                GitHub Profile URL
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined text-slate-400 text-[18px] absolute left-3">code</span>
                <input
                  id="github"
                  type="url"
                  value={form.githubLink || ""}
                  onChange={(e) => setForm({ ...form, githubLink: e.target.value })}
                  placeholder="https://github.com/username"
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors"
                />
              </div>
            </div>

            {/* Portfolio URL */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5" htmlFor="portfolio">
                Portfolio Website
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined text-slate-400 text-[18px] absolute left-3">language</span>
                <input
                  id="portfolio"
                  type="url"
                  value={form.portfolioLink || ""}
                  onChange={(e) => setForm({ ...form, portfolioLink: e.target.value })}
                  placeholder="https://yourportfolio.dev"
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
            <button
              type="submit"
              disabled={busy}
              className="py-2.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[16px]">save</span>
              <span>{busy ? "Saving..." : "Save Profile"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
