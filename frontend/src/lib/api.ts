const BASE = import.meta.env.VITE_API_URL ?? "";
const KEY = "alpacaire.token";

export const token = {
  get: () => {
    try { return localStorage.getItem(KEY); } catch { return null; }
  },
  set: (t: string | null) => {
    try { t ? localStorage.setItem(KEY, t) : localStorage.removeItem(KEY); } catch { /* sin almacenamiento */ }
  },
};

export class ApiError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

let onUnauthorized: () => void = () => {};
export const setOnUnauthorized = (fn: () => void) => { onUnauthorized = fn; };

async function request(path: string, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers);
  const t = token.get();
  if (t) headers.set("Authorization", `Bearer ${t}`);
  if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, { ...init, headers });
  } catch {
    throw new ApiError(0, "No hay conexión con el servidor. Revisa la red de la mina.");
  }
  if (!res.ok) {
    let msg = `El servidor respondió ${res.status}.`;
    try { msg = (await res.json()).error ?? msg; } catch { /* respuesta sin JSON */ }
    if (res.status === 401 && !path.startsWith("/api/auth/login")) onUnauthorized();
    throw new ApiError(res.status, msg);
  }
  return res;
}

export const api = {
  get: async <T,>(path: string) => (await request(path)).json() as Promise<T>,
  post: async <T,>(path: string, body?: unknown) =>
    (await request(path, { method: "POST", body: JSON.stringify(body ?? {}) })).json() as Promise<T>,
  put: async <T,>(path: string, body?: unknown) =>
    (await request(path, { method: "PUT", body: JSON.stringify(body ?? {}) })).json() as Promise<T>,
  del: async <T,>(path: string) => (await request(path, { method: "DELETE" })).json() as Promise<T>,
  async descargar(path: string, nombre: string) {
    const res = await request(path);
    const cd = res.headers.get("Content-Disposition") ?? "";
    const m = cd.match(/filename="?([^";]+)"?/);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = m?.[1] ?? nombre;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  },
};
