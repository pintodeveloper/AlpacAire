import type { ReactNode } from "react";
import { Link } from "../lib/router";

/** Encabezado común de los documentos y formatos. */
export default function Seccion({ titulo, meta, descripcion, acciones, children, ancho = false }: {
  titulo: string; meta?: string; descripcion?: string; acciones?: ReactNode; children: ReactNode; ancho?: boolean;
}) {
  return (
    <div className={`pagina doc ${ancho ? "" : "pagina--estrecha"}`}>
      <Link to="/documentos" className="volver no-imprimir">Volver a Documentos</Link>
      <div className="pagina__cabeza pagina__cabeza--fila">
        <div>
          <h2>{titulo}</h2>
          {meta && <p className="doc__meta">{meta}</p>}
          {descripcion && <p className="tenue">{descripcion}</p>}
        </div>
        {acciones && <div className="doc__acciones no-imprimir">{acciones}</div>}
      </div>
      {children}
    </div>
  );
}

export function Nota({ children, tipo = "nota" }: { children: ReactNode; tipo?: "nota" | "clave" }) {
  return <p className={`doc-nota doc-nota--${tipo}`}>{children}</p>;
}
