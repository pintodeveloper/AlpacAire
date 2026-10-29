import { useEffect, useState } from "react";
import { IconAlarm, IconCheck, IconWarning } from "../components/Icons";
import { Portal } from "../components/Portal";
import { api } from "../lib/api";
import { fechaHora, hace, hora } from "../lib/format";
import { Link } from "../lib/router";
import { useSesion } from "../lib/session";
import type { Accion, Observacion } from "../lib/types";

const NIVEL_TXT: Record<string, string> = { normal: "Normal", alerta: "Alerta", peligro: "Peligro", sin_datos: "Sin datos" };

function agrupar(acciones: Accion[]) {
  const m = new Map<string, Accion[]>();
  acciones.forEach((a) => m.set(a.frente ?? "", [...(m.get(a.frente ?? "") ?? []), a]));
  return [...m.entries()];
}

function Observaciones() {
  const { puede } = useSesion();
  const [lista, setLista] = useState<Observacion[]>([]);
  const [texto, setTexto] = useState("");
  const [error, setError] = useState<string | null>(null);
  const cargar = () => api.get<Observacion[]>("/api/observaciones").then(setLista).catch((e) => setError(e.message));
  useEffect(() => { cargar(); const id = setInterval(cargar, 30_000); return () => clearInterval(id); }, []);

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    try { await api.post("/api/observaciones", { texto }); setTexto(""); cargar(); }
    catch (err) { setError((err as Error).message); }
  };
  const leida = async (id: number) => { await api.post(`/api/observaciones/${id}/leida`); cargar(); };

  return (
    <section className="panel">
      <h3 className="panel__titulo">Observaciones para el ingeniero</h3>
      {puede("escribir_observaciones") && (
        <form className="observacion-form" onSubmit={enviar}>
          <label htmlFor="obs" className="sr-only">Nueva observación</label>
          <textarea id="obs" rows={2} value={texto} onChange={(e) => setTexto(e.target.value)}
            placeholder="Ej.: Revisar el sostenimiento del Tambor Sur antes del turno de la noche." />
          <button className="btn btn--primario" disabled={!texto.trim()}>Enviar observación</button>
        </form>
      )}
      {error && <p className="error">{error}</p>}
      {lista.length === 0 ? <p className="tenue">No hay observaciones registradas.</p> : (
        <ul className="observaciones">
          {lista.map((o) => (
            <li key={o.id} className={o.leida ? "leida" : ""}>
              <p>{o.texto}</p>
              <span>{o.autor} ({o.autor_rol}), {fechaHora(o.ts)}</span>
              {puede("usuarios") && !o.leida && <button className="btn-texto" onClick={() => leida(o.id)}>Marcar como leída</button>}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function ModoDemo() {
  const [esc, setEsc] = useState<string>("normal");
  const { refrescarEstado } = useSesion();
  useEffect(() => { api.get<{ escenario: string }>("/api/simulacion/estado").then((r) => setEsc(r.escenario)).catch(() => {}); }, []);
  const cambiar = async (e: string) => { setEsc(e); await api.put("/api/simulacion", { escenario: e }); setTimeout(refrescarEstado, 5500); };
  return (
    <section className="demo">
      <div>
        <strong>Simulador de sensores</strong>
        <p>Cambia el escenario para la demostración. Los valores se mueven gradualmente en unos 20 a 40 segundos.</p>
      </div>
      <div className="segmentado" role="radiogroup" aria-label="Escenario del simulador">
        {[["normal", "Normal"], ["alerta", "Alerta"], ["peligro", "Peligro"]].map(([k, t]) => (
          <button key={k} role="radio" aria-checked={esc === k} className={esc === k ? "activo" : ""} onClick={() => cambiar(k)}>{t}</button>
        ))}
      </div>
    </section>
  );
}

export default function Situacion() {
  const { estado, errorEstado, puede } = useSesion();
  if (!estado) return <p className="tenue">{errorEstado ?? "Consultando los sensores…"}</p>;

  const { nivel, frentes, acciones } = estado;
  const personas = frentes.reduce((n, f) => n + f.personas, 0);
  const peligro = acciones.filter((a) => a.nivel === "peligro");

  return (
    <div className="situacion">
      <section className={`estado estado--${nivel}`} aria-live="assertive">
        <Portal nivel={nivel}>
          {nivel === "normal" ? <IconCheck size={84} /> : nivel === "alerta" ? <IconWarning size={84} /> : <IconAlarm size={88} />}
        </Portal>
        <div className="estado__texto">
          {nivel === "normal" && (<>
            <h2>Todo en orden</h2>
            <p className="estado__sub">No hay acciones recomendadas.</p>
          </>)}
          {nivel === "alerta" && (<>
            <h2>¡Alerta!</h2>
            <p className="estado__sub">
              {new Set(acciones.map((a) => a.frente_id)).size === 1 ? "Un frente presenta" : "Hay frentes que presentan"} condiciones no óptimas.
              Sigue las acciones recomendadas.
            </p>
          </>)}
          {nivel === "peligro" && (<>
            <h2>¡Evacuación inmediata!</h2>
            <p className="estado__sub">Todos los mineros deben desalojar. {personas} personas registradas bajo tierra.</p>
          </>)}
          <p className="estado__meta">Actualizado a las {hora(estado.generado, true)}, cada 5 segundos</p>
        </div>
      </section>

      {nivel === "peligro" && peligro.length > 0 && (
        <section className="panel panel--peligro">
          <h3 className="panel__titulo">Causa de la evacuación</h3>
          <ul className="acciones">
            {peligro.map((a, i) => <li key={i}><b>{a.frente}:</b> {a.texto}</li>)}
          </ul>
        </section>
      )}

      {nivel !== "normal" && (
        <section className="panel">
          <h3 className="panel__titulo">Acciones recomendadas</h3>
          <div className="acciones-frentes">
            {agrupar(acciones.filter((a) => nivel !== "peligro" || a.nivel !== "peligro")).map(([frente, lista]) => (
              <div key={frente} className="acciones-frente">
                <h4>{frente}</h4>
                <ol className="acciones">
                  {lista.map((a, i) => <li key={i} className={`accion accion--${a.nivel}`}>{a.texto}</li>)}
                </ol>
              </div>
            ))}
          </div>
          {nivel === "peligro" && peligro.length === acciones.length && <p className="tenue">Sin acciones adicionales: priorizar la evacuación.</p>}
        </section>
      )}

      <section className="panel">
        <div className="panel__fila">
          <h3 className="panel__titulo">Frentes</h3>
          {puede("frentes") && <Link to="/frentes" className="btn-texto">Ver valores de cada frente</Link>}
        </div>
        <ul className="tira-frentes">
          {frentes.map((f) => (
            <li key={f.id} className={`tira-frente tira-frente--${f.nivel}`}>
              <span className="tira-frente__nivel">{NIVEL_TXT[f.nivel]}</span>
              <strong>{f.nombre}</strong>
              <span>{f.personas} personas, {f.profundidad_m} m</span>
              <span className="tenue">Última lectura {hace(f.edad_s)}</span>
            </li>
          ))}
        </ul>
      </section>

      {puede("observaciones") && <Observaciones />}
      {puede("usuarios") && <ModoDemo />}
    </div>
  );
}
