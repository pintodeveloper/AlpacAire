import { useEffect, useState } from "react";
import Seccion, { Nota } from "../Seccion";
import {
  CONCLUSIONES_CB, DIRECTORIO, ESCALA_I, ESCALA_P, FUENTES_CB, PON_ESTADOS, PONS, PRESUPUESTO, PRESUPUESTO_TOTAL_DOC,
  RECURSOS_SALVAMENTO, RIESGO_ESTADOS, RIESGOS, SUPUESTOS_CB, SUPUESTOS_CB_INFO, type SupuestosCB,
} from "./contenido";
import { calcularCB } from "./costoBeneficio";

const cop = (v: number) => v.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });
const usd = (v: number) => `${v.toLocaleString("es-CO", { maximumFractionDigits: 2 })} USD`;
const pct = (v: number, d = 1) => `${(v * 100).toLocaleString("es-CO", { maximumFractionDigits: d, minimumFractionDigits: d })} %`;
const dec = (v: number, d = 2) => v.toLocaleString("es-CO", { maximumFractionDigits: d, minimumFractionDigits: d });

function useGuardado<T>(clave: string, inicial: T) {
  const [v, setV] = useState<T>(() => {
    try { const s = localStorage.getItem(`alpacaire.doc.${clave}`); return s ? { ...inicial, ...JSON.parse(s) } : inicial; }
    catch { return inicial; }
  });
  useEffect(() => { try { localStorage.setItem(`alpacaire.doc.${clave}`, JSON.stringify(v)); } catch { /* sin almacenamiento */ } }, [clave, v]);
  return [v, setV, () => setV(inicial)] as const;
}

function Selector({ valor, opciones, onChange, nombre }: { valor: string; opciones: string[]; onChange: (v: string) => void; nombre: string }) {
  return (
    <select className={`estado-sel estado-sel--${opciones.indexOf(valor)}`} aria-label={nombre} value={valor} onChange={(e) => onChange(e.target.value)}>
      {opciones.map((o) => <option key={o}>{o}</option>)}
    </select>
  );
}

// ------------------------------------------------------------ Presupuesto del prototipo
export function PresupuestoPrototipo() {
  const [incl, setIncl, reiniciar] = useGuardado<Record<number, boolean>>("presupuesto", Object.fromEntries(PRESUPUESTO.map((b, i) => [i, b.prototipo])));
  const sumaUSD = PRESUPUESTO.reduce((n, b) => n + b.usd, 0);
  const sumaCOP = PRESUPUESTO.reduce((n, b) => n + b.cop, 0);
  const protoUSD = PRESUPUESTO.reduce((n, b, i) => n + (incl[i] ? b.usd : 0), 0);
  const protoCOP = PRESUPUESTO.reduce((n, b, i) => n + (incl[i] ? b.cop : 0), 0);

  return (
    <Seccion titulo="Presupuesto del prototipo" ancho meta="IMS Alpac. Protección de vida: datos y alarmas tempranas en tiempo real"
      acciones={<><button className="btn btn--claro" onClick={reiniciar}>Restablecer selección</button>
        <button className="btn btn--primario" onClick={() => window.print()}>Imprimir o guardar PDF</button></>}>
      <div className="cifras">
        <div className="cifra cifra--principal"><span>Costo del prototipo</span><strong>{usd(protoUSD)}</strong><small>{cop(protoCOP)} aprox.</small></div>
        <div className="cifra"><span>Sistema completo (2 km)</span><strong>{usd(PRESUPUESTO_TOTAL_DOC.usd)}</strong><small>{cop(PRESUPUESTO_TOTAL_DOC.cop)} según el documento</small></div>
        <div className="cifra"><span>Bloques en el prototipo</span><strong>{Object.values(incl).filter(Boolean).length} de {PRESUPUESTO.length}</strong><small>Cámbialos en la columna "¿En el prototipo?"</small></div>
      </div>

      <section className="panel">
        <div className="tabla-envoltura">
          <table className="tabla tabla--doc">
            <thead><tr><th>Bloque del proyecto</th><th>Qué incluye exactamente</th><th className="num">USD</th><th className="num">COP aprox.</th><th className="centro">¿En el prototipo?</th></tr></thead>
            <tbody>
              {PRESUPUESTO.map((b, i) => (
                <tr key={b.bloque} className={incl[i] ? "fila--incluida" : ""}>
                  <td><strong>{i + 1}. {b.bloque}</strong></td>
                  <td className="tenue">{b.incluye}</td>
                  <td className="num">{dec(b.usd, 0)}</td>
                  <td className="num">{cop(b.cop)}</td>
                  <td className="centro">
                    <div className="segmentado segmentado--compacto" role="radiogroup" aria-label={`¿${b.bloque} en el prototipo?`}>
                      {["Sí", "No"].map((o) => (
                        <button key={o} type="button" role="radio" aria-checked={(o === "Sí") === !!incl[i]}
                          className={(o === "Sí") === !!incl[i] ? `activo activo--${o === "Sí" ? "si" : "otro"}` : ""}
                          onClick={() => setIncl({ ...incl, [i]: o === "Sí" })}>{o}</button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr><td colSpan={2}><strong>Costo total del proyecto (2 km)</strong> <span className="tenue">según el documento, sistema llave en mano</span></td><td className="num"><strong>{dec(PRESUPUESTO_TOTAL_DOC.usd, 0)}</strong></td><td className="num"><strong>{cop(PRESUPUESTO_TOTAL_DOC.cop)}</strong></td><td /></tr>
              <tr><td colSpan={2}>Suma de los 4 bloques (calculada)</td><td className="num">{dec(sumaUSD, 0)}</td><td className="num">{cop(sumaCOP)}</td><td /></tr>
              <tr className="fila--total"><td colSpan={2}><strong>Costo del prototipo</strong> <span className="tenue">bloques marcados Sí</span></td><td className="num"><strong>{dec(protoUSD, 0)}</strong></td><td className="num"><strong>{cop(protoCOP)}</strong></td><td /></tr>
            </tfoot>
          </table>
        </div>
      </section>
      <Nota tipo="clave">
        <strong>Ojo con los pesos:</strong> los costos y la fila de total se tomaron tal cual del documento. La suma calculada en COP ({cop(sumaCOP)}) no coincide con el total del documento ({cop(PRESUPUESTO_TOTAL_DOC.cop)}); la diferencia viene de los pesos de los bloques 3 y 4. Los valores en USD sí cuadran ({dec(sumaUSD, 0)} USD).
      </Nota>
      <Nota>El prototipo incluye por defecto los bloques 1 y 4 (supuesto por confirmar).</Nota>
    </Seccion>
  );
}

// ------------------------------------------------------------ Análisis costo-beneficio
export function CostoBeneficio() {
  const [s, setS, reiniciar] = useGuardado<SupuestosCB>("costobeneficio", SUPUESTOS_CB);
  const r = calcularCB(s);
  const [pe, ciscuda] = r.escenarios;
  const cambiado = (Object.keys(SUPUESTOS_CB) as (keyof SupuestosCB)[]).some((k) => s[k] !== SUPUESTOS_CB[k]);
  const bcClase = (v: number) => (v >= 1 ? "bc bc--si" : "bc bc--no");

  return (
    <Seccion titulo="Análisis costo-beneficio" ancho meta="DC-AC. IMS Alpac. Cifras con fuente en la sección Fuentes"
      acciones={<><button className="btn btn--claro" onClick={reiniciar} disabled={!cambiado}>Volver a los valores base</button>
        <button className="btn btn--primario" onClick={() => window.print()}>Imprimir o guardar PDF</button></>}>
      {cambiado && <p className="formato__resumen" role="status"><strong>Estás viendo un escenario propio.</strong> Cambiaste supuestos; los resultados ya se recalcularon.</p>}

      <div className="cifras">
        <div className="cifra"><span>Muertes por explosiones de metano o polvo</span><strong>{pct(r.pctMuertesExp)}</strong><small>del total nacional (ANM 2005-2020)</small></div>
        <div className="cifra"><span>Muertes por explosión por año</span><strong>{dec(r.muertesExpAnio, 1)}</strong><small>promedio nacional</small></div>
        <div className="cifra"><span>Valor por muerte usado</span><strong>{cop(r.valorMuerte)}</strong><small>{s.valoracion === "Social" ? "valor estadístico de la vida" : "valor presente de la pensión"}</small></div>
        <div className="cifra cifra--principal"><span>Razón B/C del prototipo</span><strong className={bcClase(ciscuda.bcPrototipo)}>{dec(ciscuda.bcPrototipo)}</strong><small>evento tipo La Ciscuda, probabilidad {pct(s.probabilidad)}</small></div>
        <div className="cifra"><span>Razón B/C del sistema 2 km</span><strong className={bcClase(ciscuda.bcSistema)}>{dec(ciscuda.bcSistema)}</strong><small>evento tipo La Ciscuda ({dec(pe.bcSistema)} con el promedio nacional)</small></div>
      </div>

      <section className="panel">
        <h3 className="panel__titulo">Supuestos</h3>
        <p className="tenue nota" style={{ marginTop: 0, marginBottom: 12 }}>Cambia los valores para probar escenarios; todo el análisis se recalcula al instante. Los datos de la ANM quedan fijos.</p>
        <div className="supuestos">
          <label className="campo supuesto supuesto--destacado">
            <span>Probabilidad anual de explosión fatal en la mina</span>
            <input type="range" min={0.001} max={0.1} step={0.001} value={s.probabilidad} onChange={(e) => setS({ ...s, probabilidad: Number(e.target.value) })} />
            <strong>{pct(s.probabilidad)}</strong>
            <small>No existe cifra pública por mina; se prueba entre 0,5 % y 10 %.</small>
          </label>
          <div className="campo supuesto supuesto--destacado">
            <span>Valoración de una muerte</span>
            <div className="segmentado" role="radiogroup" aria-label="Valoración de una muerte">
              {(["Pensión", "Social"] as const).map((v) => (
                <button key={v} role="radio" aria-checked={s.valoracion === v} className={s.valoracion === v ? "activo" : ""} onClick={() => setS({ ...s, valoracion: v })}>{v}</button>
              ))}
            </div>
            <small>Pensión: costo para el sistema de riesgos laborales. Social: valor estadístico de la vida.</small>
          </div>
        </div>
        <div className="tabla-envoltura">
          <table className="tabla tabla--doc">
            <thead><tr><th>Parámetro</th><th className="num">Valor</th><th>Unidad</th><th>Tipo de dato</th><th>Fuente</th></tr></thead>
            <tbody>
              {SUPUESTOS_CB_INFO.filter((x) => x.clave !== "probabilidad").map((x) => {
                const v = s[x.clave] as number;
                return (
                  <tr key={x.clave}>
                    <td><strong>{x.nombre}</strong></td>
                    <td className="num">{x.editable ? (
                      <input className="item__obs item__obs--num" type="number" step="any" aria-label={x.nombre}
                        value={x.pct ? Number((v * 100).toFixed(4)) : v}
                        onChange={(e) => { const n = Number(e.target.value); if (!Number.isNaN(n)) setS({ ...s, [x.clave]: x.pct ? n / 100 : n }); }} />
                    ) : dec(v, v % 1 ? 1 : 0)}</td>
                    <td className="tenue">{x.pct ? "%" : x.unidad}</td>
                    <td><span className={`tipo-dato tipo-dato--${x.tipo === "Supuesto" ? "sup" : "dato"}`}>{x.tipo}</span></td>
                    <td className="tenue">{x.fuente}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <div className="doc-columnas">
        <section className="panel">
          <h3 className="panel__titulo">1. Magnitud del problema</h3>
          <dl className="pares">
            <dt>Muertes por explosiones, % del total</dt><dd>{pct(r.pctMuertesExp)}</dd>
            <dt>Explosiones, % de las emergencias mineras</dt><dd>{pct(r.pctEventosExp)}</dd>
            <dt>Muertes promedio por evento de explosión</dt><dd>{dec(r.muertesPorEvento)}</dd>
            <dt>Muertes por explosión por año</dt><dd>{dec(r.muertesExpAnio, 1)}</dd>
            <dt>Muertes por todas las emergencias por año</dt><dd>{dec(r.muertesTotalAnio, 1)}</dd>
          </dl>
        </section>
        <section className="panel">
          <h3 className="panel__titulo">2. Valor de una vida perdida</h3>
          <dl className="pares">
            <dt>Pensión de sobrevivientes anual</dt><dd>{cop(r.pensionAnual)}</dd>
            <dt>Valor presente de la pensión</dt><dd>{cop(r.vpPension)}</dd>
            <dt>Valor estadístico de la vida (aprox.)</dt><dd>{cop(s.vev)}</dd>
            <dt><strong>Valor por muerte usado</strong></dt><dd><strong>{cop(r.valorMuerte)}</strong></dd>
          </dl>
        </section>
      </div>

      <section className="panel">
        <h3 className="panel__titulo">3. Costos</h3>
        <div className="tabla-envoltura">
          <table className="tabla tabla--doc">
            <thead><tr><th>Concepto</th><th className="num">Prototipo</th><th className="num">Sistema 2 km</th></tr></thead>
            <tbody>
              <tr><td>Inversión (USD)</td><td className="num">{dec(r.prototipo.usd, 0)}</td><td className="num">{dec(r.sistema.usd, 0)}</td></tr>
              <tr><td>Inversión (COP)</td><td className="num">{cop(r.prototipo.cop)}</td><td className="num">{cop(r.sistema.cop)}</td></tr>
              <tr><td>Mantenimiento anual (COP)</td><td className="num">{cop(r.prototipo.mant)}</td><td className="num">{cop(r.sistema.mant)}</td></tr>
              <tr><td>Valor presente del mantenimiento (COP)</td><td className="num">{cop(r.prototipo.vpMant)}</td><td className="num">{cop(r.sistema.vpMant)}</td></tr>
              <tr className="fila--total"><td><strong>Valor presente de los costos totales</strong></td><td className="num"><strong>{cop(r.prototipo.total)}</strong></td><td className="num"><strong>{cop(r.sistema.total)}</strong></td></tr>
              <tr><td>Equivalente en detectores multigás portátiles</td><td className="num">{dec(r.prototipo.detectores)}</td><td className="num">{dec(r.sistema.detectores)}</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel">
        <h3 className="panel__titulo">4. Beneficios y razón beneficio-costo (por mina)</h3>
        <div className="tabla-envoltura">
          <table className="tabla tabla--doc">
            <thead><tr><th>Concepto</th>{r.escenarios.map((e) => <th key={e.nombre} className="num">{e.nombre}</th>)}</tr></thead>
            <tbody>
              <tr><td>Muertes por evento</td>{r.escenarios.map((e) => <td key={e.nombre} className="num">{dec(e.muertes)}</td>)}</tr>
              <tr><td>Pérdida por evento (COP)</td>{r.escenarios.map((e) => <td key={e.nombre} className="num">{cop(e.perdida)}</td>)}</tr>
              <tr><td>Probabilidad anual de evento</td>{r.escenarios.map((e) => <td key={e.nombre} className="num">{pct(s.probabilidad)}</td>)}</tr>
              <tr><td>Efectividad del sistema</td>{r.escenarios.map((e) => <td key={e.nombre} className="num">{pct(s.efectividad, 0)}</td>)}</tr>
              <tr><td>Beneficio anual esperado (COP)</td>{r.escenarios.map((e) => <td key={e.nombre} className="num">{cop(e.beneficioAnual)}</td>)}</tr>
              <tr><td>Valor presente de beneficios (COP)</td>{r.escenarios.map((e) => <td key={e.nombre} className="num">{cop(e.vpBeneficio)}</td>)}</tr>
              <tr><td><strong>Razón beneficio-costo, sistema 2 km</strong></td>{r.escenarios.map((e) => <td key={e.nombre} className="num"><span className={bcClase(e.bcSistema)}>{dec(e.bcSistema)}</span></td>)}</tr>
              <tr><td>Valor presente neto, sistema 2 km</td>{r.escenarios.map((e) => <td key={e.nombre} className="num">{cop(e.vpnSistema)}</td>)}</tr>
              <tr><td><strong>Razón beneficio-costo, prototipo</strong></td>{r.escenarios.map((e) => <td key={e.nombre} className="num"><span className={bcClase(e.bcPrototipo)}>{dec(e.bcPrototipo)}</span></td>)}</tr>
              <tr><td>Valor presente neto, prototipo</td>{r.escenarios.map((e) => <td key={e.nombre} className="num">{cop(e.vpnPrototipo)}</td>)}</tr>
              <tr><td>Probabilidad anual de equilibrio, sistema 2 km</td>{r.escenarios.map((e) => <td key={e.nombre} className="num">{pct(e.equilibrioSistema, 2)}</td>)}</tr>
              <tr><td>Probabilidad anual de equilibrio, prototipo</td>{r.escenarios.map((e) => <td key={e.nombre} className="num">{pct(e.equilibrioPrototipo, 2)}</td>)}</tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel">
        <h3 className="panel__titulo">5. Sensibilidad: razón B/C del sistema 2 km según la probabilidad anual</h3>
        <div className="tabla-envoltura">
          <table className="tabla tabla--doc">
            <thead><tr><th>Probabilidad anual de evento</th>{r.escenarios.map((e) => <th key={e.nombre} className="num">{e.nombre}</th>)}</tr></thead>
            <tbody>
              {r.sensibilidad.map((f) => (
                <tr key={f.p}><td>{pct(f.p)}</td>{f.bc.map((v, i) => <td key={i} className="num"><span className={bcClase(v)}>{dec(v)}</span></td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="tenue nota">Una razón beneficio-costo de 1 o más (verde) indica que los beneficios esperados cubren los costos. Solo se valora la muerte de trabajadores; no se incluyen heridos, paradas de producción, rescate, multas ni daños a la mina, por lo que el beneficio real sería mayor.</p>
      </section>

      <section className="panel">
        <h3 className="panel__titulo">Conclusiones con los valores base</h3>
        <ol className="conclusiones">{CONCLUSIONES_CB.map((c) => <li key={c}>{c}</li>)}</ol>
      </section>

      <section className="panel">
        <h3 className="panel__titulo">Fuentes (consultadas el 29 de octubre de 2026)</h3>
        <div className="tabla-envoltura">
          <table className="tabla tabla--doc">
            <thead><tr><th>Dato</th><th>Fuente</th></tr></thead>
            <tbody>
              {FUENTES_CB.map(([d, f, url]) => (
                <tr key={d}><td>{d}</td><td>{url ? <a href={url} target="_blank" rel="noopener noreferrer">{f}</a> : f}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </Seccion>
  );
}

// ------------------------------------------------------------ Matriz de riesgos
export function MatrizRiesgos() {
  const todos = RIESGOS.flatMap((c) => c.items);
  const [estados, setEstados, reiniciar] = useGuardado<Record<string, string>>("riesgos", Object.fromEntries(todos.map((r) => [r.id, "Controlado"])));
  const [info, setInfo] = useGuardado("riesgos-info", { ubicacion: "", responsable: "", normativa: "Decreto 1886 de 2015" });
  const criticos = todos.filter((r) => estados[r.id] === "Crítico").length;
  const enCelda = (p: number, i: number) => todos.filter((r) => r.p === p && r.i === i);

  return (
    <Seccion titulo="Matriz de identificación y control de riesgos" ancho
      meta="DC-MR. Sistema AlpacAire, Minería La Gitana S.A.S. Riesgos tecnológicos y operativos en mina subterránea"
      acciones={<><button className="btn btn--claro" onClick={reiniciar}>Restablecer estados</button>
        <button className="btn btn--primario" onClick={() => window.print()}>Imprimir o guardar PDF</button></>}>
      <section className="panel formato__datos">
        <div className="formato__rejilla">
          <label className="campo"><span>Ubicación / sistema</span><input value={info.ubicacion} onChange={(e) => setInfo({ ...info, ubicacion: e.target.value })} placeholder="Ej.: Frente Norte y troncal" /></label>
          <label className="campo"><span>Responsable de la evaluación</span><input value={info.responsable} onChange={(e) => setInfo({ ...info, responsable: e.target.value })} /></label>
          <label className="campo"><span>Normativa de referencia</span><input value={info.normativa} onChange={(e) => setInfo({ ...info, normativa: e.target.value })} /></label>
        </div>
      </section>

      <div className="doc-columnas doc-columnas--mapa">
        <section className="panel">
          <h3 className="panel__titulo">Mapa de calor (probabilidad × impacto)</h3>
          <div className="calor">
            <span className="calor__eje calor__eje--y">Probabilidad</span>
            <div className="calor__grid">
              {[5, 4, 3, 2, 1].map((p) => [1, 2, 3, 4, 5].map((i) => {
                const rs = enCelda(p, i);
                return (
                  <div key={`${p}-${i}`} className="calor__celda" style={{ ["--n" as string]: (p * i) / 25 }} title={`P${p} × I${i} = ${p * i}`}>
                    <span className="calor__pxi">{p * i}</span>
                    {rs.map((r) => <span key={r.id} className={`calor__riesgo ${estados[r.id] === "Crítico" ? "calor__riesgo--critico" : ""}`}>{r.id}</span>)}
                  </div>
                );
              }))}
            </div>
            <div className="calor__ejex">{[1, 2, 3, 4, 5].map((i) => <span key={i}>{i}</span>)}</div>
            <span className="calor__eje calor__eje--x">Impacto</span>
          </div>
        </section>
        <section className={`veredicto ${criticos ? "veredicto--repaso" : "veredicto--apto"}`} role="status">
          <span>Evaluación y nivel de riesgo global del prototipo</span>
          <strong>{criticos ? "Riesgo alto: revise controles en el frente" : "Prototipo con controles de riesgo efectivos"}</strong>
          <p>{criticos ? `${criticos} riesgo${criticos > 1 ? "s" : ""} en estado crítico.` : `${todos.length} riesgos identificados; ninguno en estado crítico.`}</p>
        </section>
      </div>

      {RIESGOS.map((c, ci) => (
        <section key={c.categoria} className="panel formato__seccion">
          <h3 className="panel__titulo">{ci + 1}. {c.categoria}</h3>
          <div className="tabla-envoltura">
            <table className="tabla tabla--doc">
              <thead><tr><th>ID</th><th>Riesgo / evento adverso</th><th>Causa raíz</th><th>Impacto potencial</th><th className="num">P</th><th className="num">I</th><th className="num">P×I</th><th>Control preventivo</th><th>Responsable</th><th>Estado</th></tr></thead>
              <tbody>
                {c.items.map((r) => (
                  <tr key={r.id} className={estados[r.id] === "Crítico" ? "fila--no" : ""}>
                    <td className="num"><strong>{r.id}</strong></td>
                    <td><strong>{r.riesgo}</strong></td>
                    <td className="tenue">{r.causa}</td>
                    <td className="tenue">{r.impacto}</td>
                    <td className="num">{r.p}</td>
                    <td className="num">{r.i}</td>
                    <td className="num"><span className="pxi" style={{ ["--n" as string]: (r.p * r.i) / 25 }}>{r.p * r.i}</span></td>
                    <td>{r.control}</td>
                    <td className="tenue">{r.responsable}</td>
                    <td><Selector nombre={`Estado ${r.id}`} valor={estados[r.id]} opciones={RIESGO_ESTADOS} onChange={(v) => setEstados({ ...estados, [r.id]: v })} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
      <Nota tipo="clave"><strong>Principio clave de seguridad:</strong> AlpacAire detecta y alerta en tiempo real, pero no reemplaza el EPP. El autorrescatador es el respaldo del minero si el equipo del frente falla o está fuera de alcance.</Nota>

      <div className="doc-columnas">
        <section className="panel">
          <h3 className="panel__titulo">Escala de probabilidad</h3>
          <table className="tabla tabla--doc">
            <thead><tr><th>Nivel</th><th>Descripción en mina</th><th>Frecuencia</th></tr></thead>
            <tbody>{ESCALA_P.map(([n, c, d, f]) => <tr key={n}><td><strong>{n}. {c}</strong></td><td className="tenue">{d}</td><td>{f}</td></tr>)}</tbody>
          </table>
        </section>
        <section className="panel">
          <h3 className="panel__titulo">Escala de impacto</h3>
          <table className="tabla tabla--doc">
            <thead><tr><th>Nivel</th><th>En salud y seguridad</th><th>En el prototipo</th></tr></thead>
            <tbody>{ESCALA_I.map(([n, c, d, f]) => <tr key={n}><td><strong>{n}. {c}</strong></td><td className="tenue">{d}</td><td className="tenue">{f}</td></tr>)}</tbody>
          </table>
        </section>
      </div>
    </Seccion>
  );
}

// ------------------------------------------------------------ Plan de emergencias
export function PlanEmergencias() {
  const todos = PONS.flatMap((c) => c.items);
  const [estados, setEstados, reiniciar] = useGuardado<Record<string, string>>("pon", Object.fromEntries(todos.map((p) => [p.codigo, "Operativo"])));
  const [nombres, setNombres] = useGuardado<Record<string, string>>("directorio", {});
  const inactivos = todos.filter((p) => estados[p.codigo] === "Inactivo").length;

  return (
    <Seccion titulo="Plan de emergencias y procedimientos operativos normalizados" ancho
      meta="DC-PO. Sistema AlpacAire, Minería La Gitana S.A.S. Sector: frente de trabajo y troncal de galería (2.000 m). Coordinador: ingeniero de seguridad SST / jefe de brigada. Referencia: Decreto 1886 de 2015 y estándares ANM"
      acciones={<><button className="btn btn--claro" onClick={reiniciar}>Restablecer estados</button>
        <button className="btn btn--primario" onClick={() => window.print()}>Imprimir o guardar PDF</button></>}>
      <section className={`veredicto ${inactivos ? "veredicto--repaso" : "veredicto--apto"}`} role="status">
        <span>Estado de preparación de emergencias de la mina</span>
        <strong>{inactivos ? "Atención: protocolos incompletos" : "Sistema de respuesta a emergencias apto y disponible"}</strong>
        <p>{inactivos ? `${inactivos} protocolo${inactivos > 1 ? "s" : ""} inactivo${inactivos > 1 ? "s" : ""}.` : `${todos.length} procedimientos operativos normalizados (PON).`}</p>
      </section>

      {PONS.map((c, ci) => (
        <section key={c.categoria} className="panel">
          <h3 className="panel__titulo">{ci + 1}. {c.categoria}</h3>
          <div className="pons">
            {c.items.map((p) => (
              <article key={p.codigo} className={`pon ${estados[p.codigo] === "Inactivo" ? "pon--inactivo" : ""}`}>
                <header className="pon__cabeza">
                  <div>
                    <span className="pon__codigo">{p.codigo}</span>
                    <h4>{p.escenario}</h4>
                    <p className="pon__criterio">{p.criterio}</p>
                  </div>
                  <Selector nombre={`Estado ${p.codigo}`} valor={estados[p.codigo]} opciones={PON_ESTADOS} onChange={(v) => setEstados({ ...estados, [p.codigo]: v })} />
                </header>
                <div className="pon__acciones">
                  <div><span>En el frente (mineros)</span><p>{p.frente}</p></div>
                  <div><span>En superficie (supervisor SST)</span><p>{p.superficie}</p></div>
                </div>
                <dl className="pon__datos">
                  <dt>Equipos / EPP</dt><dd>{p.equipos}</dd>
                  <dt>Responsable</dt><dd>{p.responsable}</dd>
                </dl>
              </article>
            ))}
          </div>
        </section>
      ))}
      <Nota tipo="clave"><strong>Principio fundamental de salvamento:</strong> AlpacAire detecta y alerta en tiempo real, pero no reemplaza el EPP. El autorrescatador es el respaldo del minero si el equipo del frente falla o está fuera de alcance.</Nota>

      <section className="panel">
        <h3 className="panel__titulo">Cadena de contactos de emergencia 24/7</h3>
        <div className="tabla-envoltura">
          <table className="tabla tabla--doc">
            <thead><tr><th>Entidad / rol</th><th>Nombre del contacto</th><th>Teléfono / radio</th><th>Ubicación</th><th>Responsabilidad principal</th></tr></thead>
            <tbody>
              {DIRECTORIO.map((d) => (
                <tr key={d.rol}>
                  <td><strong>{d.rol}</strong></td>
                  <td>{d.editable
                    ? <input className="item__obs" aria-label={`Nombre: ${d.rol}`} placeholder="Escribe el nombre" value={nombres[d.rol] ?? ""} onChange={(e) => setNombres({ ...nombres, [d.rol]: e.target.value })} />
                    : d.nombre}</td>
                  <td>{d.contacto}</td>
                  <td className="tenue">{d.ubicacion}</td>
                  <td className="tenue">{d.responsabilidad}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="tenue nota">Completa los teléfonos reales de la mina y del centro médico antes de usar este directorio en una emergencia.</p>
      </section>

      <section className="panel">
        <h3 className="panel__titulo">Inventario de recursos y equipos de salvamento</h3>
        <div className="tabla-envoltura">
          <table className="tabla tabla--doc">
            <thead><tr><th>Equipo de salvamento</th><th>Ubicación</th><th>Cantidad</th><th>Estado</th><th>Inspección</th></tr></thead>
            <tbody>{RECURSOS_SALVAMENTO.map(([e, u, c, s, i]) => <tr key={e}><td><strong>{e}</strong></td><td className="tenue">{u}</td><td>{c}</td><td><span className="resultado resultado--ok">{s}</span></td><td>{i}</td></tr>)}</tbody>
          </table>
        </div>
      </section>
    </Seccion>
  );
}
