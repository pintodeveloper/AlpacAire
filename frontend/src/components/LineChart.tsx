import { useEffect, useMemo, useRef, useState } from "react";
import { diaHora, hora, num } from "../lib/format";

export interface Serie { nombre: string; color: string; puntos: { t: number; v: number | null }[] }
export interface Umbral { valor: number; tipo: "alerta" | "peligro" }

const M = { top: 12, right: 14, bottom: 26, left: 52 };

function ticks(min: number, max: number, n = 4) {
  const paso0 = (max - min) / n;
  const mag = Math.pow(10, Math.floor(Math.log10(paso0 || 1)));
  const paso = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= paso0) ?? paso0;
  const out: number[] = [];
  for (let x = Math.ceil(min / paso) * paso; x <= max + 1e-9; x += paso) out.push(+x.toFixed(6));
  return out;
}

export function LineChart({ series, umbrales, unidad, clave, alto = 190, desde, hasta }: {
  series: Serie[]; umbrales: Umbral[]; unidad: string; clave: string; alto?: number; desde: number; hasta: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [ancho, setAncho] = useState(600);
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([e]) => setAncho(Math.max(280, e.contentRect.width)));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  const { yMin, yMax } = useMemo(() => {
    const vals = series.flatMap((s) => s.puntos.map((p) => p.v)).filter((v): v is number => v !== null);
    // Mostrar el umbral de alerta siempre; el de peligro solo si los datos se acercan.
    const alerta = umbrales.filter((u) => u.tipo === "alerta").map((u) => u.valor);
    let mn = Math.min(...vals, ...alerta), mx = Math.max(...vals, ...alerta);
    const peligro = umbrales.filter((u) => u.tipo === "peligro").map((u) => u.valor);
    peligro.forEach((p) => { if (p <= mx * 1.25 && p >= mn * 0.8) { mn = Math.min(mn, p); mx = Math.max(mx, p); } });
    if (!isFinite(mn)) { mn = 0; mx = 1; }
    const pad = (mx - mn) * 0.12 || Math.abs(mx) * 0.1 || 1;
    return { yMin: mn - pad, yMax: mx + pad };
  }, [series, umbrales]);

  const w = ancho - M.left - M.right;
  const h = alto - M.top - M.bottom;
  const x = (t: number) => M.left + ((t - desde) / (hasta - desde || 1)) * w;
  const y = (v: number) => M.top + (1 - (v - yMin) / (yMax - yMin)) * h;

  const path = (s: Serie) => {
    let d = "", pen = false;
    for (const p of s.puntos) {
      if (p.v === null) { pen = false; continue; }
      d += `${pen ? "L" : "M"}${x(p.t).toFixed(1)},${y(p.v).toFixed(1)}`;
      pen = true;
    }
    return d;
  };

  const yt = ticks(yMin, yMax);
  const nX = Math.max(2, Math.floor(w / 110));
  const xt = Array.from({ length: nX + 1 }, (_, i) => desde + ((hasta - desde) * i) / nX);
  const corto = hasta - desde <= 36 * 3600_000;
  const etiqueta = (t: number) => (corto ? hora(new Date(t)) : diaHora(t));

  const cercanos = hover === null ? [] : series.map((s) => {
    let mejor = s.puntos[0], dist = Infinity;
    for (const p of s.puntos) { const dd = Math.abs(p.t - hover); if (dd < dist) { dist = dd; mejor = p; } }
    return { s, p: mejor };
  }).filter((c) => c.p);

  return (
    <div className="grafica" ref={ref}>
      <svg width={ancho} height={alto} role="img" aria-label={`Gráfica de ${clave}`}
        onMouseMove={(e) => {
          const r = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
          const px = e.clientX - r.left;
          if (px < M.left || px > M.left + w) return setHover(null);
          setHover(desde + ((px - M.left) / w) * (hasta - desde));
        }}
        onMouseLeave={() => setHover(null)}>
        {yt.map((t) => (
          <g key={t}>
            <line x1={M.left} x2={M.left + w} y1={y(t)} y2={y(t)} className="grafica__rejilla" />
            <text x={M.left - 8} y={y(t)} className="grafica__eje" textAnchor="end" dominantBaseline="middle">
              {num(t, clave)}
            </text>
          </g>
        ))}
        {xt.map((t, i) => (
          <text key={i} x={x(t)} y={alto - 6} className="grafica__eje"
            textAnchor={i === 0 ? "start" : i === xt.length - 1 ? "end" : "middle"}>{etiqueta(t)}</text>
        ))}
        {umbrales.filter((u) => u.valor >= yMin && u.valor <= yMax).map((u, i) => (
          <g key={i}>
            <line x1={M.left} x2={M.left + w} y1={y(u.valor)} y2={y(u.valor)} className={`grafica__umbral grafica__umbral--${u.tipo}`} />
            <text x={M.left + w - 2} y={y(u.valor) - 4} textAnchor="end" className={`grafica__umbral-txt grafica__umbral-txt--${u.tipo}`}>
              {u.tipo === "peligro" ? "Peligro" : "Alerta"} {num(u.valor, clave)}
            </text>
          </g>
        ))}
        {series.map((s) => (
          <path key={s.nombre} d={path(s)} fill="none" stroke={s.color} strokeWidth={1.75} strokeLinejoin="round" />
        ))}
        {hover !== null && (
          <g>
            <line x1={x(hover)} x2={x(hover)} y1={M.top} y2={M.top + h} className="grafica__cursor" />
            {cercanos.map(({ s, p }) => p.v !== null && (
              <circle key={s.nombre} cx={x(p.t)} cy={y(p.v)} r={3.5} fill={s.color} stroke="var(--superficie)" strokeWidth={1.5} />
            ))}
          </g>
        )}
      </svg>
      {hover !== null && cercanos.length > 0 && (
        <div className="grafica__tip" style={{ left: Math.min(x(hover) + 12, ancho - 190) }}>
          <strong>{diaHora(cercanos[0].p.t)}</strong>
          {cercanos.map(({ s, p }) => (
            <span key={s.nombre}><i style={{ background: s.color }} />{s.nombre}: {num(p.v, clave)} {unidad}</span>
          ))}
        </div>
      )}
    </div>
  );
}
