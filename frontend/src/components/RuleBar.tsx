import { num } from "../lib/format";
import type { VarCfg, VarEstado } from "../lib/types";

/** Regla de medición: muestra el valor dentro de las franjas legales (segura, alerta, peligro). */
export function RuleBar({ clave, cfg, dato }: { clave: string; cfg: VarCfg; dato?: VarEstado }) {
  const [lo, hi] = cfg.escala;
  const pct = (v: number) => Math.min(100, Math.max(0, ((v - lo) / (hi - lo)) * 100));
  const zonas: { desde: number; hasta: number; tipo: string }[] = [];

  if (clave === "o2") {
    const { peligro_min = lo, alerta_min = lo, alerta_max = hi, peligro_max = hi } = cfg;
    zonas.push(
      { desde: lo, hasta: peligro_min, tipo: "peligro" },
      { desde: peligro_min, hasta: alerta_min, tipo: "alerta" },
      { desde: alerta_min, hasta: alerta_max!, tipo: "normal" },
      { desde: alerta_max!, hasta: peligro_max!, tipo: "alerta" },
      { desde: peligro_max!, hasta: hi, tipo: "peligro" },
    );
  } else {
    const a = cfg.alerta_max ?? hi;
    const p = cfg.peligro_max ?? hi;
    zonas.push({ desde: lo, hasta: a, tipo: "normal" }, { desde: a, hasta: p, tipo: "alerta" });
    if (cfg.peligro_max != null) zonas.push({ desde: p, hasta: hi, tipo: "peligro" });
  }

  const v = dato?.valor ?? null;
  const nivel = dato?.nivel ?? "normal";
  const limite =
    clave === "o2" ? `${num(cfg.peligro_min, clave)} a ${num(cfg.peligro_max, clave)} ${cfg.unidad}`
    : cfg.peligro_max != null
      ? `alerta sobre ${num(cfg.alerta_max, clave)}, peligro sobre ${num(cfg.peligro_max, clave)} ${cfg.unidad}`
      : `alerta sobre ${num(cfg.alerta_max, clave)} ${cfg.unidad}`;

  return (
    <div className={`regla regla--${nivel}`}>
      <div className="regla__cabeza">
        <span className="regla__nombre">{cfg.nombre}</span>
        <span className="regla__valor">
          {num(v, clave)}<small>{cfg.unidad}</small>
        </span>
      </div>
      <div className="regla__barra" role="img"
        aria-label={`${cfg.nombre}: ${num(v, clave)} ${cfg.unidad}, nivel ${nivel}. Límite ${limite}`}>
        {zonas.filter((z) => z.hasta > z.desde).map((z, i) => (
          <span key={i} className={`zona zona--${z.tipo}`}
            style={{ left: `${pct(z.desde)}%`, width: `${pct(z.hasta) - pct(z.desde)}%` }} />
        ))}
        {v !== null && <span className="regla__marca" style={{ left: `${pct(v)}%` }} />}
      </div>
      <div className="regla__pie">
        <span>{dato?.riesgo ? `${dato.riesgo}. ` : ""}{clave === "o2" ? `Rango seguro ${limite}` : limite.charAt(0).toUpperCase() + limite.slice(1)}</span>
      </div>
    </div>
  );
}
