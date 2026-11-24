// All admin requests carry credentials (HttpOnly session cookie) and the
// X-Requested-With header required by the server-side CSRF guard.
const HEADERS = { "X-Requested-With": "XMLHttpRequest" } as const;

async function request<T>(url: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(url, {
    credentials: "include",
    ...init,
    headers: { ...HEADERS, ...(init.headers ?? {}) },
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((json as { error?: { message?: string } }).error?.message ?? `Request failed: ${res.status}`);
  }
  return json as T;
}

export const adminApi = {
  me: () => request<{ id: number }>("/api/admin/me"),
  login: (email: string, password: string) =>
    request<{ ok: boolean }>("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    }),
  logout: () => request<{ ok: boolean }>("/api/admin/logout", { method: "POST" }),
  getContent: () => request<{ blocks: unknown[] }>("/api/admin/content"),
  putContent: (key: string, en: unknown, fr: unknown) =>
    request<{ ok: boolean }>(`/api/admin/content/${encodeURIComponent(key)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, en, fr }),
    }),
  getProjects: () => request<{ projects: unknown[] }>("/api/admin/projects"),
  putProject: (slug: string, body: unknown) =>
    request<{ ok: boolean }>(`/api/admin/projects/${encodeURIComponent(slug)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  deleteProject: (slug: string) =>
    request<{ ok: boolean }>(`/api/admin/projects/${encodeURIComponent(slug)}`, { method: "DELETE" }),
  getTimeline: () => request<{ events: unknown[] }>("/api/admin/timeline"),
  postTimeline: (body: unknown) =>
    request<{ ok: boolean }>("/api/admin/timeline", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  putTimeline: (id: number, body: unknown) =>
    request<{ ok: boolean }>(`/api/admin/timeline/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  deleteTimeline: (id: number) => request<{ ok: boolean }>(`/api/admin/timeline/${id}`, { method: "DELETE" }),
  getMedia: () => request<{ media: unknown[] }>("/api/admin/media"),
  uploadMedia: (file: File, altEn: string, altFr: string) =>
    request<{ id: number; path: string }>(
      `/api/admin/media?filename=${encodeURIComponent(file.name)}&altEn=${encodeURIComponent(altEn)}&altFr=${encodeURIComponent(altFr)}`,
      { method: "POST", headers: { "Content-Type": file.type || "application/octet-stream" }, body: file },
    ),
  deleteMedia: (id: number) => request<{ ok: boolean }>(`/api/admin/media/${id}`, { method: "DELETE" }),
  getSettings: () => request<{ settings: Record<string, unknown> }>("/api/admin/settings"),
  putSettings: (body: unknown) =>
    request<{ ok: boolean }>("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
};
