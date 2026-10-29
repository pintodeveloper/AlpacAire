/** Isotipo de AlpacAire: montañas, la "A", el túnel con rieles y la señal de los sensores. */
export function LogoMark({ size = 40, color = "currentColor", bg = "var(--superficie)", title = "AlpacAire" }: {
  size?: number; color?: string; bg?: string; title?: string;
}) {
  return (
    <svg width={size} height={(size * 200) / 240} viewBox="0 0 240 200" role="img" aria-label={title}>
      <g stroke={color} strokeWidth="7" strokeLinecap="round" fill="none">
        <path d="M119 36a38 38 0 0 1 44 0" />
        <path d="M127 48a24 24 0 0 1 28 0" />
        <path d="M134 59a11 11 0 0 1 14 0" />
      </g>
      <g stroke={color} strokeWidth="6" strokeLinejoin="round" fill="none">
        <path d="M16 170 L76 70 L112 130" />
        <path d="M168 104 L186 76 L228 170" />
      </g>
      <path fill={color} fillRule="evenodd"
        d="M100 170 L130 72 L152 72 L190 170 L164 170 L157 150 L126 150 L120 170 Z M131 130 L151 130 L141 98 Z" />
      <path d="M40 170 V138 a32 32 0 0 1 64 0 V170" stroke={color} strokeWidth="6" fill={bg} />
      <path d="M51 170 V139 a21 21 0 0 1 42 0 V170 Z" fill={color} />
      <path d="M65 170 V156 a7 7 0 0 1 14 0 V170 Z" fill={bg} />
      <g stroke={color} strokeWidth="3.5" strokeLinecap="round">
        <path d="M69 170 L58 190" /><path d="M76 170 L92 190" />
        <path d="M65 177 h17" /><path d="M62 184 h24" />
      </g>
      <path d="M10 170 H232" stroke={color} strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}
