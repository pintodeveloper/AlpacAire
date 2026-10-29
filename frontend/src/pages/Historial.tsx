import { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";
import { fechaHora, hora, num } from "../lib/format";
import type { Frente } from "../lib/types";

interface Episodio {
  frente_id: number;
  frente: string;
  inicio: string;
  fin: string;
  duracion_s: number;
  en_curso: boolean;
  nivel: "alerta" | "peligro";
  lecturas: number;
  variables: { clave: string; nombre: string; unidad: string; nivel: string; peor: number; riesgo: string }[];
}

const RANGOS = [["24h", "24 horas"], ["7d", "7 días"], ["30d", "30 días"]] as const;

function duracion(s: number) {
  if (s < 60) return "menos de 1 min";
  const h = Math.floor(s / 3600), m = Math.round((s % 3600) / 60);
  return h ? (m ? `${h} h ${m} min` : `${h} h`) : `${m} min`;
}

export default function Historial() {
  const [rango, setRango] = useState("7d");
  const [frente, setFrente] = useState("");
  const [nivel, setNivel] = useState<"todos" | "alerta" | "peligro">("todos");
  const [frentes, setFrentes] = useState<Frente[]>([]);
  const [eps, setEps] = useState<Episodio[] | null>(null);
  const [truncado, setTruncado] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { api.get<Frente[]>("/api/frentes").then(setFrentes).catch(() => {}); }, []);
  useEffect(() => {
    const cargar = () => {
      const q = new URLSearchParams({ rango });
      if (frente) q.set("frente_id", frente);
      api.get<{ episodios: Episodio[]; truncado: boolean }>(`/api/historial?${q}`)
        .then((r) => { setEps(r.episodios); setTruncado(r.truncado); setError(null); })
        .catch((e) => setError(e.message));
    };
    setEps(null);
    cargar();
    const id = setInterval(cargar, 30_000);
    return () => clearInterval(id);
  }, [rango, frente]);

  const lista = useMemo(() => (eps ?? []).filter((e) => nivel === "todos" || e.nivel === nivel), [eps, nivel]);
  const nPeligro = (eps ?? []).filter((e) => e.nivel === "peligro").length;
  const tiempo = (eps ?? []).reduce((n, e) => n + e.duracion_s, 0);

  return (
    <div className="pagina">
      <div className="pagina__cabeza">
        <h2>Historial</h2>
        <p className="tenue">Cada evento agrupa las lecturas seguidas de un frente que estuvieron fuera del rango permitido. Sirve como evidencia del control diario de gases (Decreto 1886, arts. 249 y 250).</p>
      </div>

      <div className="filtros">
        <div className="campo">
          <span>Periodo</span>
          <div className="segmentado" role="radiogroup" aria-label="Periodo">
            {RANGOS.map(([k, t]) => (
              <button key={k} role="radio" aria-checked={rango === k} className={rango === k ? "activo" : ""} onClick={() => setRango(k)}>{t}</button>
            ))}
          </div>
        </div>
        <label className="campo">
          <span>Frente</span>
          <select value={frente} onChange={(e) => setFrente(e.target.value)}>
            <option value="">Todos los frentes</option>
            {frentes.map((f) => <option key={f.id} value={f.id}>{f.nombre}</option>)}
          </select>
        </label>
        <div className="campo">
          <span>Nivel</span>
          <div className="segmentado" role="radiogroup" aria-label="Nivel">
            {([["todos", "Todos"], ["alerta", "Alerta"], ["peligro", "Peligro"]] as const).map(([k, t]) => (
              <button key={k} role="radio" aria-checked={nivel === k} className={nivel === k ? "activo" : ""} onClick={() => setNivel(k)}>{t}</button>
            ))}
          </div>
        </div>
      </div>

      {eps && (
        <ul className="historial-resumen">
          <li><strong>{eps.length}</strong> evento{eps.length === 1 ? "" : "s"}</li>
          <li className={nPeligro ? "historial-resumen--peligro" : ""}><strong>{nPeligro}</strong> con evacuación</li>
          <li><strong>{duracion(tiempo)}</strong> fuera de rango en total</li>
        </ul>
      )}

      {error && <p className="error">{error}</p>}
      {!eps ? <p className="tenue">Buscando eventos…</p> : lista.length === 0 ? (
        <section className="panel vacio"><p>No hubo eventos {nivel !== "todos" ? `de ${nivel} ` : ""}en este periodo. Todas las lecturas estuvieron dentro del rango permitido.</p></section>
      ) : (
        <ol className="eventos">
          {lista.map((e) => (
            <li key={`${e.frente_id}-${e.inicio}`} className={`evento evento--${e.nivel}`}>
              <div className="evento__cuando">
                <strong>{fechaHora(e.inicio)}</strong>
                <span className={e.en_curso ? "evento__vivo" : ""}>{e.en_curso ? "En curso" : `hasta las ${hora(e.fin)}`}, {duracion(e.duracion_s)}</span>
              </div>
              <div className="evento__que">
                <div className="evento__titulo">
                  <span className={`chip chip--${e.nivel}`}>{e.nivel === "peligro" ? "Peligro" : "Alerta"}</span>
                  <strong>{e.frente}</strong>
                </div>
                <ul className="evento__vars">
                  {e.variables.map((v) => (
                    <li key={v.clave} className={`evento__var evento__var--${v.nivel}`}>
                      {v.nombre}: {v.clave === "o2" ? "valor crítico" : "máx."} {num(v.peor, v.clave)} {v.unidad}
                      <span className="tenue"> ({v.riesgo})</span>
                    </li>
                  ))}
                </ul>
              </div>
              <span className="evento__lecturas tenue">{e.lecturas} lectura{e.lecturas === 1 ? "" : "s"}</span>
            </li>
          ))}
        </ol>
      )}
      {truncado && <p className="tenue nota">Se muestran los eventos de las primeras 60.000 lecturas fuera de rango. Acorta el periodo o elige un frente para ver el resto.</p>}
    </div>
  );
}
