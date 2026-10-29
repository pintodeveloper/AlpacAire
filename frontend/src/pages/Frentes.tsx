import { RuleBar } from "../components/RuleBar";
import { hace, num } from "../lib/format";
import { useSesion } from "../lib/session";
import { VARS_PRINCIPALES } from "../lib/types";

const NIVEL_TXT: Record<string, string> = { normal: "Normal", alerta: "Alerta", peligro: "Peligro", sin_datos: "Sin datos" };

export default function Frentes() {
  const { estado, umbrales, errorEstado } = useSesion();
  if (!estado || !umbrales) return <p className="tenue">{errorEstado ?? "Consultando los sensores…"}</p>;

  return (
    <div className="pagina">
      <div className="pagina__cabeza">
        <h2>Frentes</h2>
        <p className="tenue">Valores en tiempo real de cada frente. La franja verde es el rango permitido por el Decreto 1886 de 2015.</p>
      </div>
      <div className="frentes">
        {estado.frentes.map((f) => {
          const v = f.variables;
          return (
            <article key={f.id} className={`frente frente--${f.nivel}`}>
              <header className="frente__cabeza">
                <div>
                  <h3>{f.nombre} <span className="frente__codigo">{f.codigo}</span></h3>
                  <p>{f.descripcion}, {f.profundidad_m} m de profundidad, {f.personas} personas</p>
                </div>
                <span className={`chip chip--${f.nivel}`}>{NIVEL_TXT[f.nivel]}</span>
              </header>
              {v.temp_seca && (
                <p className="frente__te">
                  Seca {num(v.temp_seca.valor)} °C, húmeda {num(v.temp_humeda?.valor)} °C,
                  aire {num(v.velocidad_aire?.valor)} m/s. Lectura {hace(f.edad_s)}.
                </p>
              )}
              <div className="frente__reglas">
                {VARS_PRINCIPALES.map((k) => (
                  <RuleBar key={k} clave={k} cfg={umbrales.variables[k]} dato={v[k]} />
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
