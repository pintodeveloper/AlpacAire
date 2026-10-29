import { useEffect, useState, type ReactNode } from "react";
import { audioListo, desbloquearAudio, reactivar, silenciadaRestante, silenciar, suscribir } from "../lib/alarm";
import { fechaHora, iniciales } from "../lib/format";
import { Link, useRouter } from "../lib/router";
import { useSesion } from "../lib/session";
import { Chevron } from "./Icons";
import { HexFondo } from "./HexFondo";
import { LogoMark } from "./Logo";

const MENU = [
  { grupo: "Principal", items: [
    { to: "/situacion", label: "Situación actual", permiso: "situacion" },
    { to: "/frentes", label: "Frentes", permiso: "frentes" },
    { to: "/detalles", label: "Detalles", permiso: "detalles" },
  ] },
  { grupo: "Roles", items: [
    { to: "/operarios", label: "Operarios", permiso: "operarios" },
    { to: "/obreros", label: "Obreros", permiso: "obreros" },
  ] },
  { grupo: "Exportar", items: [{ to: "/exportar", label: "Exportar PDF", permiso: "exportar" }] },
];

// Secciones sin subsecciones (por ahora): el título mismo es el enlace.
const SECCIONES = [
  { to: "/normatividad", label: "Normatividad y políticas" },
  { to: "/formatos", label: "Formatos" },
];

const ESTADO_TXT = { normal: "Todo en orden", alerta: "Alerta", peligro: "Evacuación" } as const;

function Reloj() {
  const [ahora, setAhora] = useState(new Date());
  useEffect(() => {
    const id = window.setInterval(() => setAhora(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);
  return <time dateTime={ahora.toISOString()}>{fechaHora(ahora)}</time>;
}

function AvisoSonido() {
  const { estado } = useSesion();
  const [, forzar] = useState(0);
  useEffect(() => {
    const repintar = () => forzar((n) => n + 1);
    const quitar = suscribir(repintar);
    const id = window.setInterval(repintar, 1000);
    return () => { quitar(); window.clearInterval(id); };
  }, []);
  if (estado?.nivel !== "peligro") return null;
  const resta = silenciadaRestante();
  return (
    <div className="aviso-sonido" role="status">
      {resta > 0 ? (
        <>
          <span>Sirena silenciada, vuelve a sonar en {Math.ceil(resta / 1000)} s</span>
          <button className="btn btn--claro" onClick={reactivar}>Reactivar ahora</button>
        </>
      ) : !audioListo() ? (
        <button className="btn btn--peligro" onClick={desbloquearAudio}>Activar sonido de alarma</button>
      ) : (
        <button className="btn btn--claro" onClick={() => silenciar(60_000)}>Silenciar 1 min</button>
      )}
    </div>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  const { usuario, logout, puede, estado, umbrales } = useSesion();
  const { path } = useRouter();
  const [abiertos, setAbiertos] = useState<Record<string, boolean>>({ Principal: true, Roles: true, Exportar: true });
  const [menuMovil, setMenuMovil] = useState(false);
  useEffect(() => setMenuMovil(false), [path]);
  if (!usuario) return null;
  const nivel = estado?.nivel;

  return (
    <div className={`app app--${nivel ?? "cargando"}`}>
      <HexFondo />
      <aside className={`menu ${menuMovil ? "menu--abierto" : ""}`} aria-label="Menú principal">
        <div className="menu__usuario">
          <span className="avatar" aria-hidden="true">{iniciales(usuario.nombre)}</span>
          <div>
            <strong>{usuario.nombre.split(" ")[0]}</strong>
            <span>{usuario.rol_nombre}</span>
          </div>
        </div>

        <nav className="menu__nav">
          {MENU.map(({ grupo, items }) => {
            const visibles = items.filter((i) => puede(i.permiso));
            if (!visibles.length) return null;
            const abierto = abiertos[grupo];
            return (
              <div key={grupo} className="menu__grupo">
                <button className="menu__titulo" aria-expanded={abierto}
                  onClick={() => setAbiertos((a) => ({ ...a, [grupo]: !a[grupo] }))}>
                  {grupo} <Chevron abierto={abierto} />
                </button>
                {abierto && (
                  <ul>
                    {visibles.map((i) => (
                      <li key={i.to}>
                        <Link to={i.to} className="menu__link">
                          {i.label}
                          {i.to === "/situacion" && nivel && <span className={`punto punto--${nivel}`} aria-label={ESTADO_TXT[nivel]} />}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
          {SECCIONES.map((sec) => (
            <div key={sec.to} className="menu__grupo">
              <Link to={sec.to} className="menu__titulo menu__seccion">{sec.label}</Link>
            </div>
          ))}
        </nav>

        <div className="menu__pie">
          <Link to="/ayuda" className="menu__link menu__ayuda">(?) Ayuda</Link>
          <button className="menu__link menu__salir" onClick={logout}>Cerrar sesión</button>
          <div className="menu__marca">
            <LogoMark size={44} color="var(--pizarra)" />
            <div>
              <strong>AlpacAire</strong>
              <span>IMS Alpaca ©2026</span>
            </div>
          </div>
        </div>
      </aside>
      {menuMovil && <div className="velo" onClick={() => setMenuMovil(false)} />}

      <header className="cabecera">
        <button className="hamburguesa" aria-label="Abrir menú" onClick={() => setMenuMovil(true)}>
          <span /><span /><span />
        </button>
        <div className="cabecera__saludo">
          <h1>Bienvenido, {usuario.nombre.split(" ")[0]}.</h1>
          <p>{umbrales?.mina ?? 'Mina "La coqueta"'}</p>
        </div>
        {nivel && (
          <Link to="/situacion" className={`estado-pill estado-pill--${nivel}`}>
            <span className={`punto punto--${nivel}`} /> {ESTADO_TXT[nivel]}
          </Link>
        )}
        <div className="cabecera__hora">
          <span>Fecha y hora</span>
          <Reloj />
        </div>
      </header>

      <main className="contenido" id="contenido">
        <AvisoSonido />
        {children}
      </main>
    </div>
  );
}
