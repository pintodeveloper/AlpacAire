import { useCallback, useEffect, useMemo, useState } from "react";
import { LineChart, type Serie, type Umbral } from "../components/LineChart";
import { api } from "../lib/api";
import { useSesion } from "../lib/session";
import { VARS_PRINCIPALES, type Frente } from "../lib/types";

const COLORES = ["#2B4650", "#2F7FC1", "#8A5CB8", "#12908E", "#B5651D", "#5B6B70"];
const RANGOS = [["1h", "1 hora"], ["6h", "6 horas"], ["24h", "24 horas"], ["7d", "7 días"], ["30d", "30 días"]] as const;

interface Respuesta { desde: string; hasta: string; series: Record<string, ({ ts: string } & Record<string, number | null>)[]> }

export default function Detalles() {
  const { umbrales } = useSesion();
  const [frentes, setFrentes] = useState<Frente[]>([]);
  const [frente, setFrente] = useState<string>("todos");
  const [rango, setRango] = useState<string>("1h");
  const [vars, setVars] = useState<string[]>([...VARS_PRINCIPALES]);
  const [datos, setDatos] = useState<Respuesta | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { api.get<Frente[]>("/api/frentes").then(setFrentes).catch((e) => setError(e.message)); }, []);

  const cargar = useCallback(() => {
    const q = new URLSearchParams({ rango, vars: VARS_PRINCIPALES.join(",") });
    if (frente !== "todos") q.set("frente_id", frente);
    api.get<Respuesta>(`/api/lecturas?${q}`).then((d) => { setDatos(d); setError(null); }).catch((e) => setError(e.message));
  }, [frente, rango]);

  useEffect(() => {
    cargar();
    if (rango === "1h" || rango === "6h") {
      const id = setInterval(cargar, 5000);
      return () => clearInterval(id);
    }
  }, [cargar, rango]);

  const color = useMemo(() => Object.fromEntries(frentes.map((f, i) => [String(f.id), COLORES[i % COLORES.length]])), [frentes]);
  const nombre = useMemo(() => Object.fromEntries(frentes.map((f) => [String(f.id), f.nombre])), [frentes]);
  const visibles = frente === "todos" ? frentes : frentes.filter((f) => String(f.id) === frente);

  const toggle = (k: string) =>
    setVars((v) => (v.includes(k) ? (v.length > 1 ? v.filter((x) => x !== k) : v) : VARS_PRINCIPALES.filter((x) => [...v, k].includes(x))));

  return (
    <div className="pagina">
      <div className="pagina__cabeza">
        <h2>Detalles</h2>
        <p className="tenue">Evolución en el tiempo de cada variable. Las líneas punteadas marcan los límites de alerta y peligro.</p>
      </div>

      <div className="filtros">
        <label className="campo">
          <span>Frente</span>
          <select value={frente} onChange={(e) => setFrente(e.target.value)}>
            <option value="todos">Todos los frentes</option>
            {frentes.map((f) => <option key={f.id} value={f.id}>{f.nombre}</option>)}
          </select>
        </label>
        <div className="campo">
          <span>Periodo</span>
          <div className="segmentado" role="radiogroup" aria-label="Periodo">
            {RANGOS.map(([k, t]) => (
              <button key={k} role="radio" aria-checked={rango === k} className={rango === k ? "activo" : ""} onClick={() => setRango(k)}>{t}</button>
            ))}
          </div>
        </div>
      </div>

      {umbrales && (
        <div className="chips-vars" role="group" aria-label="Variables a graficar">
          {VARS_PRINCIPALES.map((k) => (
            <button key={k} aria-pressed={vars.includes(k)} className={`chip-var ${vars.includes(k) ? "activo" : ""}`} onClick={() => toggle(k)}>
              {umbrales.variables[k].corto}
            </button>
          ))}
        </div>
      )}

      {visibles.length > 1 && (
        <ul className="leyenda">
          {visibles.map((f) => <li key={f.id}><i style={{ background: color[String(f.id)] }} />{f.nombre}</li>)}
        </ul>
      )}

      {error && <p className="error">{error}</p>}
      {!datos || !umbrales ? <p className="tenue">Cargando lecturas…</p> : (
        <div className="graficas">
          {vars.map((k) => {
            const cfg = umbrales.variables[k];
            const series: Serie[] = Object.entries(datos.series).map(([fid, pts]) => ({
              nombre: nombre[fid] ?? `Frente ${fid}`,
              color: color[fid] ?? COLORES[0],
              puntos: pts.map((p) => ({ t: Date.parse(p.ts), v: p[k] as number | null })),
            }));
            const u: Umbral[] = [];
            if (cfg.alerta_max != null) u.push({ valor: cfg.alerta_max, tipo: "alerta" });
            if (cfg.peligro_max != null) u.push({ valor: cfg.peligro_max, tipo: "peligro" });
            if (cfg.alerta_min != null) u.push({ valor: cfg.alerta_min, tipo: "alerta" });
            if (cfg.peligro_min != null) u.push({ valor: cfg.peligro_min, tipo: "peligro" });
            return (
              <section key={k} className="panel grafica-panel">
                <h3 className="grafica-panel__titulo">{cfg.nombre} <span>({cfg.unidad})</span></h3>
                {series.length === 0 ? <p className="tenue">Sin lecturas en este periodo.</p> : (
                  <LineChart series={series} umbrales={u} unidad={cfg.unidad} clave={k}
                    desde={Date.parse(datos.desde)} hasta={Date.parse(datos.hasta)} />
                )}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
