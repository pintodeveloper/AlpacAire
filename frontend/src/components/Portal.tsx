import type { ReactNode } from "react";

/** El arco del túnel del logo, usado como marco del estado de la mina. */
export function Portal({ nivel, children }: { nivel: string; children: ReactNode }) {
  return (
    <div className={`portal portal--${nivel}`}>
      <svg className="portal__arco" viewBox="0 0 200 220" aria-hidden="true" preserveAspectRatio="none">
        <path d="M14 220 V100 a86 86 0 0 1 172 0 V220" className="portal__marco" />
        <path d="M34 220 V102 a66 66 0 0 1 132 0 V220 Z" className="portal__boca" />
      </svg>
      <div className="portal__icono">{children}</div>
    </div>
  );
}
