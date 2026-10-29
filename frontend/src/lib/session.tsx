import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { api, setOnUnauthorized, token } from "./api";
import { detenerSirena, iniciarSirena } from "./alarm";
import type { Estado, Umbrales, Usuario } from "./types";

interface Sesion {
  usuario: Usuario | null;
  cargando: boolean;
  login: (u: string, p: string) => Promise<void>;
  logout: () => void;
  puede: (permiso: string) => boolean;
  estado: Estado | null;
  errorEstado: string | null;
  umbrales: Umbrales | null;
  refrescarEstado: () => void;
}

const Ctx = createContext<Sesion>(null as unknown as Sesion);
export const useSesion = () => useContext(Ctx);

const INTERVALO_MS = 5000;

export function SesionProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);
  const [estado, setEstado] = useState<Estado | null>(null);
  const [errorEstado, setErrorEstado] = useState<string | null>(null);
  const [umbrales, setUmbrales] = useState<Umbrales | null>(null);
  const vivo = useRef(true);

  const logout = useCallback(() => {
    token.set(null);
    setUsuario(null);
    setEstado(null);
    detenerSirena();
  }, []);

  useEffect(() => {
    setOnUnauthorized(logout);
    if (!token.get()) { setCargando(false); return; }
    api.get<Usuario>("/api/auth/me").then(setUsuario).catch(() => token.set(null)).finally(() => setCargando(false));
  }, [logout]);

  const login = async (u: string, p: string) => {
    const r = await api.post<{ token: string; usuario: Usuario }>("/api/auth/login", { usuario: u, password: p });
    token.set(r.token);
    setUsuario(r.usuario);
  };

  const refrescarEstado = useCallback(() => {
    api.get<Estado>("/api/estado")
      .then((e) => { if (vivo.current) { setEstado(e); setErrorEstado(null); } })
      .catch((err) => vivo.current && setErrorEstado(err.message));
  }, []);

  // Sondeo cada 5 s mientras haya sesión: la alarma suena en cualquier página.
  useEffect(() => {
    if (!usuario) return;
    vivo.current = true;
    refrescarEstado();
    api.get<Umbrales>("/api/umbrales").then(setUmbrales).catch(() => {});
    const id = window.setInterval(refrescarEstado, INTERVALO_MS);
    return () => { vivo.current = false; window.clearInterval(id); };
  }, [usuario, refrescarEstado]);

  useEffect(() => {
    if (estado?.nivel === "peligro") iniciarSirena();
    else detenerSirena();
  }, [estado?.nivel, estado?.generado]);

  const puede = (p: string) => !!usuario?.permisos.includes(p);

  return (
    <Ctx.Provider value={{ usuario, cargando, login, logout, puede, estado, errorEstado, umbrales, refrescarEstado }}>
      {children}
    </Ctx.Provider>
  );
}
