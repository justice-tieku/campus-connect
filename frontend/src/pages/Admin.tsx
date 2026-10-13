import { FormEvent, useEffect, useState } from "react";
import { api, type OpportunityType, type Project, type Report, type User } from "../api";

export function Admin() {
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<OpportunityType>("INTERNSHIP");
  const [link, setLink] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");
  const [activeTab, setActiveTab] = useState<"opportunity" | "users" | "projects" | "reports">("opportunity");

  async function load() {
    const [u, p, r] = await Promise.all([api.adminUsers(), api.adminProjects(), api.adminReports()]);
    setUsers(u.users);
    setProjects(p.projects);
    setReports(r.reports);
  }

  useEffect(() => {
    void load().catch((err) => setError(err instanceof Error ? err.message : "Admin load failed"));
  }, []);

  async function createOpp(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSaved("");
    try {
      await api.createOpportunity({ title, description, type, link: link || undefined });
      setTitle("");
      setDescription("");
      setLink("");
      setSaved("Opportunity published successfully!");
      setTimeout(() => setSaved(""), 4000);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Create failed");
    }
  }

  const tabs = [
    { key: "opportunity", label: "New Opportunity", icon: "fa-solid fa-plus" },
    { key: "users", label: "Users", icon: "fa-solid fa-users", count: users.length },
    { key: "projects", label: "Projects", icon: "fa-solid fa-folder", count: projects.length },
    { key: "reports", label: "Reports", icon: "fa-solid fa-flag", count: reports.filter((r) => r.status === "PENDING").length },
  ] as const;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="page-heading">
          <i className="fa-solid fa-shield-halved mr-3 text-brand-500"></i>
          Admin Dashboard
        </h1>
        <p className="mt-2 text-surface-500">
          Manage users, moderate content, review reports, and publish opportunities.
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-700 ring-1 ring-red-200 mb-6 animate-slide-down">
          <i className="fa-solid fa-circle-exclamation mt-0.5 text-red-500"></i>
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 rounded-xl bg-surface-100 p-1 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
              activeTab === tab.key
                ? "bg-white text-surface-900 shadow-sm"
                : "text-surface-500 hover:text-surface-700"
            }`}
          >
            <i className={`${tab.icon} text-xs`}></i>
            {tab.label}
            {"count" in tab && tab.count > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-100 px-1.5 text-[10px] font-bold text-brand-700">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* New Opportunity */}
      {activeTab === "opportunity" && (
        <div className="card p-8 animate-slide-up">
          <h2 className="section-heading mb-6">
            <i className="fa-solid fa-rocket mr-2 text-accent-500"></i>
            Publish new opportunity
          </h2>
          <form className="space-y-5" onSubmit={createOpp}>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-surface-700">Title</label>
              <input
                className="input"
                placeholder="e.g. Google Summer of Code 2025"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-surface-700">Description</label>
              <textarea
                className="input min-h-28 resize-y"
                placeholder="Describe the opportunity, eligibility, and deadlines..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-surface-700">Type</label>
                <select className="input" value={type} onChange={(e) => setType(e.target.value as OpportunityType)}>
                  <option>INTERNSHIP</option>
                  <option>EVENT</option>
                  <option>SCHOLARSHIP</option>
                  <option>OTHER</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-surface-700">Link (optional)</label>
                <input
                  className="input"
                  placeholder="https://..."
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                />
              </div>
            </div>

            {saved && (
              <div className="flex items-start gap-2 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700 ring-1 ring-emerald-200">
                <i className="fa-solid fa-circle-check mt-0.5 text-emerald-500"></i>
                {saved}
              </div>
            )}

            <button className="btn-primary">
              <i className="fa-solid fa-paper-plane text-xs"></i>
              Publish opportunity
            </button>
          </form>
        </div>
      )}

      {/* Users */}
      {activeTab === "users" && (
        <div className="card overflow-hidden animate-slide-up">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-surface-50 border-b border-surface-200">
                <tr>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-surface-500">User</th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-surface-500">Role</th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-surface-500">Status</th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-surface-500">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-surface-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
                          {u.email.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-surface-800">{u.email}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={u.role === "ADMIN" ? "badge-brand" : "badge-neutral"}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={u.isActive ? "badge-success" : "badge-neutral"}>
                        {u.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        className={`text-xs font-semibold transition-colors ${
                          u.isActive
                            ? "text-red-600 hover:text-red-700"
                            : "text-emerald-600 hover:text-emerald-700"
                        }`}
                        onClick={() =>
                          void api.patchUser(u.id, { isActive: !u.isActive }).then(() => load())
                        }
                      >
                        {u.isActive ? "Deactivate" : "Reactivate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Projects */}
      {activeTab === "projects" && (
        <div className="space-y-3 animate-slide-up">
          {projects.map((p) => (
            <div
              key={p.id}
              className="card p-4 flex flex-wrap items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <i className="fa-solid fa-folder text-sm"></i>
                </div>
                <div>
                  <p className="text-sm font-semibold text-surface-800">{p.title}</p>
                  <span className={`mt-0.5 inline-block text-[11px] ${
                    p.status === "OPEN" ? "badge-success" : p.status === "IN_PROGRESS" ? "badge-warning" : "badge-neutral"
                  }`}>
                    {p.status.replace("_", " ")}
                  </span>
                </div>
              </div>
              <button
                className="btn-danger text-xs px-3 py-1.5"
                onClick={() => void api.adminDeleteProject(p.id).then(() => load())}
              >
                <i className="fa-solid fa-trash text-[10px]"></i>
                Remove
              </button>
            </div>
          ))}
          {projects.length === 0 && (
            <p className="text-center text-sm text-surface-400 py-8">No projects to moderate.</p>
          )}
        </div>
      )}

      {/* Reports */}
      {activeTab === "reports" && (
        <div className="space-y-3 animate-slide-up">
          {reports.map((r) => (
            <div key={r.id} className="card p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="text-sm text-surface-800">{r.reason}</p>
                  <p className="mt-1.5 text-xs text-surface-400">
                    <i className="fa-solid fa-user mr-1 text-[10px]"></i>
                    by {r.reporter.email}
                    {r.project && (
                      <> · <i className="fa-solid fa-folder mr-1 text-[10px]"></i>{r.project.title}</>
                    )}
                    {r.reportedUser && (
                      <> · <i className="fa-solid fa-user-slash mr-1 text-[10px]"></i>{r.reportedUser.email}</>
                    )}
                  </p>
                  <span className={`mt-2 inline-block text-[11px] ${
                    r.status === "PENDING" ? "badge-warning" : r.status === "RESOLVED" ? "badge-success" : "badge-neutral"
                  }`}>
                    {r.status}
                  </span>
                </div>
                {r.status === "PENDING" && (
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors"
                      onClick={() => void api.patchReport(r.id, "RESOLVED").then(() => load())}
                    >
                      <i className="fa-solid fa-check text-[10px]"></i>
                      Resolve
                    </button>
                    <button
                      className="inline-flex items-center gap-1.5 rounded-lg border border-surface-300 px-3 py-1.5 text-xs font-semibold text-surface-600 hover:bg-surface-100 transition-colors"
                      onClick={() => void api.patchReport(r.id, "DISMISSED").then(() => load())}
                    >
                      Dismiss
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {reports.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-100">
                <i className="fa-solid fa-flag text-xl text-surface-300"></i>
              </div>
              <p className="mt-3 text-sm text-surface-400">No reports to review.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
