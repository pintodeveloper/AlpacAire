export const TZ = "America/Bogota";

export function num(v: number | null | undefined, variable?: string): string {
  if (v === null || v === undefined || Number.isNaN(v)) return "—";
  const dec =
    variable && ["ch4", "h2s", "no2"].includes(variable) ? 2
    : variable === "co2" ? 0
    : 1;
  return v.toLocaleString("es-CO", { minimumFractionDigits: dec, maximumFractionDigits: dec });
}

export const fechaHora = (d: Date | string) =>
  new Date(d).toLocaleString("es-CO", {
    timeZone: TZ, day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true,
  }).replace(",", " -");

export const hora = (d: Date | string, seg = false) =>
  new Date(d).toLocaleTimeString("es-CO", {
    timeZone: TZ, hour: "2-digit", minute: "2-digit", ...(seg ? { second: "2-digit" } : {}), hour12: true,
  });

export const diaHora = (d: Date | number) =>
  new Date(d).toLocaleString("es-CO", { timeZone: TZ, day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false });

export function hace(seg?: number): string {
  if (seg === undefined) return "";
  if (seg < 60) return `hace ${seg} s`;
  if (seg < 3600) return `hace ${Math.floor(seg / 60)} min`;
  return `hace ${Math.floor(seg / 3600)} h`;
}

export const hoyISO = () =>
  new Date().toLocaleDateString("en-CA", { timeZone: TZ }); // AAAA-MM-DD

export const iniciales = (nombre: string) =>
  nombre.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]!.toUpperCase()).join("");
