import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, type Project, type ProjectStatus } from "../api";
import { useAuth } from "../auth";

const statuses: Array<ProjectStatus | ""> = ["", "OPEN", "IN_PROGRESS", "COMPLETED", "CLOSED"];

const statusStyle: Record<string, string> = {
  OPEN: "badge-success",
  IN_PROGRESS: "badge-warning",
  COMPLETED: "badge-brand",
  CLOSED: "badge-neutral",
};

export function Projects() {
  const { user } = useAuth();
  const [q, setQ] = useState("");
  const [skill, setSkill] = useState("");
  const [status, setStatus] = useState<ProjectStatus | "">("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    void api
      .listProjects({ q, skill, status })
      .then((d) => setProjects(d.projects))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, [q, skill, status]);

  return (
    <div className="animate-fade-in">
      {/* Page header */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="page-heading">
            <i className="fa-solid fa-folder-open mr-3 text-brand-600"></i>
            Projects
          </h1>
          <p className="mt-2 text-surface-500 dark:text-surface-400">
            Discover projects, filter by skill or status, and find your next team.
          </p>
        </div>
        {user && (
          <Link to="/projects/new" className="btn-accent no-underline">
            <i className="fa-solid fa-plus text-xs"></i>
            Publish a project
          </Link>
        )}
      </div>

      {/* Filter bar */}
      <form className="card p-5 grid gap-4 md:grid-cols-4 items-end mb-8" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-surface-500 dark:text-surface-400">Keyword</label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <i className="fa-solid fa-magnifying-glass text-xs text-surface-400"></i>
            </div>
            <input
              className="input pl-9"
              placeholder="Search projects..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-surface-500 dark:text-surface-400">Skill</label>
          <input
            className="input"
            placeholder="e.g. React, Python"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-surface-500 dark:text-surface-400">Status</label>
          <select
            className="input"
            value={status}
            onChange={(e) => setStatus(e.target.value as ProjectStatus | "")}
          >
            {statuses.map((s) => (
              <option key={s || "all"} value={s}>
                {s ? s.replace("_", " ") : "Any status"}
              </option>
            ))}
          </select>
        </div>
        <button className="btn-primary">
          <i className="fa-solid fa-filter text-xs"></i>
          Filter
        </button>
      </form>

      {/* Error state */}
      {error && (
        <div className="flex items-start gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-700 ring-1 ring-red-200 mb-6 animate-slide-down">
          <i className="fa-solid fa-circle-exclamation mt-0.5 text-red-500"></i>
          {error}
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-20 text-surface-400">
          <i className="fa-solid fa-spinner fa-spin text-2xl"></i>
        </div>
      )}

      {/* Project grid */}
      {!loading && (
        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <li
              key={project.id}
              className="card p-6 animate-slide-up flex flex-col"
              style={{ animationDelay: `${0.05 * i}s` }}
            >
              {/* Top row: title + status */}
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-display text-lg font-bold text-surface-900 leading-snug dark:text-surface-100">
                  <Link
                    to={`/projects/${project.id}`}
                    className="no-underline hover:text-brand-600 transition-colors dark:hover:text-brand-400"
                  >
                    {project.title}
                  </Link>
                </h2>
                <span className={statusStyle[project.status] || "badge-neutral"}>
                  {project.status.replace("_", " ")}
                </span>
              </div>

              {/* Description */}
              <p className="mt-3 text-sm leading-relaxed text-surface-500 line-clamp-3 flex-1 dark:text-surface-400">
                {project.description}
              </p>

              {/* Skills */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {project.requiredSkills.slice(0, 4).map((s) => (
                  <span key={s} className="badge-neutral text-[11px]">
                    {s}
                  </span>
                ))}
                {project.requiredSkills.length > 4 && (
                  <span className="badge-neutral text-[11px]">+{project.requiredSkills.length - 4}</span>
                )}
              </div>

              {/* Footer */}
              <div className="mt-4 flex items-center justify-between border-t border-surface-100 pt-3 dark:border-surface-800">
                <div className="flex items-center gap-1.5 text-xs text-surface-400 dark:text-surface-500">
                  {project._count?.members ?? 0}/{project.teamCapacity} members
                </div>
                <Link
                  to={`/projects/${project.id}`}
                  className="text-xs font-semibold text-brand-600 no-underline hover:text-brand-700 transition-colors dark:text-brand-400 dark:hover:text-brand-300"
                >
                  View details →
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Empty state */}
      {!loading && projects.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-100 dark:bg-surface-800">
            <i className="fa-solid fa-folder-open text-2xl text-surface-300 dark:text-surface-600"></i>
          </div>
          <p className="mt-4 font-medium text-surface-600 dark:text-surface-400">
            No projects match those filters.
          </p>
          <p className="mt-1 text-sm text-surface-400 dark:text-surface-500">
            Try broadening your search or create the first project!
          </p>
        </div>
      )}
    </div>
  );
}