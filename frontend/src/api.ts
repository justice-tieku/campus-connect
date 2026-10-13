export type Role = "STUDENT" | "ADMIN" | "FACULTY" | "ALUMNI" | "STAFF";
export type ProjectStatus = "OPEN" | "IN_PROGRESS" | "COMPLETED" | "CLOSED";
export type JoinRequestStatus = "PENDING" | "APPROVED" | "REJECTED";
export type OpportunityType = "INTERNSHIP" | "EVENT" | "SCHOLARSHIP" | "OTHER";

export type Profile = {
  id: string;
  userId: string;
  biography: string;
  institution: string;
  programme: string;
  skills: string[];
  githubLink?: string | null;
  portfolioLink?: string | null;
  imageUrl?: string | null;
};

export type User = {
  id: string;
  email: string;
  role: Role;
  isActive?: boolean;
  createdAt?: string;
  profile?: Profile | null;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  requiredSkills: string[];
  status: ProjectStatus;
  teamCapacity: number;
  creatorId: string;
  createdAt: string;
  creator?: { id: string; email: string; profile?: Partial<Profile> | null };
  members?: Array<{
    id: string;
    userId: string;
    user: { id: string; email: string; profile?: Partial<Profile> | null };
  }>;
  _count?: { members: number; joinRequests?: number };
};

export type JoinRequest = {
  id: string;
  projectId: string;
  userId: string;
  status: JoinRequestStatus;
  message?: string | null;
  user?: { id: string; email: string; profile?: Partial<Profile> | null };
};

export type Opportunity = {
  id: string;
  title: string;
  description: string;
  type: OpportunityType;
  link?: string | null;
  createdAt: string;
};

export type Report = {
  id: string;
  reason: string;
  status: string;
  createdAt: string;
  reporter: { id: string; email: string };
  reportedUser?: { id: string; email: string } | null;
  project?: { id: string; title: string } | null;
};

const API_BASE = (import.meta.env.VITE_API_ORIGIN || "https://campus-connect-98hk.onrender.com").replace(/\/+$/, "");

export function getStoredToken(): string | null {
  return localStorage.getItem("cc_auth_token");
}

export function setStoredToken(token: string | null) {
  if (token) {
    localStorage.setItem("cc_auth_token", token);
  } else {
    localStorage.removeItem("cc_auth_token");
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const token = getStoredToken();
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  const url = API_BASE ? `${API_BASE}${path}` : path;
  const res = await fetch(url, {
    ...init,
    headers,
    credentials: "include",
  });
  if (res.status === 204) {
    return undefined as T;
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (data.details && data.details.fieldErrors) {
      const messages = Object.entries(data.details.fieldErrors)
        .map(([field, errs]) => `${field}: ${(errs as string[]).join(", ")}`)
        .join("; ");
      throw new Error(`${data.error}: ${messages}`);
    }
    throw new Error(data.error || "Request failed");
  }
  return data as T;
}

export const api = {
  me: () => request<{ user: User }>("/api/auth/me"),
  register: async (data: {
    email: string;
    password: string;
    role?: Role;
    firstName?: string;
    lastName?: string;
    institution?: string;
    programme?: string;
  }) => {
    const res = await request<{ user: User; token?: string }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (res.token) {
      setStoredToken(res.token);
    }
    return res;
  },
  login: async (email: string, password: string) => {
    const res = await request<{ user: User; token?: string }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (res.token) {
      setStoredToken(res.token);
    }
    return res;
  },
  forgotPassword: (email: string) =>
    request<{ message: string }>("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
  resetPassword: (token: string, password: string) =>
    request<{ message: string }>("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, password }),
    }),
  logout: () => request<{ ok: boolean }>("/api/auth/logout", { method: "POST" }),
  getProfile: () => request<{ profile: Profile | null }>("/api/profile/me"),
  updateProfile: (body: Partial<Profile>) =>
    request<{ profile: Profile }>("/api/profile/me", {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  listProjects: (params: { q?: string; skill?: string; status?: string }) => {
    const search = new URLSearchParams();
    if (params.q) search.set("q", params.q);
    if (params.skill) search.set("skill", params.skill);
    if (params.status) search.set("status", params.status);
    const qs = search.toString();
    return request<{ projects: Project[] }>(`/api/projects${qs ? `?${qs}` : ""}`);
  },
  getProject: (id: string) =>
    request<{
      project: Project;
      isOwner: boolean;
      isMember: boolean;
      joinRequests?: JoinRequest[];
      myJoinRequest: JoinRequest | null;
    }>(`/api/projects/${id}`),
  createProject: (body: {
    title: string;
    description: string;
    requiredSkills: string[];
    teamCapacity: number;
    status?: ProjectStatus;
  }) =>
    request<{ project: Project }>("/api/projects", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  updateProject: (id: string, body: Record<string, unknown>) =>
    request<{ project: Project }>(`/api/projects/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  deleteProject: (id: string) =>
    request<void>(`/api/projects/${id}`, { method: "DELETE" }),
  joinProject: (id: string, message?: string) =>
    request<{ joinRequest: JoinRequest }>(`/api/projects/${id}/join-requests`, {
      method: "POST",
      body: JSON.stringify({ message }),
    }),
  decideJoin: (id: string, status: "APPROVED" | "REJECTED") =>
    request<{ joinRequest: JoinRequest }>(`/api/join-requests/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  listOpportunities: () => request<{ opportunities: Opportunity[] }>("/api/opportunities"),
  createOpportunity: (body: {
    title: string;
    description: string;
    type?: OpportunityType;
    link?: string;
  }) =>
    request<{ opportunity: Opportunity }>("/api/admin/opportunities", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  adminUsers: () => request<{ users: User[] }>("/api/admin/users"),
  patchUser: (id: string, body: { isActive?: boolean }) =>
    request<{ user: User }>(`/api/admin/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  adminProjects: () => request<{ projects: Project[] }>("/api/admin/projects"),
  adminDeleteProject: (id: string) =>
    request<void>(`/api/admin/projects/${id}`, { method: "DELETE" }),
  adminReports: () => request<{ reports: Report[] }>("/api/admin/reports"),
  patchReport: (id: string, status: "RESOLVED" | "DISMISSED") =>
    request<{ report: Report }>(`/api/admin/reports/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  createReport: (body: { reason: string; projectId?: string }) =>
    request("/api/reports", { method: "POST", body: JSON.stringify(body) }),
};
