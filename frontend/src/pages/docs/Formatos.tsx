import { useEffect, useState } from "react";
import { hoyISO } from "../../lib/format";
import { useSesion } from "../../lib/session";
import Seccion, { Nota } from "../Seccion";
import {
  CHEQUEO_SECCIONES, EPP, EPP_ESTADOS, EPP_ROLES, KPI, KPI_META, MANT_FRECUENCIAS, MANTENIMIENTO, SUPERVISOR_ETAPAS,
} from "./contenido";

// Borrador por formato en este navegador: si se recarga la página no se pierde lo escrito.
function useBorrador<T>(clave: string, inicial: T) {
  const [valor, setValor] = useState<T>(() => {
    try {
      const v = localStorage.getItem(`alpacaire.formato.${clave}`);
      return v ? { ...inicial, ...JSON.parse(v) } : inicial;
    } catch { return inicial; }
  });
  useEffect(() => {
    try { localStorage.setItem(`alpacaire.formato.${clave}`, JSON.stringify(valor)); } catch { /* sin almacenamiento */ }
  }, [clave, valor]);
  return [valor, setValor, () => setValor(inicial)] as const;
}

function Opciones({ valor, opciones, onChange, nombre }: { valor: string; opciones: string[]; onChange: (v: string) => void; nombre: string }) {
  return (
    <div className="segmentado segmentado--compacto" role="radiogroup" aria-label={nombre}>
      {opciones.map((o) => (
        <button key={o} type="button" role="radio" aria-checked={valor === o}
          className={valor === o ? `activo activo--${o === "Sí" ? "si" : o === "No" ? "no" : "otro"}` : ""}
          onClick={() => onChange(valor === o ? "" : o)}>{o}</button>
      ))}
    </div>
  );
}

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="campo"><span>{label}</span>{children}</label>;
}

function Acciones({ onLimpiar }: { onLimpiar: () => void }) {
  return (
    <>
      <button className="btn btn--claro" onClick={() => { if (window.confirm("¿Borrar todo lo diligenciado en este formato?")) onLimpiar(); }}>Limpiar formato</button>
      <button className="btn btn--primario" onClick={() => window.print()}>Imprimir o guardar PDF</button>
    </>
  );
}

function Firmas({ izquierda, derecha }: { izquierda: string; derecha: string }) {
  return (
    <div className="firmas">
      <div><span className="firmas__linea" />{izquierda}</div>
      <div><span className="firmas__linea" />{derecha}</div>
    </div>
  );
}

// ------------------------------------------------------------ Lista de chequeo entrada y salida
type Respuestas = Record<string, string>;
const CHEQUEO_INICIAL = {
  fecha: hoyISO(), turno: "Día", nombre: "", cedula: "", cargo: "", empresa: "", entrada: "", salida: "",
  resp: {} as Respuestas, obs: {} as Respuestas, novedades: "",
};

const ESTADO_TXT: Record<string, string> = { normal: "Todo en orden", alerta: "Alerta", peligro: "Evacuación inmediata" };

export function ListaChequeo() {
  const { estado } = useSesion();
  const [f, setF, limpiar] = useBorrador("chequeo", CHEQUEO_INICIAL);
  const set = (k: keyof typeof CHEQUEO_INICIAL) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setF({ ...f, [k]: e.target.value });

  // Ítems de ingreso (secciones 1 a 3) que impiden autorizar la entrada
  const bloqueantes = CHEQUEO_SECCIONES.slice(0, 3).flatMap((s, si) => s.items.map((_, ii) => `${si}.${ii}`)).filter((k) => f.resp[k] === "No");
  const total = CHEQUEO_SECCIONES.reduce((n, s) => n + s.items.length, 0);
  const respondidos = Object.values(f.resp).filter(Boolean).length;

  return (
    <Seccion titulo="Lista de chequeo: entrada y salida de la mina" meta="Protección de vida: datos y alarmas tempranas en tiempo real"
      acciones={<Acciones onLimpiar={limpiar} />}>
      <section className="panel formato__datos">
        <div className="formato__rejilla">
          <Campo label="Fecha"><input type="date" value={f.fecha} onChange={set("fecha")} /></Campo>
          <Campo label="Turno"><select value={f.turno} onChange={set("turno")}><option>Día</option><option>Noche</option></select></Campo>
          <Campo label="Nombre completo"><input value={f.nombre} onChange={set("nombre")} /></Campo>
          <Campo label="Cédula"><input inputMode="numeric" value={f.cedula} onChange={set("cedula")} /></Campo>
          <Campo label="Cargo / área"><input value={f.cargo} onChange={set("cargo")} /></Campo>
          <Campo label="Empresa"><input value={f.empresa} onChange={set("empresa")} /></Campo>
          <Campo label="Hora de entrada"><input type="time" value={f.entrada} onChange={set("entrada")} /></Campo>
          <Campo label="Hora de salida"><input type="time" value={f.salida} onChange={set("salida")} /></Campo>
        </div>
      </section>

      <div className={`formato__resumen ${bloqueantes.length ? "formato__resumen--no" : ""}`} role="status">
        {bloqueantes.length
          ? <><strong>No autorizar el ingreso.</strong> {bloqueantes.length} ítem{bloqueantes.length > 1 ? "s" : ""} de ingreso marcado{bloqueantes.length > 1 ? "s" : ""} en No.</>
          : <><strong>{respondidos} de {total}</strong> ítems verificados.</>}
      </div>

      {CHEQUEO_SECCIONES.map((s, si) => (
        <section key={s.titulo} className="panel formato__seccion">
          <div className="panel__fila">
            <h3 className="panel__titulo">{si + 1}. {s.titulo}</h3>
            {s.atmosfera && estado && (
              <span className={`estado-pill estado-pill--${estado.nivel}`}>
                <span className={`punto punto--${estado.nivel}`} /> AlpacAire ahora: {ESTADO_TXT[estado.nivel]}
              </span>
            )}
          </div>
          <ul className="items">
            {s.items.map((it, ii) => {
              const k = `${si}.${ii}`;
              return (
                <li key={k} className={`item ${f.resp[k] === "No" ? "item--no" : ""}`}>
                  <span className="item__texto">{it}</span>
                  <Opciones nombre={it} valor={f.resp[k] ?? ""} opciones={["Sí", "No", "N/A"]}
                    onChange={(v) => setF({ ...f, resp: { ...f.resp, [k]: v } })} />
                  <input className="item__obs" placeholder="Observaciones" aria-label={`Observaciones: ${it}`}
                    value={f.obs[k] ?? ""} onChange={(e) => setF({ ...f, obs: { ...f.obs, [k]: e.target.value } })} />
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      <section className="panel">
        <Campo label="Novedades y observaciones generales">
          <textarea rows={4} value={f.novedades} onChange={set("novedades")} />
        </Campo>
        <Firmas izquierda="Firma del trabajador" derecha="Firma del supervisor SST / jefe de turno" />
      </section>
    </Seccion>
  );
}

// ------------------------------------------------------------ Checklist del supervisor
const SUP_INICIAL = {
  trabajador: "", fecha: hoyISO(), cargo: "Minero de frente", instructor: "",
  resp: {} as Respuestas, notas: {} as Respuestas,
};

const resultado = (v?: string) => (v === "Sí" ? "OK" : v === "No" ? "Revisar" : "Pendiente");

export function ChecklistSupervisor() {
  const [f, setF, limpiar] = useBorrador("supervisor", SUP_INICIAL);
  const set = (k: keyof typeof SUP_INICIAL) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });
  const puntos = SUPERVISOR_ETAPAS.flatMap((e) => e.items.map((i) => i.punto));
  const nNo = puntos.filter((p) => f.resp[p] === "No").length;
  const nSinResponder = puntos.filter((p) => !f.resp[p]).length;
  // Igual que el Excel: un solo "No" exige repaso. Además se avisa si faltan puntos por revisar.
  const veredicto = nNo > 0 ? "repaso" : nSinResponder > 0 ? "pendiente" : "apto";

  return (
    <Seccion titulo="Lista de verificación en campo: capacitación de personal nuevo" ancho
      meta="Sistema AlpacAire, Minería La Gitana S.A.S. Guía práctica para supervisores SST y jefes de turno"
      acciones={<Acciones onLimpiar={limpiar} />}>
      <section className="panel formato__datos">
        <div className="formato__rejilla">
          <Campo label="Nombre del trabajador"><input value={f.trabajador} onChange={set("trabajador")} /></Campo>
          <Campo label="Fecha de capacitación"><input type="date" value={f.fecha} onChange={set("fecha")} /></Campo>
          <Campo label="Cargo / rol asignado">
            <select value={f.cargo} onChange={set("cargo")}>
              <option>Minero de frente</option><option>Supervisor SST / jefe de turno</option><option>Técnico de instalación y mantenimiento</option>
            </select>
          </Campo>
          <Campo label="Supervisor / instructor"><input value={f.instructor} onChange={set("instructor")} /></Campo>
        </div>
      </section>

      {SUPERVISOR_ETAPAS.map((e, ei) => (
        <section key={e.titulo} className="panel formato__seccion">
          <h3 className="panel__titulo">Etapa {ei + 1}: {e.titulo}</h3>
          <div className="tabla-envoltura">
            <table className="tabla tabla--formato">
              <thead><tr><th>Punto</th><th>Qué revisar y confirmar en el frente</th><th>Rol que aplica</th><th>¿Cumplió?</th><th>Resultado</th><th>Notas del supervisor</th></tr></thead>
              <tbody>
                {e.items.map((it) => {
                  const r = resultado(f.resp[it.punto]);
                  return (
                    <tr key={it.punto}>
                      <td className="num"><strong>{it.punto}</strong></td>
                      <td>{it.pregunta}</td>
                      <td className="tenue">{it.rol}</td>
                      <td><Opciones nombre={`Punto ${it.punto}`} valor={f.resp[it.punto] ?? ""} opciones={["Sí", "No", "Parcial", "N/A"]}
                        onChange={(v) => setF({ ...f, resp: { ...f.resp, [it.punto]: v } })} /></td>
                      <td><span className={`resultado resultado--${r.toLowerCase()}`}>{r}</span></td>
                      <td><input className="item__obs" aria-label={`Notas del punto ${it.punto}`} value={f.notas[it.punto] ?? ""}
                        onChange={(ev) => setF({ ...f, notas: { ...f.notas, [it.punto]: ev.target.value } })} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      ))}

      <section className={`veredicto veredicto--${veredicto}`} role="status">
        <span>Veredicto final de la capacitación</span>
        <strong>
          {veredicto === "repaso" ? "Necesita repaso en campo"
            : veredicto === "pendiente" ? `${nSinResponder > 1 ? "Faltan" : "Falta"} ${nSinResponder} punto${nSinResponder > 1 ? "s" : ""} por revisar`
            : "Trabajador capacitado y apto"}
        </strong>
        {veredicto === "repaso" && <p>{nNo} punto{nNo > 1 ? "s" : ""} en No. Repetir la práctica antes de autorizar el trabajo en el frente.</p>}
      </section>
      <section className="panel">
        <Firmas izquierda="Firma del trabajador" derecha="Firma del supervisor / instructor" />
      </section>
    </Seccion>
  );
}

// ------------------------------------------------------------ Seguimiento de KPI del dispositivo
const KPI_INICIAL = {
  fecha: hoyISO(), periodo: "", dispositivo: "", responsable: "", turno: "Día", firmware: "",
  valor: {} as Respuestas, cumple: {} as Respuestas, obs: {} as Respuestas,
};

export function SeguimientoKPI() {
  const [f, setF, limpiar] = useBorrador("kpi", KPI_INICIAL);
  const set = (k: keyof typeof KPI_INICIAL) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });

  // Mismas fórmulas del Excel: evaluados = Sí + No (N/A no cuenta); KPI = Sí / evaluados.
  const porCategoria = KPI.map((c, ci) => {
    const claves = c.indicadores.map((_, ii) => `${ci}.${ii}`);
    const si = claves.filter((k) => f.cumple[k] === "Sí").length;
    const ev = si + claves.filter((k) => f.cumple[k] === "No").length;
    return { categoria: c.categoria, evaluados: ev, cumplen: si, pct: ev ? si / ev : 0 };
  });
  const evaluados = porCategoria.reduce((n, c) => n + c.evaluados, 0);
  const cumplen = porCategoria.reduce((n, c) => n + c.cumplen, 0);
  const kpi = evaluados ? cumplen / evaluados : 0;
  const estadoDisp = evaluados === 0 ? "Sin evaluar" : kpi >= KPI_META ? "Apto" : "Con observaciones";
  const pct = (x: number) => `${Math.round(x * 100)} %`;

  return (
    <Seccion titulo="Seguimiento de KPI del dispositivo AlpacAire" ancho
      meta="Lista de chequeo de desempeño. Protección de vida: datos y alarmas tempranas en tiempo real"
      acciones={<Acciones onLimpiar={limpiar} />}>
      <section className="panel formato__datos">
        <div className="formato__rejilla">
          <Campo label="Fecha"><input type="date" value={f.fecha} onChange={set("fecha")} /></Campo>
          <Campo label="Periodo evaluado"><input value={f.periodo} onChange={set("periodo")} placeholder="Ej.: semana 44" /></Campo>
          <Campo label="Dispositivo / ubicación"><input value={f.dispositivo} onChange={set("dispositivo")} placeholder="Ej.: Frente Norte, FN-01" /></Campo>
          <Campo label="Responsable"><input value={f.responsable} onChange={set("responsable")} /></Campo>
          <Campo label="Turno"><select value={f.turno} onChange={set("turno")}><option>Día</option><option>Noche</option></select></Campo>
          <Campo label="Versión de firmware"><input value={f.firmware} onChange={set("firmware")} /></Campo>
        </div>
      </section>

      <section className={`kpi-resumen kpi-resumen--${estadoDisp === "Apto" ? "apto" : estadoDisp === "Sin evaluar" ? "vacio" : "obs"}`} role="status">
        <div className="kpi-resumen__principal">
          <span>KPI global de cumplimiento</span>
          <strong>{pct(kpi)}</strong>
          <p>{cumplen} de {evaluados} indicadores evaluados cumplen. Meta propuesta: {pct(KPI_META)}.</p>
        </div>
        <div className="kpi-resumen__estado">
          <span>Estado del dispositivo</span>
          <strong>{estadoDisp}</strong>
        </div>
        <ul className="kpi-categorias">
          {porCategoria.map((c, i) => (
            <li key={c.categoria}>
              <span>{i + 1}. {c.categoria}</span>
              <span className="kpi-barra"><span style={{ width: `${Math.round(c.pct * 100)}%` }} /></span>
              <span className="num">{c.evaluados ? `${c.cumplen}/${c.evaluados}` : "—"}</span>
            </li>
          ))}
        </ul>
      </section>

      <Nota>Llene el valor medido y elija Sí, No o N/A en Cumple. Los resultados se calculan solos; N/A no cuenta en el cálculo.</Nota>

      {KPI.map((c, ci) => (
        <section key={c.categoria} className="panel formato__seccion">
          <h3 className="panel__titulo">{ci + 1}. {c.categoria}</h3>
          <div className="tabla-envoltura">
            <table className="tabla tabla--formato">
              <thead><tr><th>Indicador</th><th>Meta propuesta</th><th>Valor medido</th><th>Cumple</th><th>Observaciones</th></tr></thead>
              <tbody>
                {ci === 0 && (
                  <tr className="fila-ejemplo">
                    <td>Ejemplo: disponibilidad del dispositivo (tiempo en línea)</td><td>≥ 99 % del turno</td><td>99,4 %</td><td>Sí</td><td>Valor de ejemplo, no cuenta</td>
                  </tr>
                )}
                {c.indicadores.map((ind, ii) => {
                  const k = `${ci}.${ii}`;
                  return (
                    <tr key={k}>
                      <td>{ind.nombre}</td>
                      <td className="tenue">{ind.meta}</td>
                      <td><input className="item__obs item__obs--corto" aria-label={`Valor medido: ${ind.nombre}`} value={f.valor[k] ?? ""}
                        onChange={(e) => setF({ ...f, valor: { ...f.valor, [k]: e.target.value } })} /></td>
                      <td><Opciones nombre={`Cumple: ${ind.nombre}`} valor={f.cumple[k] ?? ""} opciones={["Sí", "No", "N/A"]}
                        onChange={(v) => setF({ ...f, cumple: { ...f.cumple, [k]: v } })} /></td>
                      <td><input className="item__obs" aria-label={`Observaciones: ${ind.nombre}`} value={f.obs[k] ?? ""}
                        onChange={(e) => setF({ ...f, obs: { ...f.obs, [k]: e.target.value } })} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      ))}
      <Nota>Las metas por indicador son propuestas de partida: validarlas con pruebas del prototipo, el fabricante de cada sensor y el Decreto 1886 de 2015.</Nota>
    </Seccion>
  );
}

// ------------------------------------------------------------ Checklist de EPP
const EPP_INICIAL = { trabajador: "", fecha: hoyISO(), rol: "0", supervisor: "", estado: {} as Respuestas, obs: {} as Respuestas };
const USO_TXT: Record<string, string> = { obligatorio: "Obligatorio", tarea: "Según la tarea", no: "No aplica" };

export function ChecklistEPP() {
  const [f, setF, limpiar] = useBorrador("epp", EPP_INICIAL);
  const rol = Number(f.rol);
  const set = (k: keyof typeof EPP_INICIAL) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });
  // Elementos que aplican al rol elegido (obligatorios o según la tarea)
  const aplican = EPP.map((e, i) => ({ ...e, i })).filter((e) => e.uso[rol] !== "no");
  const nMalo = aplican.filter((e) => f.estado[e.i] === "Malo").length;
  const nIncompletoOblig = aplican.filter((e) => f.estado[e.i] === "Incompleto" && e.uso[rol] === "obligatorio").length;
  const nPend = aplican.filter((e) => !f.estado[e.i]).length;
  // Igual que el Excel: un "Malo" exige cambio de EPP. Además: un obligatorio incompleto o ítems sin revisar.
  const veredicto = nMalo ? "repaso" : nIncompletoOblig ? "incompleto" : nPend ? "pendiente" : "apto";

  return (
    <Seccion titulo="Checklist de uso del EPP en campo" ancho
      meta="Sistema AlpacAire, equipo IMS Alpac, Reto Minero 2026. Cumplimiento Decreto 1886 de 2015"
      acciones={<Acciones onLimpiar={limpiar} />}>
      <section className="panel formato__datos">
        <div className="formato__rejilla">
          <Campo label="Nombre del trabajador"><input value={f.trabajador} onChange={set("trabajador")} /></Campo>
          <Campo label="Fecha de inspección"><input type="date" value={f.fecha} onChange={set("fecha")} /></Campo>
          <Campo label="Cargo / área operativa">
            <select value={f.rol} onChange={set("rol")}>{EPP_ROLES.map((r, i) => <option key={r} value={i}>{r}</option>)}</select>
          </Campo>
          <Campo label="Supervisor SST / jefe de turno"><input value={f.supervisor} onChange={set("supervisor")} /></Campo>
        </div>
      </section>

      <section className="panel formato__seccion">
        <h3 className="panel__titulo">Inspección en campo para {EPP_ROLES[rol].toLowerCase()}</h3>
        <div className="tabla-envoltura">
          <table className="tabla tabla--formato">
            <thead><tr><th>Elemento de protección personal</th><th>Riesgo que cubre</th><th>Para este cargo</th><th>Inspección en campo</th><th>Observaciones / estado del EPP</th></tr></thead>
            <tbody>
              {EPP.map((e, i) => {
                const uso = e.uso[rol];
                return (
                  <tr key={e.epp} className={uso === "no" ? "fila-ejemplo" : f.estado[i] === "Malo" ? "fila--no" : ""}>
                    <td><strong>{e.epp}</strong></td>
                    <td className="tenue">{e.riesgo}</td>
                    <td><span className={`uso-txt uso-txt--${uso}`}>{USO_TXT[uso]}</span></td>
                    <td>{uso === "no" ? "—" : (
                      <Opciones nombre={`Inspección: ${e.epp}`} valor={f.estado[i] ?? ""} opciones={EPP_ESTADOS}
                        onChange={(v) => setF({ ...f, estado: { ...f.estado, [i]: v } })} />)}</td>
                    <td><input className="item__obs" aria-label={`Observaciones: ${e.epp}`} value={f.obs[i] ?? ""}
                      onChange={(ev) => setF({ ...f, obs: { ...f.obs, [i]: ev.target.value } })} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className={`veredicto veredicto--${veredicto === "apto" ? "apto" : veredicto === "pendiente" ? "pendiente" : "repaso"}`} role="status">
        <span>Conformidad y veredicto general de EPP</span>
        <strong>
          {veredicto === "repaso" ? "Requiere cambio de EPP"
            : veredicto === "incompleto" ? "Completar el EPP obligatorio antes de ingresar"
            : veredicto === "pendiente" ? `${nPend > 1 ? "Faltan" : "Falta"} ${nPend} elemento${nPend > 1 ? "s" : ""} por inspeccionar`
            : "Equipamiento completo y apto"}
        </strong>
        {veredicto === "repaso" && <p>{nMalo} elemento{nMalo > 1 ? "s" : ""} en mal estado.</p>}
      </section>
      <Nota tipo="clave"><strong>Idea clave:</strong> AlpacAire detecta y alerta, pero no reemplaza el EPP. El autorrescatador es el respaldo del minero si el equipo del frente falla o está fuera de su alcance.</Nota>
      <section className="panel">
        <Firmas izquierda="Firma del trabajador" derecha="Firma del supervisor SST / jefe de turno" />
      </section>
    </Seccion>
  );
}

// ------------------------------------------------------------ Checklist de mantenimiento del prototipo
const MANT_INICIAL = {
  ubicacion: "Frente Norte, galería subterránea", tecnico: "", fecha: hoyISO(), frecuencia: "Todas",
  estado: {} as Respuestas, obs: {} as Respuestas,
};
const resultadoMant = (v?: string) => (v === "Bueno" ? "Conforme" : v === "Malo" ? "Requiere corrección" : "Pendiente");

export function ChecklistMantenimiento() {
  const [f, setF, limpiar] = useBorrador("mantenimiento", MANT_INICIAL);
  const set = (k: keyof typeof MANT_INICIAL) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });
  const visibles = (fr: string) => f.frecuencia === "Todas" || fr === f.frecuencia;
  const items = MANTENIMIENTO.flatMap((s) => s.items).filter((i) => visibles(i.frecuencia));
  const nMalo = items.filter((i) => f.estado[i.id] === "Malo").length;
  const nPend = items.filter((i) => !f.estado[i.id] || f.estado[i.id] === "Pendiente").length;
  // Igual que el Excel: un "Malo" exige intervención técnica.
  const veredicto = nMalo ? "repaso" : nPend ? "pendiente" : "apto";

  return (
    <Seccion titulo="Checklist de control y mantenimiento del prototipo" ancho
      meta="Sistema AlpacAire, Minería La Gitana S.A.S. Protocolo de inspección preventiva y correctiva"
      acciones={<Acciones onLimpiar={limpiar} />}>
      <section className="panel formato__datos">
        <div className="formato__rejilla">
          <Campo label="Ubicación / frente de trabajo"><input value={f.ubicacion} onChange={set("ubicacion")} /></Campo>
          <Campo label="Técnico responsable"><input value={f.tecnico} onChange={set("tecnico")} /></Campo>
          <Campo label="Fecha de inspección"><input type="date" value={f.fecha} onChange={set("fecha")} /></Campo>
        </div>
      </section>

      <div className="chips-vars formato__filtro" role="group" aria-label="Frecuencia de evaluación">
        {["Todas", ...MANT_FRECUENCIAS].map((fr) => (
          <button key={fr} className={`chip-var ${f.frecuencia === fr ? "activo" : ""}`} onClick={() => setF({ ...f, frecuencia: fr })}>
            {fr === "Todas" ? "Todas las frecuencias" : fr}
          </button>
        ))}
      </div>

      {MANTENIMIENTO.map((s, si) => {
        const lista = s.items.filter((i) => visibles(i.frecuencia));
        if (!lista.length) return null;
        return (
          <section key={s.titulo} className="panel formato__seccion">
            <h3 className="panel__titulo">{si + 1}. {s.titulo}</h3>
            <div className="tabla-envoltura">
              <table className="tabla tabla--formato">
                <thead><tr><th>ID</th><th>Punto de control</th><th>Frecuencia</th><th>Criterio de aceptación</th><th>Estado</th><th>Resultado</th><th>Correctivo requerido</th></tr></thead>
                <tbody>
                  {lista.map((it) => {
                    const r = resultadoMant(f.estado[it.id]);
                    return (
                      <tr key={it.id}>
                        <td className="num"><strong>{it.id}</strong></td>
                        <td>{it.punto}</td>
                        <td className="tenue">{it.frecuencia}</td>
                        <td className="tenue">{it.criterio}</td>
                        <td><Opciones nombre={`Estado ${it.id}`} valor={f.estado[it.id] ?? ""} opciones={["Bueno", "Malo", "Pendiente", "N/A"]}
                          onChange={(v) => setF({ ...f, estado: { ...f.estado, [it.id]: v } })} /></td>
                        <td><span className={`resultado resultado--${r === "Conforme" ? "ok" : r === "Pendiente" ? "pendiente" : "revisar"}`}>{r}</span></td>
                        <td><input className="item__obs" aria-label={`Correctivo ${it.id}`} value={f.obs[it.id] ?? ""}
                          onChange={(ev) => setF({ ...f, obs: { ...f.obs, [it.id]: ev.target.value } })} /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        );
      })}

      <section className={`veredicto veredicto--${veredicto}`} role="status">
        <span>Veredicto de mantenimiento del prototipo</span>
        <strong>
          {veredicto === "repaso" ? "Prototipo requiere intervención técnica"
            : veredicto === "pendiente" ? `${nPend > 1 ? "Faltan" : "Falta"} ${nPend} punto${nPend > 1 ? "s" : ""} por inspeccionar`
            : "Prototipo conforme y operativo"}
        </strong>
        {veredicto === "repaso" && <p>{nMalo} punto{nMalo > 1 ? "s" : ""} en mal estado. Registrar el correctivo y volver a inspeccionar.</p>}
      </section>
      <section className="panel">
        <Firmas izquierda="Firma del técnico responsable" derecha="Firma del supervisor SST" />
      </section>
    </Seccion>
  );
}
