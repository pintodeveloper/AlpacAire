import { num } from "../lib/format";
import { useSesion } from "../lib/session";
import { VARS_PRINCIPALES } from "../lib/types";

const ROLES = [
  ["Ingeniero", "Administra la plataforma, el personal y el simulador."],
  ["Supervisor SST", "Vigila las condiciones, gestiona el personal y exporta reportes."],
  ["Dueño de la mina", "Consulta todo el estado de la mina y exporta reportes."],
  ["Ministerio de Minas", "Supervisa la operación en modo consulta y exporta reportes."],
  ["Operario", "Consulta la situación actual, los frentes y las gráficas de detalle."],
  ["Obrero", "Consulta la situación actual y los valores de los frentes."],
];

export default function Ayuda() {
  const { umbrales } = useSesion();
  return (
    <div className="pagina pagina--estrecha">
      <div className="pagina__cabeza">
        <h2>Ayuda</h2>
        <p className="tenue">Cómo leer AlpacAire y de dónde salen los límites.</p>
      </div>

      <section className="panel">
        <h3 className="panel__titulo">Estados de la mina</h3>
        <dl className="definiciones">
          <dt><span className="punto punto--normal" /> Todo en orden</dt>
          <dd>Todas las variables están dentro de los valores límite permisibles.</dd>
          <dt><span className="punto punto--alerta" /> Alerta</dt>
          <dd>Algún frente supera el valor de exposición de 8 horas o sus sensores dejaron de reportar. Se listan las acciones recomendadas.</dd>
          <dt><span className="punto punto--peligro" /> Evacuación inmediata</dt>
          <dd>Se superó un límite que obliga a desalojar. Suena la sirena en todas las pantallas abiertas.</dd>
        </dl>
      </section>

      {umbrales && (
        <section className="panel">
          <h3 className="panel__titulo">Límites usados</h3>
          <div className="tabla-envoltura">
            <table className="tabla">
              <thead><tr><th>Variable</th><th className="num">Alerta</th><th className="num">Peligro</th><th>Riesgo</th><th>Fuente</th></tr></thead>
              <tbody>
                {VARS_PRINCIPALES.map((k) => {
                  const c = umbrales.variables[k];
                  const o2 = k === "o2";
                  return (
                    <tr key={k}>
                      <td><strong>{c.nombre}</strong> ({c.unidad})</td>
                      <td className="num">{o2 ? `< ${num(c.alerta_min, k)} o > ${num(c.alerta_max, k)}` : `> ${num(c.alerta_max, k)}`}</td>
                      <td className="num">{o2 ? `< ${num(c.peligro_min, k)} o > ${num(c.peligro_max, k)}` : c.peligro_max != null ? `> ${num(c.peligro_max, k)}` : "—"}</td>
                      <td>{o2 ? `${c.riesgo_bajo} / ${c.riesgo_alto}` : c.riesgo}</td>
                      <td className="tenue">{c.norma}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="tenue nota">
            Temperatura efectiva (Dec. 1886 art. 217): te = 0,7 × temperatura húmeda + 0,3 × temperatura seca − velocidad del aire.
            Permanencia máxima: 28 °C sin límite, 29 °C 6 h, 30 °C 4 h, 31 °C 2 h, 32 °C ninguna.
          </p>
        </section>
      )}

      <section className="panel">
        <h3 className="panel__titulo">Qué puede ver cada rol</h3>
        <dl className="definiciones">
          {ROLES.map(([r, d]) => (<div key={r}><dt>{r}</dt><dd>{d}</dd></div>))}
        </dl>
      </section>
    </div>
  );
}
