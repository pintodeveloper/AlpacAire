type P = { size?: number };

export const IconCheck = ({ size = 64 }: P) => (
  <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
    <path d="M16 33 L28 45 L49 21" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconWarning = ({ size = 64 }: P) => (
  <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
    <path d="M32 8 L59 55 H5 Z" fill="none" stroke="currentColor" strokeWidth="5.5" strokeLinejoin="round" />
    <path d="M32 24 V39" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
    <circle cx="32" cy="47.5" r="3.6" fill="currentColor" />
  </svg>
);

/** Baliza de alarma: la luz giratoria de las minas. */
export const IconAlarm = ({ size = 64 }: P) => (
  <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
    <path d="M18 50 V34 a14 14 0 0 1 28 0 V50" fill="none" stroke="currentColor" strokeWidth="5.5" />
    <path d="M12 52 H52" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
    <path d="M32 6 V13 M9 15 L14 20 M55 15 L50 20 M3 34 H9 M55 34 H61" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
    <path d="M26 40 V34 a6 6 0 0 1 6 -6" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

export const IconSignal = ({ size = 64 }: P) => (
  <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
    <path d="M14 28a26 26 0 0 1 36 0 M22 37a14 14 0 0 1 20 0" fill="none" stroke="currentColor" strokeWidth="5.5" strokeLinecap="round" />
    <circle cx="32" cy="46" r="4" fill="currentColor" />
    <path d="M10 10 L54 54" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
  </svg>
);

export const Chevron = ({ abierto }: { abierto: boolean }) => (
  <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"
    style={{ transform: abierto ? "none" : "rotate(-90deg)", transition: "transform .15s" }}>
    <path d="M1 3 L5 8 L9 3 Z" fill="currentColor" />
  </svg>
);
