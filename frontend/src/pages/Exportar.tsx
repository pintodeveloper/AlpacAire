import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { hoyISO } from "../lib/format";
import type { Frente } from "../lib/types";

const RANGOS = [["dia", "Día"], ["semana", "Semana"], ["mes", "Mes"], ["personalizado", "Otro rango"]] as const;

export default function Exportar() {
  const [rango, setRango] = useState<string>("dia");
  const [fecha, setFecha] = useState(hoyISO());
  const [desde, setDesde] = useState(hoyISO());
  const [frente, setFrente] = useState("");
  const [frentes, setFrentes] = useState<Frente[]>([]);
  const [ocupado, setOcupado] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { api.get<Frente[]>("/api/frentes").then(setFrentes).catch(() => {}); }, []);

  const params = () => {
    const q = new URLSearchParams({ rango });
    if (rango === "personalizado") { q.set("desde", desde); q.set("hasta", fecha); } else q.set("fecha", fecha);
    if (frente) q.set("frente_id", frente);
    return q.toString();
  };

  const descargar = async (formato: "pdf" | "csv") => {
    setError(null); setOcupado(formato);
    try { await api.descargar(`/api/reportes/${formato}?${params()}`, `alpacaire.${formato}`); }
    catch (e) { setError((e as Error).message); }
    finally { setOcupado(null); }
  };

  const desc = {
    dia: "las 24 horas del día elegido",
    semana: "los 7 días que terminan en la fecha elegida",
    mes: "los 30 días que terminan en la fecha elegida",
    personalizado: "el rango de fechas elegido",
  }[rango];

  return (
    <div className="pagina pagina--estrecha">
      <div className="pagina__cabeza">
        <h2>Exportar PDF</h2>
        <p className="tenue">Genera el reporte de las capturas de los sensores para entregarlo a la autoridad minera o archivarlo.</p>
      </div>

      <section className="panel exportar">
        <div className="campo">
          <span>Periodo</span>
          <div className="segmentado" role="radiogroup" aria-label="Periodo">
            {RANGOS.map(([k, t]) => (
              <button key={k} role="radio" aria-checked={rango === k} className={rango === k ? "activo" : ""} onClick={() => setRango(k)}>{t}</button>
            ))}
          </div>
        </div>
        <div className="campo-fila">
          {rango === "personalizado" && (
            <label className="campo"><span>Desde</span>
              <input type="date" value={desde} max={fecha} onChange={(e) => setDesde(e.target.value)} /></label>
          )}
          <label className="campo"><span>{rango === "personalizado" ? "Hasta" : rango === "dia" ? "Día" : "Hasta el día"}</span>
            <input type="date" value={fecha} max={hoyISO()} onChange={(e) => setFecha(e.target.value)} /></label>
          <label className="campo"><span>Frente</span>
            <select value={frente} onChange={(e) => setFrente(e.target.value)}>
              <option value="">Todos los frentes</option>
              {frentes.map((f) => <option key={f.id} value={f.id}>{f.nombre}</option>)}
            </select></label>
        </div>
        <p className="exportar__resumen">
          El reporte incluye {desc}: mínimos, promedios y máximos por variable, cuántas capturas estuvieron en alerta o
          peligro, gráficas de temperatura efectiva, metano, CO y oxígeno, y la tabla de capturas.
        </p>
        {error && <p className="error">{error}</p>}
        <div className="exportar__acciones">
          <button className="btn btn--primario" disabled={!!ocupado} onClick={() => descargar("pdf")}>
            {ocupado === "pdf" ? "Generando PDF…" : "Descargar PDF"}
          </button>
          <button className="btn btn--claro" disabled={!!ocupado} onClick={() => descargar("csv")}>
            {ocupado === "csv" ? "Preparando CSV…" : "Descargar capturas en CSV"}
          </button>
        </div>
      </section>
    </div>
  );
}
