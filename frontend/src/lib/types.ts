export type Nivel = "normal" | "alerta" | "peligro" | "sin_datos";

export interface Usuario {
  id: number;
  usuario: string;
  nombre: string;
  rol: string;
  rol_nombre: string;
  permisos: string[];
}

export interface VarCfg {
  nombre: string;
  corto: string;
  unidad: string;
  alerta_max?: number | null;
  peligro_max?: number | null;
  alerta_min?: number;
  peligro_min?: number;
  escala: [number, number];
  riesgo?: string;
  riesgo_bajo?: string;
  riesgo_alto?: string;
  norma: string;
}

export interface Umbrales {
  variables: Record<string, VarCfg>;
  informativas: Record<string, { nombre: string; unidad: string }>;
  permanencia_te: [number, string][];
  mina: string;
}

export interface VarEstado {
  valor: number | null;
  nivel: "normal" | "alerta" | "peligro" | "info";
  riesgo: string | null;
}

export interface Accion {
  variable: string | null;
  nivel: "alerta" | "peligro";
  texto: string;
  frente?: string;
  frente_id?: number;
}

export interface FrenteEstado {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  profundidad_m: number;
  personas: number;
  nivel: Nivel;
  lectura_ts?: string;
  edad_s?: number;
  variables: Record<string, VarEstado>;
  acciones: Accion[];
}

export interface Estado {
  nivel: "normal" | "alerta" | "peligro";
  generado: string;
  frentes: FrenteEstado[];
  acciones: Accion[];
}

export interface Persona {
  id: number;
  tipo: "operario" | "obrero";
  nombre: string;
  documento: string | null;
  cargo: string | null;
  maquina: string | null;
  turno: string | null;
  frente_id: number | null;
  frente: string | null;
  activo: boolean;
}

export interface Frente {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  profundidad_m: number;
}

export interface Observacion {
  id: number;
  texto: string;
  ts: string;
  leida: boolean;
  autor: string;
  autor_rol: string;
}

export const VARS_PRINCIPALES = [
  "temp_efectiva",
  "humedad_relativa",
  "co",
  "ch4",
  "o2",
  "co2",
  "h2s",
  "no2",
] as const;
