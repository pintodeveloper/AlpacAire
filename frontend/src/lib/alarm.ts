// Sirena de evacuación con Web Audio (no necesita archivos de sonido).
let ctx: AudioContext | null = null;
let gain: GainNode | null = null;
let osc: OscillatorNode | null = null;
let timer: number | null = null;
let silenciadaHasta = 0;

function contexto() {
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new AC();
  }
  return ctx;
}

/** Llamar desde un clic (p. ej. el botón de ingresar) para que el navegador permita el sonido. */
export function desbloquearAudio() {
  try { void contexto().resume(); } catch { /* sin audio */ }
}

export const audioListo = () => !!ctx && ctx.state === "running";

export function sonando() { return timer !== null; }

export function iniciarSirena() {
  if (timer !== null || Date.now() < silenciadaHasta) return;
  let c: AudioContext;
  try { c = contexto(); } catch { return; }
  gain = c.createGain();
  gain.gain.value = 0.0001;
  gain.connect(c.destination);
  const o = c.createOscillator();
  osc = o;
  o.type = "sawtooth";
  o.connect(gain);
  o.start();
  gain.gain.exponentialRampToValueAtTime(0.18, c.currentTime + 0.1);
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
}

export function detenerSirena() {
  if (timer !== null) window.clearInterval(timer);
  timer = null;
  try { osc?.stop(); } catch { /* ya detenido */ }
  osc = null;
  gain?.disconnect();
  gain = null;
}

export function silenciar(ms: number) {
  silenciadaHasta = Date.now() + ms;
  detenerSirena();
}

export const silenciadaRestante = () => Math.max(0, silenciadaHasta - Date.now());
