import type { SupuestosCB } from "./contenido";

/** Equivalente a PV(tasa, n, -pago) de Excel: valor presente de una anualidad. */
export const vp = (tasa: number, n: number, pago: number) =>
  tasa === 0 ? pago * n : (pago * (1 - Math.pow(1 + tasa, -n))) / tasa;

/** Reproduce las fórmulas de la hoja "Análisis" del archivo DC-AC. */
export function calcularCB(s: SupuestosCB) {
  const pctMuertesExp = s.muertesExp / s.muertesTotal;
  const pctEventosExp = s.eventosExp / s.emergencias;
  const muertesPorEvento = s.muertesExp / s.eventosExp;
  const muertesExpAnio = s.muertesExp / s.anosANM;
  const muertesTotalAnio = s.muertesTotal / s.anosANM;

  const pensionAnual = s.smmlv * s.pension * s.mesadas;
  const vpPension = vp(s.tasa, s.anosPension, pensionAnual);
  const valorMuerte = s.valoracion === "Social" ? s.vev : vpPension;

  const costo = (usd: number) => {
    const cop = usd * s.trm;
    const mant = cop * s.mantenimiento;
    const vpMant = vp(s.tasa, s.horizonte, mant);
    return { usd, cop, mant, vpMant, total: cop + vpMant, detectores: usd / s.detectorUSD };
  };
  const prototipo = costo(s.invPrototipoUSD);
  const sistema = costo(s.invSistemaUSD);

  const factor = vp(s.tasa, s.horizonte, 1);
  const escenarios = [
    { nombre: "Promedio nacional", muertes: muertesPorEvento },
    { nombre: "Evento tipo La Ciscuda", muertes: s.muertesCiscuda },
    { nombre: "Evento tipo La Chapa", muertes: s.muertesChapa },
  ].map((e) => {
    const perdida = e.muertes * valorMuerte;
    const beneficioAnual = perdida * s.probabilidad * s.efectividad;
    const vpBeneficio = vp(s.tasa, s.horizonte, beneficioAnual);
    return {
      ...e, perdida, beneficioAnual, vpBeneficio,
      bcSistema: vpBeneficio / sistema.total, vpnSistema: vpBeneficio - sistema.total,
      bcPrototipo: vpBeneficio / prototipo.total, vpnPrototipo: vpBeneficio - prototipo.total,
      equilibrioSistema: sistema.total / (factor * perdida * s.efectividad),
      equilibrioPrototipo: prototipo.total / (factor * perdida * s.efectividad),
    };
  });
  const probabilidades = [0.005, 0.01, 0.02, 0.05, 0.1];
  const sensibilidad = probabilidades.map((p) => ({
    p, bc: escenarios.map((e) => vp(s.tasa, s.horizonte, e.perdida * p * s.efectividad) / sistema.total),
  }));

  return {
    pctMuertesExp, pctEventosExp, muertesPorEvento, muertesExpAnio, muertesTotalAnio,
    pensionAnual, vpPension, valorMuerte, prototipo, sistema, escenarios, sensibilidad,
  };
}
