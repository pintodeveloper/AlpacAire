"""Umbrales de evaluación de la atmósfera minera.

Base normativa: Decreto 1886 de 2015 (Reglamento de Seguridad en las Labores
Mineras Subterráneas, Colombia), modificado por el Decreto 944 de 2022.

- Metano (art. 53): máximo 1,0 % en frentes y retornos principales; al
  superarlo se suspenden trabajos y se evacua. Sobre 2 % solo entra salvamento.
  El 0,5 % se usa como pre-alarma (art. 53 parágrafo 2 lo toma como límite del
  aire que puede llegar a un frente).
- Oxígeno (art. 7, aire respirable): mínimo 19,5 %, máximo 23,5 % en volumen.
- Temperatura efectiva (arts. 217 y 218): te = 0,7·th + 0,3·ts − V.
  28 °C sin limitación, 29 °C → 6 h, 30 °C → 4 h, 31 °C → 2 h, 32 °C → 0 h.
  Sobre 31 °C solo cuadrillas de salvamento.
- Gases tóxicos (arts. 7 y 74): en Colombia rigen los TLV de la ACGIH.
  Alerta = TLV-TWA (8 h). Peligro = TLV-STEL o, si no hay STEL, el criterio de
  excursión de la ACGIH.

Todos los valores son configurables en este archivo.
"""

# nivel: 0 = normal, 1 = alerta, 2 = peligro
NORMAL, ALERTA, PELIGRO = 0, 1, 2
NIVEL_NOMBRE = {NORMAL: "normal", ALERTA: "alerta", PELIGRO: "peligro"}

VARIABLES = {
    "temp_efectiva": {
        "nombre": "Temperatura efectiva",
        "corto": "T. efectiva",
        "unidad": "°C",
        "alerta_max": 28.0,
        "peligro_max": 31.0,
        "escala": [20, 34],
        "riesgo": "Estrés térmico",
        "norma": "Dec. 1886/2015 arts. 217-218",
    },
    "humedad_relativa": {
        "nombre": "Humedad relativa",
        "corto": "Humedad",
        "unidad": "%",
        "alerta_max": 90.0,
        "peligro_max": None,
        "escala": [40, 100],
        "riesgo": "Aumenta el estrés térmico",
        "norma": "Referencia operativa (el decreto no fija límite)",
    },
    "co": {
        "nombre": "Monóxido de carbono",
        "corto": "CO",
        "unidad": "ppm",
        "alerta_max": 25.0,
        "peligro_max": 50.0,
        "escala": [0, 80],
        "riesgo": "Asfixia",
        "norma": "TLV-TWA ACGIH 25 ppm (Dec. 1886 art. 74)",
    },
    "ch4": {
        "nombre": "Metano",
        "corto": "CH₄",
        "unidad": "%",
        "alerta_max": 0.5,
        "peligro_max": 1.0,
        "escala": [0, 2],
        "riesgo": "Posible explosión inminente",
        "norma": "Dec. 1886/2015 art. 53 (máx. 1,0 %)",
    },
    "o2": {
        "nombre": "Oxígeno",
        "corto": "O₂",
        "unidad": "%",
        "alerta_min": 20.0,
        "peligro_min": 19.5,
        "alerta_max": 22.5,
        "peligro_max": 23.5,
        "escala": [17, 25],
        "riesgo_bajo": "Hipoxia",
        "riesgo_alto": "Posible conflagración",
        "norma": "Dec. 1886/2015 art. 7 (19,5 % a 23,5 %)",
    },
    "co2": {
        "nombre": "Dióxido de carbono",
        "corto": "CO₂",
        "unidad": "ppm",
        "alerta_max": 5000.0,
        "peligro_max": 30000.0,
        "escala": [0, 8000],
        "riesgo": "Asfixia",
        "norma": "TLV ACGIH TWA 5 000 / STEL 30 000 ppm",
    },
    "h2s": {
        "nombre": "Ácido sulfhídrico",
        "corto": "H₂S",
        "unidad": "ppm",
        "alerta_max": 1.0,
        "peligro_max": 5.0,
        "escala": [0, 8],
        "riesgo": "Riesgo de muerte",
        "norma": "TLV ACGIH TWA 1 / STEL 5 ppm",
    },
    "no2": {
        "nombre": "Dióxido de nitrógeno",
        "corto": "NO₂",
        "unidad": "ppm",
        "alerta_max": 0.2,
        "peligro_max": 0.6,
        "escala": [0, 1],
        "riesgo": "Asfixia",
        "norma": "TLV-TWA ACGIH 0,2 ppm (excursión 3×)",
    },
}

# Variables que se miden pero no se clasifican (entran en la te).
VARIABLES_INFO = {
    "temp_seca": {"nombre": "Temperatura seca", "unidad": "°C"},
    "temp_humeda": {"nombre": "Temperatura húmeda", "unidad": "°C"},
    "velocidad_aire": {"nombre": "Velocidad del aire", "unidad": "m/s"},
}

ACCIONES = {
    "temp_efectiva": {
        ALERTA: "Limitar la permanencia del personal a {permanencia}; aumentar el caudal de aire e hidratar a la cuadrilla.",
        PELIGRO: "Temperatura efectiva sobre 31 °C: solo pueden entrar cuadrillas de salvamento.",
    },
    "humedad_relativa": {
        ALERTA: "Reforzar la ventilación y vigilar la temperatura efectiva; pausas de hidratación.",
    },
    "co": {
        ALERTA: "Revisar escapes de equipos diésel y descartar fuego; reforzar ventilación y tener el autorrescatador a mano.",
        PELIGRO: "Monóxido de carbono sobre 50 ppm: colocarse el autorrescatador y salir por la vía de aire fresco.",
    },
    "ch4": {
        ALERTA: "Aumentar la ventilación, medir con metanómetro cada 15 min y prohibir cualquier fuente de ignición.",
        PELIGRO: "Metano sobre 1,0 %: cortar la energía, suspender trabajos y evacuar (art. 53 y 183).",
    },
    "o2": {
        "bajo_" + str(ALERTA): "Oxígeno bajo: revisar el circuito de ventilación y que las puertas estén cerradas.",
        "bajo_" + str(PELIGRO): "Oxígeno bajo 19,5 %: riesgo de hipoxia, evacuar hacia el aire fresco.",
        "alto_" + str(ALERTA): "Oxígeno elevado: retirar fuentes de ignición, posible riesgo de conflagración.",
        "alto_" + str(PELIGRO): "Oxígeno sobre 23,5 %: riesgo de conflagración, evacuar y cortar energía.",
    },
    "co2": {
        ALERTA: "Aumentar el caudal de aire fresco; verificar acumulación en zonas bajas.",
        PELIGRO: "Dióxido de carbono sobre 30 000 ppm: riesgo de asfixia, evacuar.",
    },
    "h2s": {
        ALERTA: "Ventilar el frente y usar detector personal; no permanecer en zonas de agua estancada.",
        PELIGRO: "Ácido sulfhídrico sobre 5 ppm: riesgo de muerte, evacuar de inmediato.",
    },
    "no2": {
        ALERTA: "Revisar voladuras recientes y equipos diésel; esperar la ventilación antes de reingresar.",
        PELIGRO: "Dióxido de nitrógeno sobre 0,6 ppm: riesgo de asfixia, evacuar.",
    },
}

PERMANENCIA_TE = [(28, "sin limitación"), (29, "6 horas"), (30, "4 horas"), (31, "2 horas")]


def permanencia(te: float) -> str:
    for limite, texto in PERMANENCIA_TE:
        if te <= limite:
            return texto
    return "0 horas"


def temperatura_efectiva(th: float, ts: float, v: float) -> float:
    """Dec. 1886/2015 art. 217: te = 0,7 th + 0,3 ts − V."""
    return round(0.7 * th + 0.3 * ts - (v or 0), 2)


def evaluar(variable: str, valor):
    """Devuelve (nivel, mensaje de riesgo, acción recomendada o None)."""
    cfg = VARIABLES[variable]
    if valor is None:
        return NORMAL, None, None

    if variable == "o2":
        if valor < cfg["peligro_min"]:
            return PELIGRO, cfg["riesgo_bajo"], ACCIONES["o2"]["bajo_2"]
        if valor > cfg["peligro_max"]:
            return PELIGRO, cfg["riesgo_alto"], ACCIONES["o2"]["alto_2"]
        if valor < cfg["alerta_min"]:
            return ALERTA, cfg["riesgo_bajo"], ACCIONES["o2"]["bajo_1"]
        if valor > cfg["alerta_max"]:
            return ALERTA, cfg["riesgo_alto"], ACCIONES["o2"]["alto_1"]
        return NORMAL, None, None

    pmax = cfg.get("peligro_max")
    amax = cfg.get("alerta_max")
    if pmax is not None and valor > pmax:
        nivel = PELIGRO
    elif amax is not None and valor > amax:
        nivel = ALERTA
    else:
        return NORMAL, None, None

    accion = ACCIONES[variable].get(nivel)
    if accion and "{permanencia}" in accion:
        accion = accion.format(permanencia=permanencia(valor))
    return nivel, cfg["riesgo"], accion
