import { FormEvent, useEffect, useState } from "react";
import { api, type Profile as ProfileType, type User } from "../api";
import { useAuth } from "../auth";

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
      setSaved("Profile saved successfully!");
      setTimeout(() => setSaved(""), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-600 text-xl font-bold text-white">
            {user?.email.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="page-heading mb-1">
              Your profile
            </h1>
            <div className="flex items-center gap-2">
              <span className="badge badge-brand">{user?.role}</span>
              <span className="text-sm text-surface-500">{user?.email}</span>
            </div>
          </div>
        </div>
        <p className="text-surface-500 dark:text-surface-400">
          This info is shown to teammates when you request to join a project.
        </p>
      </div>

      {/* Card */}
      <form className="card p-8 space-y-6" onSubmit={onSubmit}>
        {/* Profile image preview + URL */}
        <div className="flex items-start gap-5">
          <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-brand-50 ring-2 ring-brand-100 dark:bg-brand-900/30 dark:ring-brand-700">
            {form.imageUrl ? (
              <img src={form.imageUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <i className="fa-solid fa-user text-2xl text-brand-300 dark:text-brand-600"></i>
            )}
          </div>
          <div className="flex-1">
            <label className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">
              Profile image URL
            </label>
            <input
              type="url"
              className="input"
              value={form.imageUrl || ""}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              placeholder="https://example.com/photo.jpg"
            />
          </div>
        </div>

        {/* Biography */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">
            <i className="fa-solid fa-quote-left mr-1.5 text-xs text-surface-400"></i>
            Biography
          </label>
          <textarea
            className="input min-h-28 resize-y"
            value={form.biography || ""}
            onChange={(e) => setForm({ ...form, biography: e.target.value })}
            placeholder="Tell teammates about yourself, your interests, and what you're looking for..."
          />
        </div>

        {/* Institution + Programme */}
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">
              <i className="fa-solid fa-building-columns mr-1.5 text-xs text-surface-400"></i>
              Institution
            </label>
            <input
              className="input"
              value={form.institution || ""}
              onChange={(e) => setForm({ ...form, institution: e.target.value })}
              placeholder="University of Lagos"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">
              <i className="fa-solid fa-book mr-1.5 text-xs text-surface-400"></i>
              Programme
            </label>
            <input
              className="input"
              value={form.programme || ""}
              onChange={(e) => setForm({ ...form, programme: e.target.value })}
              placeholder="Computer Science"
            />
          </div>
        </div>

        {/* Skills */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">
            <i className="fa-solid fa-wand-magic-sparkles mr-1.5 text-xs text-surface-400"></i>
            Skills
          </label>
          <div className="mt-2 flex flex-wrap gap-2">
            {(form.skills || []).map((skill) => (
              <button
                type="button"
                key={skill}
                className="badge-brand gap-1.5 cursor-pointer transition-all duration-200 hover:bg-brand-100 hover:ring-brand-300 dark:hover:bg-brand-800 dark:hover:ring-brand-600"
                onClick={() =>
                  setForm({ ...form, skills: (form.skills || []).filter((s) => s !== skill) })
                }
              >
                {skill}
                <i className="fa-solid fa-xmark text-[10px] text-brand-400 dark:text-brand-500"></i>
              </button>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <input
              className="input flex-1"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              placeholder="Type a skill and press Enter…"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSkill();
                }
              }}
            />
            <button type="button" className="btn-secondary px-4" onClick={addSkill}>
              <i className="fa-solid fa-plus text-xs"></i>
              Add
            </button>
          </div>
        </div>

        {/* Links */}
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">
              <i className="fa-brands fa-github mr-1.5 text-xs text-surface-400"></i>
              GitHub
            </label>
            <input
              type="url"
              className="input"
              value={form.githubLink || ""}
              onChange={(e) => setForm({ ...form, githubLink: e.target.value })}
              placeholder="https://github.com/username"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">
              <i className="fa-solid fa-globe mr-1.5 text-xs text-surface-400"></i>
              Portfolio
            </label>
            <input
              type="url"
              className="input"
              value={form.portfolioLink || ""}
              onChange={(e) => setForm({ ...form, portfolioLink: e.target.value })}
              placeholder="https://yourportfolio.com"
            />
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="flex items-start gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-700 ring-1 ring-red-200 animate-slide-down dark:bg-red-900/20 dark:text-red-300 dark:ring-red-800">
            <i className="fa-solid fa-circle-exclamation mt-0.5 text-red-500"></i>
            {error}
          </div>
        )}
        {saved && (
          <div className="flex items-start gap-2 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700 ring-1 ring-emerald-200 animate-slide-down dark:bg-emerald-900/20 dark:text-emerald-300 dark:ring-emerald-800">
            <i className="fa-solid fa-circle-check mt-0.5 text-emerald-500"></i>
            {saved}
          </div>
        )}

        {/* Submit */}
        <button className="btn-primary w-full py-3" disabled={busy}>
          {busy ? (
            <>
              <i className="fa-solid fa-spinner fa-spin text-xs"></i>
              Saving…
            </>
          ) : (
            <>
              <i className="fa-solid fa-check text-xs"></i>
              Save profile
            </>
          )}
        </button>
      </form>
    </div>
  );
}
