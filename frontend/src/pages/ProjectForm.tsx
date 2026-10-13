import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api, type ProjectStatus } from "../api";

export function ProjectForm({ mode }: { mode: "create" | "edit" }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");
  const [teamCapacity, setTeamCapacity] = useState(4);
  const [status, setStatus] = useState<ProjectStatus>("OPEN");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (mode === "edit" && id) {
      void api.getProject(id).then((data) => {
        setTitle(data.project.title);
        setDescription(data.project.description);
        setSkills(data.project.requiredSkills.join(", "));
        setTeamCapacity(data.project.teamCapacity);
        setStatus(data.project.status);
      });
    }
  }, [mode, id]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const requiredSkills = skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    try {
      if (mode === "create") {
        const { project } = await api.createProject({
          title,
          description,
          requiredSkills,
          teamCapacity,
          status,
        });
        navigate(`/projects/${project.id}`);
      } else if (id) {
        await api.updateProject(id, { title, description, requiredSkills, teamCapacity, status });
        navigate(`/projects/${id}`);
      }
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
        <h1 className="page-heading">
          <i className={`fa-solid ${mode === "create" ? "fa-plus-circle" : "fa-pen-to-square"} mr-3 text-brand-500`}></i>
          {mode === "create" ? "Publish a project" : "Edit project"}
        </h1>
        <p className="mt-2 text-surface-500">
          {mode === "create"
            ? "Describe your project idea, set the skills needed, and start recruiting."
            : "Update your project details below."}
        </p>
      </div>

      {/* Form card */}
      <form className="panel p-8 space-y-6" onSubmit={onSubmit}>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-surface-700">
            <i className="fa-solid fa-heading mr-1.5 text-xs text-surface-400"></i>
            Project title
          </label>
          <input
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            minLength={3}
            placeholder="e.g. Campus Food Delivery App"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-surface-700">
            <i className="fa-solid fa-align-left mr-1.5 text-xs text-surface-400"></i>
            Description
          </label>
          <textarea
            className="input min-h-36 resize-y"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            minLength={10}
            placeholder="Describe your project idea, goals, and what you're looking for in teammates..."
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-surface-700">
            <i className="fa-solid fa-wand-magic-sparkles mr-1.5 text-xs text-surface-400"></i>
            Required skills
            <span className="ml-1 font-normal text-surface-400">(comma-separated)</span>
          </label>
          <input
            className="input"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="React, Figma, Python, Node.js"
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-surface-700">
              <i className="fa-solid fa-users mr-1.5 text-xs text-surface-400"></i>
              Team capacity
            </label>
            <input
              className="input"
              type="number"
              min={1}
              max={50}
              value={teamCapacity}
              onChange={(e) => setTeamCapacity(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-surface-700">
              <i className="fa-solid fa-signal mr-1.5 text-xs text-surface-400"></i>
              Status
            </label>
            <select
              className="input"
              value={status}
              onChange={(e) => setStatus(e.target.value as ProjectStatus)}
            >
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-700 ring-1 ring-red-200 animate-slide-down">
            <i className="fa-solid fa-circle-exclamation mt-0.5 text-red-500"></i>
            {error}
          </div>
        )}

        <button className="btn-primary w-full py-3" disabled={busy}>
          {busy ? (
            <>
              <i className="fa-solid fa-spinner fa-spin text-xs"></i>
              Saving…
            </>
          ) : (
            <>
              <i className="fa-solid fa-rocket text-xs"></i>
              {mode === "create" ? "Publish project" : "Save changes"}
            </>
          )}
        </button>
      </form>
    </div>
  );
}
