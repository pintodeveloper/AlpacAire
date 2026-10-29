import { Fragment, useState } from "react";
import Seccion, { Nota } from "../Seccion";
import {
  CAPACITACION, CUADRANTES, EPP, EPP_ROLES, META, ORDEN_CAPACITACION, PARTES, PENDIENTES, PROCESOS,
  RECOMENDACIONES, REFERENCIAS, REQUISITOS, type Uso,
} from "./contenido";

const nivelClase = (n: string) => `nivel3 nivel3--${n.toLowerCase()}`;

// ------------------------------------------------------------ Partes interesadas
export function PartesInteresadas() {
  return (
    <Seccion titulo="Análisis de partes interesadas" meta={META} ancho
      descripcion="Personas y organizaciones que influyen en AlpacAire o se ven afectadas por él, clasificadas según su poder y su interés en el proyecto.">
      <section className="panel">
        <h3 className="panel__titulo">Mapa de poder e interés</h3>
        <div className="mapa-pi">
          <span className="mapa-pi__eje mapa-pi__eje--y">Poder</span>
          <div className="mapa-pi__grid">
            {CUADRANTES.map((c) => (
              <div key={c.clave} className={`cuadrante cuadrante--${c.clave}`}>
                <strong>{c.titulo}</strong>
                <span className="cuadrante__eje">{c.eje}</span>
                <p>{c.quienes}</p>
              </div>
            ))}
          </div>
          <span className="mapa-pi__eje mapa-pi__eje--x">Interés</span>
        </div>
      </section>

      <section className="panel">
        <h3 className="panel__titulo">Partes interesadas y estrategia</h3>
        <div className="tabla-envoltura">
          <table className="tabla tabla--doc">
            <thead>
              <tr><th>Parte interesada</th><th>Rol frente al proyecto</th><th>Qué necesita o espera</th><th>Poder</th><th>Interés</th><th>Estrategia</th></tr>
            </thead>
            <tbody>
              {PARTES.map((p) => (
                <tr key={p.nombre}>
                  <td><strong>{p.nombre}</strong></td>
                  <td>{p.rol}</td>
                  <td>{p.espera}</td>
                  <td><span className={nivelClase(p.poder)}>{p.poder}</span></td>
                  <td><span className={nivelClase(p.interes)}>{p.interes}</span></td>
                  <td><strong>{p.estrategia}:</strong> {p.accion.charAt(0).toLowerCase() + p.accion.slice(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Nota tipo="clave">
        <strong>Hallazgo clave:</strong> el supervisor SST y la gerencia son quienes más pesan en la adopción del sistema, por eso se gestionan de cerca.
        Los mineros tienen poco poder de decisión, pero son los más expuestos al riesgo y quienes reciben la alarma local: no se pueden dejar de lado en el diseño ni en la capacitación.
      </Nota>
      <Nota>La clasificación de poder e interés es una propuesta del equipo y debe ajustarse a la mina que se tome como caso.</Nota>
    </Seccion>
  );
}

// ------------------------------------------------------------ Flujo de monitoreo y respuesta
function Paso({ n, titulo, texto, className = "" }: { n: number; titulo: string; texto: string; className?: string }) {
  return (
    <div className={`paso ${className}`}>
      <span className="paso__n">{n}</span>
      <div><strong>{titulo}</strong><p>{texto}</p></div>
    </div>
  );
}

const Flecha = ({ dir = "der" }: { dir?: "der" | "abajo" }) => (
  <svg className={`flecha flecha--${dir}`} viewBox="0 0 24 24" aria-hidden="true">
    <path d={dir === "der" ? "M2 12 H19 M13 6 L19 12 L13 18" : "M12 2 V19 M6 13 L12 19 L18 13"} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function FlujoMonitoreo() {
  return (
    <Seccion titulo="Flujo de monitoreo y respuesta" meta={META} ancho
      descripcion="Qué pasa desde que el sensor mide hasta que el personal vuelve a ingresar al frente.">
      <section className="panel flujo">
        <div className="flujo__fila">
          <Paso n={1} titulo="Medición continua" texto="Gases, oxígeno, temperatura seca y húmeda en el frente." />
          <Flecha />
          <Paso n={2} titulo="Cálculo y envío" texto="Temperatura efectiva y datos a la app en tiempo real." />
          <Flecha />
          <Paso n={3} titulo="Comparación" texto="Cada lectura contra los límites del Decreto 1886 de 2015." />
          <Flecha />
          <div className="decision"><span>¿Supera el límite?</span></div>
        </div>
        <div className="flujo__bucle">
          <span className="flujo__no">No: sigue el monitoreo continuo y vuelve al paso 1</span>
          <span className="flujo__si">Sí: se activan dos respuestas en paralelo</span>
        </div>

        <div className="flujo__carriles">
          <div className="carril">
            <h4>En el frente (minero)</h4>
            <Paso n={4} titulo="Alarma local" texto="Luz y sonido en el frente." className="paso--alerta" />
            <Flecha dir="abajo" />
            <Paso n={5} titulo="El minero reacciona" texto="Detiene el trabajo y evacúa por la ruta de emergencia." className="paso--alerta" />
          </div>
          <div className="carril">
            <h4>En superficie (supervisor SST)</h4>
            <Paso n={4} titulo="Alerta en la app" texto="Sector y lectura que superó el límite." className="paso--alerta" />
            <Flecha dir="abajo" />
            <Paso n={5} titulo="El supervisor decide" texto="Verifica, ordena la evacuación y avisa a las brigadas." className="paso--alerta" />
          </div>
        </div>
        <div className="flujo__cierre">
          <Flecha dir="abajo" />
          <Paso n={6} titulo="Registro y reingreso"
            texto="El evento queda en el historial. Cuando las lecturas vuelven a niveles seguros, el supervisor autoriza el reingreso y se reanuda el monitoreo normal." />
        </div>
      </section>
      <Nota>Los tiempos de respuesta y el protocolo de evacuación deben definirse con el responsable de SST de la mina que se tome como caso.</Nota>
    </Seccion>
  );
}

// ------------------------------------------------------------ Procesos misionales
export function ProcesosMisionales() {
  return (
    <Seccion titulo="Mapa de procesos misionales" ancho
      meta="Empresa: AlpacAire (IMS Alpac). Cliente: Minería La Gitana S.A.S. (2026)"
      descripcion="Cadena de procesos misionales del sistema AlpacAire, desde la necesidad de la mina hasta la protección del personal.">
      <section className="panel">
        <div className="cadena">
          <div className="cadena__extremo">
            <strong>Mina con riesgo atmosférico</strong>
            <span>Requisitos legales y operativos</span>
          </div>
          <ol className="cadena__procesos">
            {PROCESOS.map((p, i) => (
              <li key={p.nombre} className="proceso">
                <span className="proceso__n">Proceso {i + 1}</span>
                <strong>{p.nombre}</strong>
                <p>{p.objetivo}</p>
              </li>
            ))}
          </ol>
          <div className="cadena__extremo cadena__extremo--fin">
            <strong>Mina protegida</strong>
            <span>Vida del minero y cumplimiento</span>
          </div>
        </div>
      </section>

      <section className="panel">
        <h3 className="panel__titulo">Caracterización de los procesos</h3>
        <div className="tabla-envoltura">
          <table className="tabla tabla--doc">
            <thead><tr><th>N.°</th><th>Proceso</th><th>Entradas</th><th>Salidas</th></tr></thead>
            <tbody>
              {PROCESOS.map((p, i) => (
                <tr key={p.nombre}><td className="num"><strong>{i + 1}</strong></td><td><strong>{p.nombre}</strong></td><td>{p.entradas}</td><td>{p.salidas}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <Nota>Elaboración propia del equipo IMS Alpac; se presentan únicamente los procesos misionales. Los límites normativos provienen del Decreto 1886 de 2015 (Ministerio de Minas y Energía).</Nota>
    </Seccion>
  );
}

// ------------------------------------------------------------ Matriz EPP
const USO_TXT: Record<Uso, string> = { obligatorio: "Obligatorio", tarea: "Según la tarea", no: "No aplica" };
const UsoIcono = ({ uso }: { uso: Uso }) =>
  uso === "no" ? <span className="uso uso--no" aria-label={USO_TXT.no}>—</span>
    : <span className={`uso uso--${uso}`} role="img" aria-label={USO_TXT[uso]} title={USO_TXT[uso]} />;

export function MatrizEPP() {
  return (
    <Seccion titulo="Matriz de EPP" meta={META}
      descripcion="Elementos de protección personal para quienes ingresan al frente de trabajo en una mina subterránea donde se instala AlpacAire.">
      <section className="panel">
        <ul className="leyenda leyenda--uso">
          <li><UsoIcono uso="obligatorio" /> Obligatorio</li>
          <li><UsoIcono uso="tarea" /> Según la tarea</li>
          <li><UsoIcono uso="no" /> No aplica</li>
        </ul>
        <div className="tabla-envoltura">
          <table className="tabla tabla--doc tabla--epp">
            <thead>
              <tr><th>EPP</th><th>Riesgo que cubre</th>{EPP_ROLES.map((r) => <th key={r} className="centro">{r}</th>)}</tr>
            </thead>
            <tbody>
              {EPP.map((e) => (
                <tr key={e.epp}>
                  <td><strong>{e.epp}</strong></td>
                  <td>{e.riesgo}</td>
                  {e.uso.map((u, i) => <td key={i} className="centro"><UsoIcono uso={u} /></td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <Nota tipo="clave"><strong>Idea clave:</strong> AlpacAire detecta y alerta, pero no reemplaza el EPP. El autorrescatador es el respaldo del minero si el equipo del frente falla o si está fuera de su alcance.</Nota>
      <Nota>Esta matriz es una base general. Los equipos y sus normas técnicas deben validarse contra el Decreto 1886 de 2015 y el panorama de riesgos de la mina que se tome como caso.</Nota>
    </Seccion>
  );
}

// ------------------------------------------------------------ Matriz de requisitos legales
export function MatrizRequisitos() {
  const [filtro, setFiltro] = useState<"Todos" | "Cubre" | "Apoya">("Todos");
  const lista = REQUISITOS.map((r, i) => ({ ...r, n: i + 1 })).filter((r) => filtro === "Todos" || r.estado === filtro);
  const cuenta = (e: string) => REQUISITOS.filter((r) => r.estado === e).length;
  return (
    <Seccion titulo="Matriz de requisitos legales y seguridad minera" ancho
      meta="Empresa: Minería La Gitana S.A.S. Proyecto: monitoreo con AlpacAire (2026)"
      descripcion="Requisitos legales que el sistema AlpacAire cubre o apoya en labores mineras subterráneas.">
      <div className="chips-vars" role="group" aria-label="Filtrar por estado">
        {(["Todos", "Cubre", "Apoya"] as const).map((f) => (
          <button key={f} className={`chip-var ${filtro === f ? "activo" : ""}`} onClick={() => setFiltro(f)}>
            {f} ({f === "Todos" ? REQUISITOS.length : cuenta(f)})
          </button>
        ))}
      </div>
      <section className="panel">
        <div className="tabla-envoltura">
          <table className="tabla tabla--doc">
            <thead><tr><th>N.°</th><th>Norma y artículo</th><th>Requisito legal</th><th>Límite o parámetro</th><th>Cómo lo aplica AlpacAire</th><th>Estado</th></tr></thead>
            <tbody>
              {lista.map((r) => (
                <tr key={r.n}>
                  <td className="num"><strong>{r.n}</strong></td>
                  <td><strong>{r.norma}</strong><br /><span className="tenue">{r.articulo}</span></td>
                  <td>{r.requisito}</td>
                  <td>{r.limite}</td>
                  <td>{r.aplica}</td>
                  <td><span className={`estado-req estado-req--${r.estado.toLowerCase()}`}>{r.estado}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="tenue nota"><strong>Cubre:</strong> el sistema satisface directamente el requisito. <strong>Apoya:</strong> aporta evidencia; la obligación se completa con un procedimiento de la empresa.
          El Decreto 944 de 2022 modificó algunos artículos (entre ellos 31, 40, 46 y 47); confirmar la redacción vigente.</p>
      </section>

      <div className="doc-columnas">
        <section className="panel">
          <h3 className="panel__titulo">Recomendaciones de implementación</h3>
          <dl className="definiciones">
            {RECOMENDACIONES.map(([t, d]) => <div key={t}><dt>{t}</dt><dd>{d}</dd></div>)}
          </dl>
        </section>
        <section className="panel">
          <h3 className="panel__titulo">Pendientes por verificar</h3>
          <dl className="definiciones">
            {PENDIENTES.map(([t, d]) => <div key={t}><dt>{t}</dt><dd>{d}</dd></div>)}
          </dl>
        </section>
      </div>

      <section className="panel">
        <h3 className="panel__titulo">Referencias</h3>
        <ul className="referencias">{REFERENCIAS.map((r) => <li key={r}>{r}</li>)}</ul>
      </section>
    </Seccion>
  );
}

// ------------------------------------------------------------ Plan de capacitación
export function PlanCapacitacion() {
  return (
    <Seccion titulo="Plan de capacitación por rol" meta={META} ancho
      descripcion="Capacitaciones cortas, prácticas y con el equipo real: cada persona aprende solo lo que necesita para su papel, con el mínimo tiempo fuera de la operación.">
      <div className="capacitaciones">
        {CAPACITACION.map((c) => (
          <article key={c.rol} className="panel capacitacion">
            <header>
              <h3>{c.rol}</h3>
              <span className="capacitacion__duracion">{c.duracion}</span>
            </header>
            <p className="capacitacion__objetivo">{c.objetivo}</p>
            <ul>{c.temas.map((t) => <li key={t}>{t}</li>)}</ul>
            <dl className="capacitacion__datos">
              {[["Modalidad", c.modalidad], ["Frecuencia", c.frecuencia], ["Cómo se evalúa", c.evaluacion]].map(([k, v]) => (
                <Fragment key={k}><dt>{k}</dt><dd>{v}</dd></Fragment>
              ))}
            </dl>
          </article>
        ))}
      </div>

      <section className="panel">
        <h3 className="panel__titulo">Orden sugerido: 4 días</h3>
        <ol className="linea-tiempo">
          {ORDEN_CAPACITACION.map((o) => (
            <li key={o.dia}>
              <span className="linea-tiempo__dia">{o.dia}</span>
              <div><strong>{o.quien}</strong><p>{o.porque}</p></div>
            </li>
          ))}
        </ol>
      </section>
      <Nota tipo="clave"><strong>Registro:</strong> en cada sesión se deja lista de asistencia y el resultado de la práctica, como evidencia de la capacitación de cada persona.</Nota>
      <Nota>Las duraciones y frecuencias son una propuesta del equipo y deben ajustarse con el responsable de SST de la mina que se tome como caso.</Nota>
    </Seccion>
  );
}
