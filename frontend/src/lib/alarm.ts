// Sirena de evacuación con Web Audio (no necesita archivos de sonido).
//
// Todo el sonido pasa por un único nodo de volumen maestro. Silenciar baja ese
// volumen a cero, detiene el oscilador y suspende el AudioContext, así no queda
// ningún sonido colgado aunque haya varias llamadas seguidas.

const CLAVE_SILENCIO = "alpacaire.silencioHasta";

let ctx: AudioContext | null = null;
let maestro: GainNode | null = null;
let osc: OscillatorNode | null = null;
let timer: number | null = null;
let reanudar: number | null = null;
let quiereSonar = false; // el estado de la mina pide sirena
const oyentes = new Set<() => void>();

function avisar() { oyentes.forEach((fn) => fn()); }

/** Para que React se vuelva a pintar cuando cambia el estado de la sirena. */
export function suscribir(fn: () => void) {
  oyentes.add(fn);
  return () => { oyentes.delete(fn); };
}

function leerSilencio(): number {
  try { return Number(sessionStorage.getItem(CLAVE_SILENCIO)) || 0; } catch { return 0; }
}
let silenciadaHasta = leerSilencio();

function guardarSilencio(t: number) {
  silenciadaHasta = t;
  try { t ? sessionStorage.setItem(CLAVE_SILENCIO, String(t)) : sessionStorage.removeItem(CLAVE_SILENCIO); } catch { /* sin almacenamiento */ }
}

function contexto() {
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new AC();
    maestro = ctx.createGain();
    maestro.gain.value = 0;
    maestro.connect(ctx.destination);
    ctx.onstatechange = avisar;
  }
  return ctx;
}

/** Llamar desde un clic (p. ej. el botón de ingresar) para que el navegador permita el sonido. */
export function desbloquearAudio() {
  try {
    const c = contexto();
    void c.resume().then(() => { if (quiereSonar) encender(); avisar(); });
  } catch { /* sin audio */ }
}

export const audioListo = () => !!ctx && ctx.state === "running";
export const silenciadaRestante = () => Math.max(0, silenciadaHasta - Date.now());
export const sonando = () => timer !== null;

function encender() {
  if (timer !== null || silenciadaRestante() > 0) return;
  let c: AudioContext;
  try { c = contexto(); } catch { return; }
  if (c.state === "suspended") void c.resume().catch(() => {});
  const o = c.createOscillator();
  o.type = "sawtooth";
  o.connect(maestro!);
  o.start();
  osc = o;
  maestro!.gain.cancelScheduledValues(c.currentTime);
  maestro!.gain.setValueAtTime(0.0001, c.currentTime);
  maestro!.gain.exponentialRampToValueAtTime(0.18, c.currentTime + 0.1);
  let alto = false;
  const ciclo = () => {
    const t = c.currentTime;
    o.frequency.cancelScheduledValues(t);
    o.frequency.setValueAtTime(alto ? 1250 : 650, t);
    o.frequency.linearRampToValueAtTime(alto ? 650 : 1250, t + 0.55);
    alto = !alto;
  };
  ciclo();
  timer = window.setInterval(ciclo, 550);
  avisar();
}

function apagar() {
  if (timer !== null) window.clearInterval(timer);
  timer = null;
  if (ctx && maestro) {
    maestro.gain.cancelScheduledValues(ctx.currentTime);
    maestro.gain.setValueAtTime(0, ctx.currentTime);
  }
  try { osc?.stop(); } catch { /* ya detenido */ }
  osc?.disconnect();
  osc = null;
  avisar();
}

/** La mina está en peligro: la sirena debe sonar (salvo que esté silenciada). */
export function iniciarSirena() {
  quiereSonar = true;
  encender();
}

/** La mina salió del peligro. */
export function detenerSirena() {
  quiereSonar = false;
  apagar();
}

/** Silencia la sirena durante `ms`; al terminar vuelve a sonar si sigue el peligro. */
export function silenciar(ms: number) {
  guardarSilencio(Date.now() + ms);
  apagar();
  if (ctx && ctx.state === "running") void ctx.suspend().catch(() => {});
  if (reanudar !== null) window.clearTimeout(reanudar);
  reanudar = window.setTimeout(reactivar, ms + 50);
  avisar();
}

/** Quita el silencio antes de tiempo. */
export function reactivar() {
  guardarSilencio(0);
  if (reanudar !== null) window.clearTimeout(reanudar);
  reanudar = null;
  if (ctx && ctx.state === "suspended") void ctx.resume().then(() => { if (quiereSonar) encender(); avisar(); }).catch(() => {});
  else if (quiereSonar) encender();
  avisar();
}

// Si se recargó la página con un silencio vigente, programar su final.
if (silenciadaRestante() > 0) reanudar = window.setTimeout(reactivar, silenciadaRestante() + 50);
