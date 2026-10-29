"""Generador de lecturas realistas para la demo (sin sensores físicos)."""
import random

from .thresholds import temperatura_efectiva

BASE = {
    "temp_seca": (25.5, 0.15),
    "temp_humeda": (22.5, 0.12),
    "velocidad_aire": (1.0, 0.04),
    "humedad_relativa": (78.0, 0.6),
    "co": (5.0, 0.4),
    "ch4": (0.2, 0.015),
    "o2": (20.8, 0.03),
    "co2": (1100.0, 40.0),
    "h2s": (0.15, 0.02),
    "no2": (0.05, 0.005),
}

LIMITES = {
    "velocidad_aire": (0.1, 4), "humedad_relativa": (30, 100), "co": (0, 500), "ch4": (0, 5),
    "o2": (15, 25), "co2": (300, 50000), "h2s": (0, 50), "no2": (0, 5),
}

# Cuánto puede diferir la línea base de un frente respecto a otro.
VARIACION = {"o2": 0.004, "temp_seca": 0.03, "temp_humeda": 0.03, "humedad_relativa": 0.04}

# Escenarios: qué frente (índice) se altera y hacia qué valores.
ESCENARIOS = {
    "normal": {},
    "alerta": {1: {"ch4": 0.72, "temp_seca": 31.0, "temp_humeda": 29.0, "velocidad_aire": 0.35,
                   "humedad_relativa": 93.0}},
    "peligro": {1: {"ch4": 0.72},
                2: {"ch4": 1.45, "co": 62.0, "o2": 19.2}},
}


class Generador:
    def __init__(self, n_frentes, semilla=None):
        self.rnd = random.Random(semilla)
        self.estado = []
        for i in range(n_frentes):
            # cada frente tiene un "carácter" propio
            self.estado.append({k: m * (1 + self.rnd.uniform(-1, 1) * VARIACION.get(k, 0.06))
                                for k, (m, _s) in BASE.items()})
        self.bases = [dict(e) for e in self.estado]

    def paso(self, i, objetivos=None, velocidad=0.18):
        e, base = self.estado[i], self.bases[i]
        objetivos = objetivos or {}
        for k, (_m, sigma) in BASE.items():
            meta = objetivos.get(k, base[k])
            e[k] += velocidad * (meta - e[k]) + self.rnd.gauss(0, sigma)
            lo, hi = LIMITES.get(k, (-50, 80))
            e[k] = min(hi, max(lo, e[k]))
        e["temp_humeda"] = min(e["temp_humeda"], e["temp_seca"] - 0.3)
        lectura = {k: round(v, 3 if k in ("ch4", "h2s", "no2") else 2) for k, v in e.items()}
        lectura["temp_efectiva"] = temperatura_efectiva(
            lectura["temp_humeda"], lectura["temp_seca"], lectura["velocidad_aire"])
        return lectura
