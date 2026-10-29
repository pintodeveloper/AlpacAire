/** Fondo decorativo de hexágonos (inspirado en el patrón de referencia) con la paleta pizarra. */
type Tipo = "solido" | "tinte" | "linea" | "concentrico" | "partido" | "vacio";

const R = 46; // radio del hexágono
const W = Math.sqrt(3) * R; // ancho (hexágono con punta arriba)

function centro(c: number, f: number) {
  return { x: c * W + (f % 2 ? W / 2 : 0), y: f * R * 1.5 };
}

function hex(cx: number, cy: number, r: number) {
  return Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 180) * (60 * i - 90);
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
  }).join(" ");
}

function Celda({ c, f, tipo }: { c: number; f: number; tipo: Tipo }) {
  const { x, y } = centro(c, f);
  const r = R - 3;
  switch (tipo) {
    case "solido":
      return <polygon points={hex(x, y, r)} className="hx hx--solido" />;
    case "tinte":
      return <polygon points={hex(x, y, r)} className="hx hx--tinte" />;
    case "linea":
      return <polygon points={hex(x, y, r)} className="hx hx--linea" />;
    case "vacio":
      return <polygon points={hex(x, y, r * 0.35)} className="hx hx--linea" />;
    case "concentrico":
      return (
        <g className="hx hx--concentrico">
          {[1, 0.8, 0.6, 0.4, 0.2].map((k) => <polygon key={k} points={hex(x, y, r * k)} />)}
        </g>
      );
    case "partido": {
      const p = hex(x, y, r).split(" ");
      return (
        <g>
          <polygon points={hex(x, y, r)} className="hx hx--tinte" />
          <polygon points={`${p[0]} ${p[1]} ${p[2]} ${p[3]} ${x},${y}`} className="hx hx--solido" />
        </g>
      );
    }
  }
}

// Racimo de la esquina superior izquierda: [columna, fila, tipo]
const ARRIBA: [number, number, Tipo][] = [
  [0, 0, "solido"], [1, 0, "concentrico"], [2, 0, "tinte"], [3, 0, "linea"],
  [0, 1, "linea"], [1, 1, "concentrico"], [2, 1, "solido"],
  [0, 2, "tinte"], [1, 2, "partido"], [2, 2, "vacio"],
  [0, 3, "linea"],
];

// Racimo de la esquina inferior derecha, contado desde la esquina
const ABAJO: [number, number, Tipo][] = [
  [0, 0, "solido"], [1, 0, "tinte"], [2, 0, "concentrico"], [3, 0, "solido"], [4, 0, "linea"],
  [0, 1, "concentrico"], [1, 1, "solido"], [2, 1, "tinte"], [3, 1, "linea"],
  [0, 2, "tinte"], [1, 2, "partido"], [2, 2, "vacio"],
  [0, 3, "linea"], [1, 3, "solido"],
  [0, 4, "vacio"],
];

/** Racimo suelto (para el panel de estado). Usa currentColor. */
export function HexRacimo({ className }: { className?: string }) {
  const ancho = 6 * W, alto = 5 * R * 1.5 + R;
  return (
    <svg className={className} aria-hidden="true" width={ancho} height={alto} viewBox={`${-W / 2} ${-R} ${ancho} ${alto}`}>
      {ABAJO.map(([c, f, t]) => <Celda key={`${c}-${f}`} c={c} f={f} tipo={t} />)}
    </svg>
  );
}

export function HexFondo() {
  const ancho = 6 * W, alto = 5 * R * 1.5 + R;
  return (
    <div className="fondo-hex" aria-hidden="true">
      <svg className="fondo-hex__arriba" width={ancho} height={alto} viewBox={`${-W / 2} ${-R} ${ancho} ${alto}`}>
        {ARRIBA.map(([c, f, t]) => <Celda key={`${c}-${f}`} c={c} f={f} tipo={t} />)}
      </svg>
      <svg className="fondo-hex__abajo" width={ancho} height={alto} viewBox={`${-W / 2} ${-R} ${ancho} ${alto}`}>
        {ABAJO.map(([c, f, t]) => <Celda key={`${c}-${f}`} c={c} f={f} tipo={t} />)}
      </svg>
    </div>
  );
}
