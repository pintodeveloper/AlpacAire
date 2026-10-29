import { useEffect, useMemo, useRef, useState } from "react";
import { api } from "../lib/api";
import { useSesion } from "../lib/session";
import type { Frente, Persona } from "../lib/types";

type Tipo = "operario" | "obrero";
const VACIO = { nombre: "", documento: "", cargo: "", maquina: "", turno: "Día", frente_id: "" };

export default function Personal({ tipo }: { tipo: Tipo }) {
  const { puede, estado } = useSesion();
  const [lista, setLista] = useState<Persona[]>([]);
  const [frentes, setFrentes] = useState<Frente[]>([]);
  const [busca, setBusca] = useState("");
  const [filtroFrente, setFiltroFrente] = useState<string>("todos");
  const [form, setForm] = useState<typeof VACIO & { id?: number }>(VACIO);
  const [error, setError] = useState<string | null>(null);
  const dlg = useRef<HTMLDialogElement>(null);
  const editar = puede("editar_personal");
  const esOperario = tipo === "operario";

  const cargar = () => api.get<Persona[]>(`/api/personal?tipo=${tipo}`).then(setLista).catch((e) => setError(e.message));
  useEffect(() => { cargar(); setFiltroFrente("todos"); setBusca(""); }, [tipo]); // eslint-disable-line
  useEffect(() => { api.get<Frente[]>("/api/frentes").then(setFrentes).catch(() => {}); }, []);

  const nivelFrente = useMemo(() => Object.fromEntries((estado?.frentes ?? []).map((f) => [f.id, f.nivel])), [estado]);

  const filtrada = lista.filter((p) =>
    (filtroFrente === "todos" || String(p.frente_id ?? "sin") === filtroFrente) &&
    `${p.nombre} ${p.documento ?? ""} ${p.maquina ?? ""} ${p.cargo ?? ""}`.toLowerCase().includes(busca.toLowerCase()));

  const conteo = (id: string) => lista.filter((p) => String(p.frente_id ?? "sin") === id).length;

  const abrir = (p?: Persona) => {
    setError(null);
    setForm(p ? { id: p.id, nombre: p.nombre, documento: p.documento ?? "", cargo: p.cargo ?? "", maquina: p.maquina ?? "",
      turno: p.turno ?? "Día", frente_id: p.frente_id ? String(p.frente_id) : "" } : { ...VACIO, cargo: esOperario ? "Operario" : "" });
    dlg.current?.showModal();
  };

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = { ...form, tipo, frente_id: form.frente_id ? Number(form.frente_id) : null };
    try {
      if (form.id) await api.put(`/api/personal/${form.id}`, body);
      else await api.post("/api/personal", body);
      dlg.current?.close();
      cargar();
    } catch (err) { setError((err as Error).message); }
  };

  const borrar = async (p: Persona) => {
    if (!window.confirm(`¿Eliminar a ${p.nombre} de la lista?`)) return;
    await api.del(`/api/personal/${p.id}`);
    cargar();
  };

  const titulo = esOperario ? "Operarios" : "Obreros";
  return (
    <div className="pagina">
      <div className="pagina__cabeza pagina__cabeza--fila">
        <div>
          <h2>{titulo}</h2>
          <p className="tenue">{esOperario ? "Operarios de máquinas y el equipo que tienen asignado." : "Obreros y el frente en el que se encuentran."}</p>
        </div>
        {editar && <button className="btn btn--primario" onClick={() => abrir()}>Agregar {tipo}</button>}
      </div>

      {!esOperario && (
        <div className="chips-vars" role="group" aria-label="Filtrar por frente">
          <button className={`chip-var ${filtroFrente === "todos" ? "activo" : ""}`} onClick={() => setFiltroFrente("todos")}>Todos ({lista.length})</button>
          {frentes.map((f) => (
            <button key={f.id} className={`chip-var ${filtroFrente === String(f.id) ? "activo" : ""}`} onClick={() => setFiltroFrente(String(f.id))}>
              {nivelFrente[f.id] && nivelFrente[f.id] !== "normal" && <span className={`punto punto--${nivelFrente[f.id]}`} />}
              {f.nombre} ({conteo(String(f.id))})
            </button>
          ))}
          {conteo("sin") > 0 && <button className={`chip-var ${filtroFrente === "sin" ? "activo" : ""}`} onClick={() => setFiltroFrente("sin")}>En superficie ({conteo("sin")})</button>}
        </div>
      )}

      <label className="campo campo--busca">
        <span className="sr-only">Buscar</span>
        <input type="search" placeholder={esOperario ? "Buscar por nombre, documento o máquina" : "Buscar por nombre, documento o cargo"}
          value={busca} onChange={(e) => setBusca(e.target.value)} />
      </label>

      {error && !dlg.current?.open && <p className="error">{error}</p>}
      <div className="tabla-envoltura">
        <table className="tabla">
          <thead>
            <tr>
              <th>Nombre</th><th>Documento</th>
              {esOperario ? <th>Máquina</th> : <th>Cargo</th>}
              <th>Frente</th><th>Turno</th>
              {editar && <th><span className="sr-only">Acciones</span></th>}
            </tr>
          </thead>
          <tbody>
            {filtrada.map((p) => (
              <tr key={p.id}>
                <td><strong>{p.nombre}</strong></td>
                <td className="num">{p.documento ?? "—"}</td>
                <td>{esOperario ? p.maquina ?? "—" : p.cargo ?? "—"}</td>
                <td>
                  {p.frente_id && nivelFrente[p.frente_id] && nivelFrente[p.frente_id] !== "normal" && <span className={`punto punto--${nivelFrente[p.frente_id]}`} />}
                  {p.frente ?? "Superficie"}
                </td>
                <td>{p.turno ?? "—"}</td>
                {editar && (
                  <td className="tabla__acciones">
                    <button className="btn-texto" onClick={() => abrir(p)}>Editar</button>
                    <button className="btn-texto btn-texto--peligro" onClick={() => borrar(p)}>Eliminar</button>
                  </td>
                )}
              </tr>
            ))}
            {filtrada.length === 0 && (
              <tr><td colSpan={6} className="tenue">Nadie coincide con la búsqueda.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <dialog ref={dlg} className="dialogo">
        <form onSubmit={guardar}>
          <h3>{form.id ? `Editar ${tipo}` : `Agregar ${tipo}`}</h3>
          <label className="campo"><span>Nombre completo</span>
            <input required value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} /></label>
          <label className="campo"><span>Documento</span>
            <input inputMode="numeric" value={form.documento} onChange={(e) => setForm({ ...form, documento: e.target.value })} /></label>
          {esOperario ? (
            <label className="campo"><span>Máquina asignada</span>
              <input value={form.maquina} onChange={(e) => setForm({ ...form, maquina: e.target.value })} /></label>
          ) : (
            <label className="campo"><span>Cargo</span>
              <input value={form.cargo} onChange={(e) => setForm({ ...form, cargo: e.target.value })} placeholder="Picador, cochero, entibador…" /></label>
          )}
          <div className="campo-fila">
            <label className="campo"><span>Frente</span>
              <select value={form.frente_id} onChange={(e) => setForm({ ...form, frente_id: e.target.value })}>
                <option value="">Superficie</option>
                {frentes.map((f) => <option key={f.id} value={f.id}>{f.nombre}</option>)}
              </select></label>
            <label className="campo"><span>Turno</span>
              <select value={form.turno} onChange={(e) => setForm({ ...form, turno: e.target.value })}>
                <option>Día</option><option>Noche</option>
              </select></label>
          </div>
          {error && <p className="error">{error}</p>}
          <div className="dialogo__acciones">
            <button type="button" className="btn btn--claro" onClick={() => dlg.current?.close()}>Cancelar</button>
            <button className="btn btn--primario">{form.id ? "Guardar cambios" : `Agregar ${tipo}`}</button>
          </div>
        </form>
      </dialog>
    </div>
  );
}
