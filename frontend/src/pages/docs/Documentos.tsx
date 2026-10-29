import { useEffect, useMemo, useRef } from "react";
import { Link } from "../../lib/router";
import Seccion, { Nota } from "../Seccion";
import { CM_MESES, CM_TIPOS, CRONOGRAMA, META } from "./contenido";

export const NORMATIVIDAD_DOCS = [
  { to: "/normatividad/partes-interesadas", titulo: "Partes interesadas", desc: "Quién influye en AlpacAire y cómo se gestiona cada uno." },
  { to: "/normatividad/flujo-monitoreo", titulo: "Flujo de monitoreo", desc: "De la medición a la alarma, la evacuación y el reingreso." },
  { to: "/normatividad/procesos-misionales", titulo: "Procesos misionales", desc: "Los cinco procesos, de diagnóstico a calibración." },
  { to: "/normatividad/matriz-epp", titulo: "Matriz EPP", desc: "Protección obligatoria por rol en el frente." },
  { to: "/normatividad/matriz-requisitos", titulo: "Matriz de requisitos legales", desc: "Artículos del Decreto 1886 que el sistema cubre o apoya." },
  { to: "/normatividad/plan-capacitacion", titulo: "Plan de capacitación", desc: "Qué aprende cada rol, cuánto dura y en qué orden." },
  { to: "/normatividad/sistema-gases", titulo: "Sistema de gases", desc: "Plano de la red de monitoreo en las galerías." },
  { to: "/normatividad/presupuesto", titulo: "Presupuesto del prototipo", desc: "Costo por bloque del prototipo y del sistema de 2 km." },
  { to: "/normatividad/costo-beneficio", titulo: "Análisis costo-beneficio", desc: "Razón B/C con supuestos editables y fuentes." },
  { to: "/normatividad/matriz-riesgos", titulo: "Matriz de riesgos", desc: "Riesgos del prototipo, nivel P×I y controles." },
  { to: "/normatividad/plan-emergencias", titulo: "Plan de emergencias", desc: "Procedimientos ante gases, fallas y colapsos." },
];

export const FORMATOS_DOCS = [
  { to: "/formatos/checklist-epp", codigo: "CH-EPP", titulo: "Uso del EPP en campo", desc: "Inspección del EPP según el cargo." },
  { to: "/formatos/checklist-mantenimiento", codigo: "CH-MT", titulo: "Control y mantenimiento", desc: "Inspección preventiva y correctiva del prototipo." },
  { to: "/formatos/checklist-supervisor", codigo: "CH-SP", titulo: "Verificación en campo: capacitación de personal", desc: "Práctica de alarmas, autorrescatador y uso de la app." },
  { to: "/formatos/cronograma-mantenimiento", codigo: "CH-CM", titulo: "Cronograma anual de mantenimiento", desc: "Las 52 semanas de 2026 por componente." },
  { to: "/formatos/lista-chequeo", codigo: "CH-ES", titulo: "Entrada y salida de la mina", desc: "EPP, atmósfera y autorización de ingreso." },
  { to: "/formatos/seguimiento-kpi", codigo: "KPI", titulo: "Seguimiento de KPI del dispositivo", desc: "Desempeño del equipo frente a sus metas." },
  { to: "/formatos/manual-usuario", codigo: "MU", titulo: "Manual del usuario", desc: "Cómo usar cada sección de la plataforma." },
];

const Flecha = () => (
  <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true" className="doc-boton__flecha">
    <path d="M7 4 L13 10 L7 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function Documentos() {
  return (
    <div className="pagina">
      <div className="pagina__cabeza">
        <h2>Documentos</h2>
        <p className="tenue">Normatividad, políticas y formatos del sistema AlpacAire. Los formatos se llenan en pantalla y se pueden imprimir o guardar en PDF.</p>
      </div>

      <section className="panel documentos">
        <h3 className="panel__titulo">Normatividad y políticas</h3>
        <div className="doc-botones">
          {NORMATIVIDAD_DOCS.map((d) => (
            <Link key={d.to} to={d.to} className="doc-boton">
              <span><strong>{d.titulo}</strong><span>{d.desc}</span></span>
              <Flecha />
            </Link>
          ))}
        </div>
      </section>

      <section className="panel documentos">
        <h3 className="panel__titulo">Formatos</h3>
        <div className="doc-botones">
          {FORMATOS_DOCS.map((d) => (
            <Link key={d.to} to={d.to} className="doc-boton doc-boton--formato">
              <span className="doc-boton__codigo">{d.codigo}</span>
              <span><strong>{d.titulo}</strong><span>{d.desc}</span></span>
              <Flecha />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

// ------------------------------------------------------------ Sistema de gases (plano)
export function SistemaGases() {
  return (
    <Seccion titulo="Sistema de gases" meta="Plano elaborado en AutoCAD por el equipo IMS Alpac, 29/10/2026" ancho
      descripcion="Plano de las galerías de la mina con el recorrido de la red de monitoreo de gases."
      acciones={<a className="btn btn--claro" href="/Sistema_de_gases.pdf" download>Descargar plano (PDF)</a>}>
      <section className="panel plano">
        <a href="/docs-sistema-gases.svg" target="_blank" rel="noopener" className="plano__enlace" title="Abrir el plano en tamaño completo">
          <img src="/docs-sistema-gases.svg" alt="Plano del sistema de gases de la mina" />
        </a>
      </section>
      <Nota>Haz clic en el plano para abrirlo en tamaño completo y acercarlo. El archivo original en PDF conserva la escala de AutoCAD.</Nota>
    </Seccion>
  );
}

// ------------------------------------------------------------ CH-CM: cronograma anual
function semanaISO(d = new Date()) {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dia = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - dia);
  const inicio = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  return { anio: t.getUTCFullYear(), semana: Math.ceil(((t.getTime() - inicio.getTime()) / 86400000 + 1) / 7) };
}

const tipoCelda = (letra: string, tm: string) => (letra === "." ? null : letra === "P" ? tm : letra);

export function CronogramaMantenimiento() {
  const { anio, semana } = semanaISO();
  const actual = anio === 2026 ? semana : null;
  const estaSemana = useMemo(() => actual == null ? [] :
    CRONOGRAMA.filter((f) => f.semanas[actual - 1] !== ".").map((f) => ({ ...f, tipo: tipoCelda(f.semanas[actual - 1], f.tm)! })), [actual]);
  const tabla = useRef<HTMLDivElement>(null);
  // Llevar la vista a la semana actual
  useEffect(() => {
    const el = tabla.current, hoy = el?.querySelector<HTMLElement>("th.cm__hoy");
    if (el && hoy) el.scrollLeft = Math.max(0, hoy.offsetLeft - el.clientWidth / 2);
  }, []);
  const anchos = CM_MESES.map(([m, ini], i) => [m, (CM_MESES[i + 1]?.[1] ?? 53) - ini] as const);

  return (
    <Seccion titulo="Cronograma anual de mantenimiento preventivo" ancho
      meta="CH-CM. Minería subterránea, galería principal (2.000 m). Equipo: AlpacAire (ESP32-S3, troncal de 2 km, Raspberry Pi 5). SGC V1, año 2026"
      acciones={<button className="btn btn--primario" onClick={() => window.print()}>Imprimir o guardar PDF</button>}>
      {actual != null && (
        <section className="panel">
          <h3 className="panel__titulo">Esta semana (semana {actual})</h3>
          {estaSemana.length === 0 ? <p className="tenue">No hay mantenimientos programados esta semana.</p> : (
            <ul className="cm-semana">
              {estaSemana.map((f) => (
                <li key={f.codigo}><span className={`cm-tipo cm-tipo--${f.tipo}`}>{f.tipo}</span><strong>{f.codigo}</strong> {f.objeto} <span className="tenue">({f.it})</span></li>
              ))}
            </ul>
          )}
        </section>
      )}

      <section className="panel">
        <ul className="leyenda leyenda--cm">
          {Object.entries(CM_TIPOS).map(([k, v]) => <li key={k}><span className={`cm-tipo cm-tipo--${k}`}>{k}</span>{v}</li>)}
          {actual != null && <li><span className="cm-hoy-muestra" /> Semana actual</li>}
        </ul>
        <div className="tabla-envoltura cm-envoltura" ref={tabla}>
          <table className="cm">
            <thead>
              <tr>
                <th rowSpan={2} className="cm__fija">Código</th>
                <th rowSpan={2} className="cm__fija cm__objeto">Objeto / componente</th>
                <th rowSpan={2}>IT</th>
                <th rowSpan={2}>TM</th>
                {anchos.map(([m, n]) => <th key={m} colSpan={n} className="cm__mes">{m}</th>)}
              </tr>
              <tr>
                {Array.from({ length: 52 }, (_, i) => <th key={i} className={`cm__sem ${actual === i + 1 ? "cm__hoy" : ""}`}>{i + 1}</th>)}
              </tr>
            </thead>
            <tbody>
              {CRONOGRAMA.map((f) => (
                <tr key={f.codigo}>
                  <td className="cm__fija"><strong>{f.codigo}</strong></td>
                  <td className="cm__fija cm__objeto">{f.objeto}</td>
                  <td className="tenue">{f.it}</td>
                  <td><span className={`cm-tipo cm-tipo--${f.tm}`}>{f.tm}</span></td>
                  {Array.from(f.semanas).map((l, i) => {
                    const t = tipoCelda(l, f.tm);
                    return <td key={i} className={`cm__celda ${actual === i + 1 ? "cm__hoy" : ""}`} title={t ? `Semana ${i + 1}: ${CM_TIPOS[t]}` : undefined}>
                      {t && <span className={`cm-marca cm-marca--${t}`}>{t}</span>}
                    </td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <Nota>{META}. Desplázate a la derecha para ver todo el año; las dos primeras columnas quedan fijas.</Nota>
    </Seccion>
  );
}
