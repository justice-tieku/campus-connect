import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api, type JoinRequest, type Project } from "../api";
import { useAuth } from "../auth";

const statusStyle: Record<string, string> = {
  OPEN: "badge-success",
  IN_PROGRESS: "badge-warning",
  COMPLETED: "badge-brand",
  CLOSED: "badge-neutral",
};

export function ProjectDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [joinRequests, setJoinRequests] = useState<JoinRequest[] | undefined>();
  const [myJoinRequest, setMyJoinRequest] = useState<JoinRequest | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [reportReason, setReportReason] = useState("");
  const [reportOpen, setReportOpen] = useState(false);

  async function load() {
    if (!id) return;
    const data = await api.getProject(id);
    setProject(data.project);
    setIsOwner(data.isOwner);
    setIsMember(data.isMember);
    setJoinRequests(data.joinRequests);
    setMyJoinRequest(data.myJoinRequest);
  }

  useEffect(() => {
    void load().catch((err) => setError(err instanceof Error ? err.message : "Failed to load"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function requestJoin(e: FormEvent) {
    e.preventDefault();
    if (!id) return;
    setError("");
    try {
      await api.joinProject(id, message);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    }
  }

  async function decide(joinId: string, status: "APPROVED" | "REJECTED") {
    setError("");
    try {
      await api.decideJoin(joinId, status);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    }
  }

  async function remove() {
    if (!id || !confirm("Delete this project?")) return;
    await api.deleteProject(id);
    navigate("/projects");
  }

  async function report() {
    if (!id || reportReason.trim().length < 5) return;
    try {
      await api.createReport({ reason: reportReason, projectId: id });
      setReportReason("");
      setReportOpen(false);
      alert("Report submitted to admins.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Report failed");
    }
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center py-20 text-surface-400 animate-fade-in">
        {error ? (
          <div className="text-center">
            <i className="fa-solid fa-circle-exclamation text-3xl text-red-300 mb-3"></i>
            <p className="text-red-600">{error}</p>
          </div>
        ) : (
          <i className="fa-solid fa-spinner fa-spin text-2xl"></i>
        )}
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-4xl animate-fade-in">
      {/* Back link */}
      <Link
        to="/projects"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-surface-500 no-underline hover:text-brand-600 transition-colors mb-6"
      >
        <i className="fa-solid fa-arrow-left text-xs"></i>
        Back to projects
      </Link>

      {/* Header card */}
      <div className="card p-8 mb-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span className={statusStyle[project.status] || "badge-neutral"}>
                {project.status.replace("_", " ")}
              </span>
              <span className="text-xs text-surface-400">
                <i className="fa-solid fa-users mr-1"></i>
                {project.members?.length ?? 0}/{project.teamCapacity} members
              </span>
            </div>
            <h1 className="page-heading">{project.title}</h1>
            <p className="mt-2 text-sm text-surface-500">
              <i className="fa-solid fa-user mr-1.5 text-xs"></i>
              Created by <span className="font-medium text-surface-700">{project.creator?.email}</span>
            </p>
          </div>
          {isOwner && (
            <div className="flex gap-2">
              <Link
                to={`/projects/${project.id}/edit`}
                className="btn-secondary no-underline"
              >
                <i className="fa-solid fa-pen text-xs"></i>
                Edit
              </Link>
              <button className="btn-danger" onClick={() => void remove()}>
                <i className="fa-solid fa-trash text-xs"></i>
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="mt-6 rounded-xl bg-surface-50 p-5 border border-surface-100">
          <p className="whitespace-pre-wrap text-surface-700 leading-relaxed">{project.description}</p>
        </div>

        {/* Skills */}
        <div className="mt-5 flex flex-wrap gap-2">
          {project.requiredSkills.map((s) => (
            <span key={s} className="badge-brand">
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Team section */}
      <div className="card p-6 mb-6">
        <h2 className="section-heading mb-4">
          <i className="fa-solid fa-people-group mr-2 text-brand-500 text-lg"></i>
          Team Members
        </h2>
        {project.members && project.members.length > 0 ? (
          <ul className="space-y-3">
            {project.members.map((m) => (
              <li key={m.id} className="flex items-center gap-3 rounded-xl bg-surface-50 p-3 border border-surface-100">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
                  {m.user.email.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-surface-800">{m.user.email}</p>
                  {m.user.profile?.programme && (
                    <p className="text-xs text-surface-400">{m.user.profile.programme}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-surface-400">No team members yet.</p>
        )}
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-700 ring-1 ring-red-200 mb-6 animate-slide-down">
          <i className="fa-solid fa-circle-exclamation mt-0.5 text-red-500"></i>
          {error}
        </div>
      )}

      {/* Join request form */}
      {user && !isOwner && !isMember && project.status === "OPEN" && myJoinRequest?.status !== "PENDING" && (
        <div className="card p-6 mb-6">
          <h2 className="section-heading mb-4">
            <i className="fa-solid fa-hand-point-up mr-2 text-accent-500 text-lg"></i>
            Request to join
          </h2>
          <form onSubmit={requestJoin}>
            <textarea
              className="input min-h-24 resize-y"
              placeholder="Tell the owner why you'd be a great fit (optional)..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button className="btn-primary mt-3">
              <i className="fa-solid fa-paper-plane text-xs"></i>
              Send request
            </button>
          </form>
        </div>
      )}

      {/* My join request status */}
      {myJoinRequest && !isMember && (
        <div className="card p-5 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
              <i className="fa-solid fa-clock text-amber-500"></i>
            </div>
            <div>
              <p className="text-sm font-medium text-surface-700">Your join request</p>
              <p className="text-xs text-surface-400">
                Status: <span className="font-semibold">{myJoinRequest.status}</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Join requests management */}
      {joinRequests && (isOwner || user?.role === "ADMIN") && (
        <div className="card p-6 mb-6">
          <h2 className="section-heading mb-4">
            <i className="fa-solid fa-inbox mr-2 text-brand-500 text-lg"></i>
            Join Requests
          </h2>
          <ul className="space-y-3">
            {joinRequests.map((jr) => (
              <li key={jr.id} className="rounded-xl bg-surface-50 p-4 border border-surface-100">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
                      {jr.user?.email?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-surface-800">{jr.user?.email}</p>
                      <p className="text-xs text-surface-500 mt-0.5">{jr.message || "No note provided"}</p>
                      <span className={`mt-1.5 inline-block text-[11px] ${jr.status === "PENDING" ? "badge-warning" : jr.status === "APPROVED" ? "badge-success" : "badge-neutral"}`}>
                        {jr.status}
                      </span>
                    </div>
                  </div>
                  {jr.status === "PENDING" && (
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors"
                        onClick={() => void decide(jr.id, "APPROVED")}
                      >
                        <i className="fa-solid fa-check text-[10px]"></i>
                        Accept
                      </button>
                      <button
                        className="inline-flex items-center gap-1.5 rounded-lg border border-surface-300 px-3 py-1.5 text-xs font-semibold text-surface-600 hover:bg-surface-100 transition-colors"
                        onClick={() => void decide(jr.id, "REJECTED")}
                      >
                        <i className="fa-solid fa-xmark text-[10px]"></i>
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </li>
            ))}
            {joinRequests.length === 0 && (
              <li className="text-sm text-surface-400 text-center py-6">
                <i className="fa-solid fa-inbox text-2xl text-surface-200 mb-2 block"></i>
                No requests yet.
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Report section */}
      {user && !isOwner && (
        <div className="border-t border-surface-200 pt-6 mt-6">
          {!reportOpen ? (
            <button
              className="btn-ghost text-xs text-surface-400"
              onClick={() => setReportOpen(true)}
            >
              <i className="fa-solid fa-flag text-[10px]"></i>
              Report this project
            </button>
          ) : (
            <div className="card p-5 animate-slide-down">
              <h3 className="text-sm font-semibold text-surface-700 mb-3">
                <i className="fa-solid fa-flag mr-1.5 text-xs text-red-400"></i>
                Report this project
              </h3>
              <textarea
                className="input min-h-20 resize-y text-sm"
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="Describe the issue (min 5 characters)..."
              />
              <div className="mt-3 flex gap-2">
                <button className="btn-danger text-xs px-3 py-1.5" onClick={() => void report()}>
                  Submit report
                </button>
                <button className="btn-ghost text-xs" onClick={() => setReportOpen(false)}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </article>
  );
}
