// Contenido de los documentos del equipo IMS Alpac (29/10/2026), transcrito para la app.

export const META = "Equipo IMS Alpac, Reto Minero Estudiantes, 29/10/2026";

// ------------------------------------------------------------ Partes interesadas
export type Nivel3 = "Alto" | "Medio" | "Bajo";
export const PARTES: { nombre: string; rol: string; espera: string; poder: Nivel3; interes: Nivel3; estrategia: string; accion: string }[] = [
  { nombre: "Supervisor SST / jefe de turno", rol: "Usuario principal", espera: "Ver en tiempo real si el frente es seguro, sin entrar, y ordenar la evacuación a tiempo", poder: "Alto", interes: "Alto", estrategia: "Gestionar de cerca", accion: "Involucrarlo en el diseño de la app y de las alertas" },
  { nombre: "Mineros del frente", rol: "Usuarios secundarios", espera: "Alarma local clara (luz y sonido) y un equipo que no estorbe su trabajo", poder: "Bajo", interes: "Alto", estrategia: "Mantener informado", accion: "Capacitación corta y pruebas en campo" },
  { nombre: "Gerencia y responsable de cumplimiento", rol: "Cliente y quien decide la inversión", espera: "Cumplir la norma, reducir accidentes y paradas, y tener historial de mediciones a un costo razonable", poder: "Alto", interes: "Alto", estrategia: "Gestionar de cerca", accion: "Mostrar beneficio, costo y reportes del historial" },
  { nombre: "Agencia Nacional de Minería (ANM)", rol: "Regulador", espera: "Que las minas cumplan los límites y el reglamento de seguridad (Decreto 1886 de 2015)", poder: "Alto", interes: "Medio", estrategia: "Mantener satisfecho", accion: "Alinear límites y alarmas con la norma" },
  { nombre: "ARL", rol: "Aseguradora de riesgos laborales", espera: "Menos accidentes y enfermedades laborales en la mina", poder: "Medio", interes: "Medio", estrategia: "Mantener informado", accion: "Compartir datos y resultados" },
  { nombre: "Brigadas de emergencia y rescate", rol: "Responden ante un evento", espera: "Alertas tempranas e información del sector afectado", poder: "Bajo", interes: "Medio", estrategia: "Monitorear", accion: "Incluirlas en el protocolo de respuesta" },
  { nombre: "Técnicos de instalación y mantenimiento", rol: "Instalan, calibran y reparan", espera: "Equipo fácil de instalar, calibrar y reparar", poder: "Bajo", interes: "Medio", estrategia: "Monitorear", accion: "Manual simple y repuestos disponibles" },
  { nombre: "Proveedores de sensores y componentes", rol: "Suministran el hardware", espera: "Pedidos claros y continuos", poder: "Bajo", interes: "Bajo", estrategia: "Monitorear", accion: "Acuerdos de suministro y garantías" },
  { nombre: "Familias de los mineros", rol: "Afectados indirectos", espera: "Que su familiar regrese a salvo del turno", poder: "Bajo", interes: "Alto", estrategia: "Mantener informado", accion: "A través de la empresa y su mensaje de seguridad" },
  { nombre: "Equipo IMS Alpac (Minas, Industrial, Sistemas)", rol: "Diseña y desarrolla el prototipo", espera: "Prototipo funcional, viable y bien sustentado", poder: "Alto", interes: "Alto", estrategia: "Gestionar de cerca", accion: "Reparto claro de responsabilidades" },
  { nombre: "Organizadores y evaluadores del reto", rol: "Evalúan la propuesta", espera: "Propuesta clara, viable y con impacto real", poder: "Alto", interes: "Medio", estrategia: "Mantener satisfecho", accion: "Cumplir entregables y tiempos" },
];

export const CUADRANTES = [
  { clave: "satisfecho", titulo: "Mantener satisfecho", eje: "Poder alto, interés medio", quienes: "ANM, organizadores y evaluadores del reto" },
  { clave: "cerca", titulo: "Gestionar de cerca", eje: "Poder alto, interés alto", quienes: "Supervisor SST, gerencia y cumplimiento, equipo IMS Alpac" },
  { clave: "monitorear", titulo: "Monitorear", eje: "Poder bajo, interés bajo o medio", quienes: "Brigadas de rescate, técnicos de instalación, proveedores" },
  { clave: "informado", titulo: "Mantener informado", eje: "Poder bajo o medio, interés alto o medio", quienes: "Mineros del frente, familias de los mineros, ARL" },
];

// ------------------------------------------------------------ Procesos misionales
export const PROCESOS = [
  { nombre: "Diagnóstico y requisitos", objetivo: "Identificar las condiciones atmosféricas de la mina y los requisitos legales aplicables.", entradas: "Solicitud de la mina; Decreto 1886/2015 y SG-SST; datos y planos del frente.", salidas: "Puntos de medición, límites normativos y alcance del servicio definidos." },
  { nombre: "Diseño e instalación", objetivo: "Configurar e instalar el dispositivo y la aplicación en el frente de trabajo.", entradas: "Puntos de medición y límites definidos.", salidas: "Sistema instalado, umbrales configurados y puesto en marcha." },
  { nombre: "Monitoreo y alarmas", objetivo: "Medir gases y temperatura efectiva en tiempo real y alertar cuando se superen los límites.", entradas: "Lecturas de los sensores; umbrales configurados.", salidas: "Alarma sonora y luminosa local; aviso en pantalla al supervisor." },
  { nombre: "Reportes y cumplimiento", objetivo: "Almacenar y comparar los datos con los límites normativos para evidenciar el cumplimiento.", entradas: "Lecturas e historial de mediciones.", salidas: "Reportes consultables y evidencia para inspecciones." },
  { nombre: "Calibración y servicio", objetivo: "Mantener confiables los sensores y el equipo durante la operación.", entradas: "Plan de mantenimiento; gas patrón certificado.", salidas: "Equipo calibrado y registros de verificación." },
];

// ------------------------------------------------------------ Matriz EPP
export type Uso = "obligatorio" | "tarea" | "no";
export const EPP_ROLES = ["Minero de frente", "Supervisor SST / jefe de turno", "Técnico que instala AlpacAire"];
export const EPP: { epp: string; riesgo: string; uso: [Uso, Uso, Uso] }[] = [
  { epp: "Casco con barbuquejo", riesgo: "Golpes, caída de rocas", uso: ["obligatorio", "obligatorio", "obligatorio"] },
  { epp: "Lámpara minera", riesgo: "Poca visibilidad", uso: ["obligatorio", "obligatorio", "obligatorio"] },
  { epp: "Gafas de seguridad", riesgo: "Partículas, polvo", uso: ["obligatorio", "obligatorio", "obligatorio"] },
  { epp: "Respirador con filtros", riesgo: "Polvo, vapores", uso: ["obligatorio", "tarea", "obligatorio"] },
  { epp: "Autorrescatador", riesgo: "Falta de oxígeno, CO y otros gases", uso: ["obligatorio", "obligatorio", "obligatorio"] },
  { epp: "Protección auditiva", riesgo: "Ruido de perforación y ventilación", uso: ["obligatorio", "tarea", "tarea"] },
  { epp: "Guantes (según tarea)", riesgo: "Cortes, abrasión, manipulación de equipos", uso: ["obligatorio", "tarea", "obligatorio"] },
  { epp: "Botas con puntera, antideslizantes", riesgo: "Golpes, resbalones, humedad", uso: ["obligatorio", "obligatorio", "obligatorio"] },
  { epp: "Ropa de trabajo con reflectivos (overol)", riesgo: "Visibilidad frente a maquinaria", uso: ["obligatorio", "obligatorio", "obligatorio"] },
];

// ------------------------------------------------------------ Matriz de requisitos legales
export const REQUISITOS: { norma: string; articulo: string; requisito: string; limite: string; aplica: string; estado: "Cubre" | "Apoya" }[] = [
  { norma: "Decreto 1886/2015", articulo: "Arts. 36 y 37", requisito: "Mantener la atmósfera de trabajo dentro de los valores límites permisibles (VLP) mediante ventilación constante y suficiente.", limite: "Atmósfera dentro de los VLP en todo lugar de trabajo.", aplica: "Vigila el aire del frente de forma continua y evidencia que la ventilación cumple. No reemplaza el circuito de ventilación (art. 40).", estado: "Apoya" },
  { norma: "Decreto 1886/2015", articulo: "Art. 38", requisito: "Un lugar bajo tierra no es apto para trabajar ni transitar si el oxígeno está fuera del rango permitido.", limite: "O₂: 19,5 % a 23,5 % (v/v).", aplica: "El sensor de O₂ activa alarma sonora y luminosa local y aviso en la aplicación al salir del rango.", estado: "Cubre" },
  { norma: "Decreto 1886/2015", articulo: "Art. 39", requisito: "No superar los VLP de los gases contaminantes; los valores se verifican y actualizan cada año.", limite: "CO: 25 ppm (TWA). Demás gases (CO₂, H₂S, SO₂, NO, NO₂): según el art. 39 y los sensores instalados.", aplica: "Compara cada lectura con umbrales configurables y alerta al superarlos.", estado: "Cubre" },
  { norma: "Decreto 1886/2015", articulo: "Art. 53", requisito: "Suspender los trabajos y evacuar de inmediato cuando el metano supere el máximo permitido (minas de carbón).", limite: "CH₄: 1,0 % en frentes y retornos principales; 1,5 % en retornos de tajos y de frentes de preparación.", aplica: "Alarma local y aviso al supervisor al alcanzar el umbral del sitio donde está instalado.", estado: "Cubre" },
  { norma: "Decreto 1886/2015", articulo: "Arts. 217 y 218", requisito: "Calcular la temperatura efectiva (te) del frente y limitar el tiempo de permanencia del personal según su valor.", limite: "te = 0,7·th + 0,3·ts − V. 28 °C sin límite; 29 °C: 6 h; 30 °C: 4 h; 31 °C: 2 h; 32 °C: 0 h.", aplica: "Mide temperatura seca y húmeda, calcula la te y avisa cuando se superan los límites.", estado: "Cubre" },
  { norma: "Decreto 1886/2015", articulo: "Art. 29 y art. 11, núm. 23", requisito: "Contar con alarma sonora y luminosa, y detener las operaciones y evacuar ante grave peligro.", limite: "Reacción inmediata al superar un límite.", aplica: "Alarma sonora y luminosa en el túnel y aviso en pantalla al supervisor para coordinar la evacuación.", estado: "Cubre" },
  { norma: "Decreto 1886/2015", articulo: "Arts. 11 (núms. 12 a 14), 46, 47 y 52", requisito: "Medir gases de forma continua en frentes y sitios críticos, y registrar los resultados con trazabilidad en tableros y libro de control.", limite: "Registro con fecha, hora y firma del supervisor antes de cada turno.", aplica: "Guarda automáticamente cada lectura con fecha y hora y permite consultarla desde fuera de la mina. El libro firmado lo mantiene el supervisor.", estado: "Apoya" },
  { norma: "Decreto 1886/2015", articulo: "Arts. 50 y 51", requisito: "Calibrar y verificar los detectores con gas patrón certificado, con registro de cada prueba.", limite: "Verificación dentro de ±10 % del gas patrón.", aplica: "Aplica al propio equipo. La aplicación puede conservar el historial de calibraciones.", estado: "Apoya" },
  { norma: "Decreto 1886/2015", articulo: "Art. 13, núms. 2 y 5, y art. 45", requisito: "El supervisor verifica que el aire esté dentro de los VLP antes de autorizar el ingreso y deja constancia.", limite: "Aire dentro de los VLP antes de cada turno.", aplica: "El panel remoto muestra el estado del aire antes del ingreso. La autorización escrita sigue a cargo del supervisor.", estado: "Apoya" },
  { norma: "Decreto 1886/2015", articulo: "Art. 35", requisito: "El plan de ventilación indica los puntos donde se miden gases, temperatura y caudal, y los niveles de CO, O₂ y CH₄.", limite: "Puntos de medición definidos y documentados.", aplica: "Los sectores configurados en la aplicación deben quedar reflejados en el plan de ventilación.", estado: "Apoya" },
  { norma: "Decreto 1886/2015", articulo: "Arts. 249 y 250", requisito: "La autoridad puede suspender frentes o cerrar la mina si hay gases sobre los VLP y no existen tableros de registro y control diario.", limite: "Gases sobre los VLP sin registros: causal de cierre.", aplica: "El historial consultable demuestra el control diario de gases en las visitas de la autoridad.", estado: "Apoya" },
  { norma: "Resolución 0312/2019 y Decreto 1072/2015", articulo: "Arts. 2.2.4.6.15, 2.2.4.6.24 y 2.2.4.6.25", requisito: "Identificar peligros, valorar riesgos, aplicar controles y mantener un plan de respuesta a emergencias dentro del SG-SST.", limite: "Controles priorizados según el riesgo.", aplica: "Actúa como control de detección temprana para los riesgos de gases y estrés térmico y aporta reportes como evidencia.", estado: "Apoya" },
];

export const RECOMENDACIONES = [
  ["Mantenimiento y calibración periódica", "Revisar los sensores con gas patrón certificado y registrar cada verificación (arts. 50 y 51)."],
  ["Almacenamiento local (offline)", "Conservar las lecturas en la memoria del dispositivo si se pierde la señal en los túneles."],
  ["Verificación previa al ingreso", "El supervisor revisa el panel en superficie antes de autorizar la entrada del turno (art. 13 y art. 45)."],
];

export const PENDIENTES = [
  ["Certificación del equipo", "Confirmar la certificación Ex e IP 65 o mayor exigida a los medidores de gases (art. 46)."],
  ["Velocidad del aire (V)", "Definir si se mide con sensor propio o con aforos para calcular la temperatura efectiva (art. 217)."],
  ["Umbrales y categoría de la mina", "Parametrizar los límites de los arts. 38, 39, 53 y 218 y confirmar la categoría de la labor (art. 58)."],
  ["Registros físicos", "Mantener el libro de control de gases firmado por el supervisor junto al registro digital."],
];

export const REFERENCIAS = [
  "Ministerio de Minas y Energía. (2015). Decreto 1886 de 2015: Por el cual se establece el Reglamento de Seguridad en las Labores Mineras Subterráneas. Diario Oficial No. 49.642.",
  "Ministerio de Minas y Energía. (2022). Decreto 944 de 2022: Por el cual se modifica el Decreto 1886 de 2015, Reglamento de Seguridad en las Labores Mineras Subterráneas.",
  "Ministerio del Trabajo. (2015). Decreto 1072 de 2015: Por el cual se expide el Decreto Único Reglamentario del Sector Trabajo. Diario Oficial No. 49.523.",
  "Ministerio del Trabajo. (2019). Resolución 0312 de 2019: Por la cual se definen los Estándares Mínimos del Sistema de Gestión de la Seguridad y Salud en el Trabajo SG-SST. Bogotá D.C.",
];

// ------------------------------------------------------------ Plan de capacitación
export const CAPACITACION = [
  { rol: "Minero de frente", objetivo: "Reconocer la alarma y reaccionar sin dudar", temas: ["Qué significan la luz y el sonido de la alarma", "Qué hacer cuando suena: parar, evacuar por la ruta y avisar", "Colocarse el autorrescatador (práctica)"], modalidad: "Práctica en el frente", duracion: "30 min", frecuencia: "Al ingreso y repaso de 5 min en la charla de turno", evaluacion: "Se pone el autorrescatador y evacúa en el simulacro" },
  { rol: "Supervisor SST / jefe de turno", objetivo: "Leer la app y decidir a tiempo si se continúa o se evacúa", temas: ["Leer el tablero: sector, nivel y alerta", "Límites del Decreto 1886 de 2015 que activan la alarma", "Decidir: continuar o evacuar, y avisar a las brigadas"], modalidad: "Taller con la app y un escenario simulado", duracion: "1 hora", frecuencia: "Al asumir el cargo y repaso de 20 min cada 3 meses", evaluacion: "Responde a una alerta simulada" },
  { rol: "Técnico de instalación y mantenimiento", objetivo: "Instalar, calibrar y mantener el equipo funcionando", temas: ["Dónde ubicar el equipo según la ventilación", "Instalar, conectar y verificar la señal con la app", "Calibrar, probar alarmas y limpiar sensores", "Fallas comunes y solución rápida"], modalidad: "Práctica en banco y en campo", duracion: "2 horas", frecuencia: "Al inicio y actualización de 1 hora al año o si cambia el equipo", evaluacion: "Instala y calibra con lista de chequeo" },
  { rol: "Gerencia y responsable de cumplimiento", objetivo: "Saber qué entrega el sistema y usarlo para cumplir la norma", temas: ["Qué datos entrega AlpacAire", "Leer reportes e historial frente al Decreto 1886 de 2015"], modalidad: "Demostración corta", duracion: "30 min", frecuencia: "Al inicio y revisión de reportes cada semestre", evaluacion: "Revisa un reporte de ejemplo" },
];

export const ORDEN_CAPACITACION = [
  { dia: "Día 1", quien: "Técnicos de instalación y mantenimiento (2 h)", porque: "Instalan y calibran el equipo antes de que lo use el resto." },
  { dia: "Día 2", quien: "Supervisores SST y jefes de turno (1 h)", porque: "Aprenden la app con el equipo ya instalado y con datos reales." },
  { dia: "Día 3", quien: "Mineros de frente (30 min por turno)", porque: "Práctica con el equipo y las alarmas funcionando." },
  { dia: "Día 4", quien: "Simulacro general (30 min) y gerencia (30 min)", porque: "Se prueba todo junto y se presentan los resultados." },
];

// ------------------------------------------------------------ Formato: lista de chequeo entrada/salida
export const CHEQUEO_SECCIONES: { titulo: string; atmosfera?: boolean; items: string[] }[] = [
  { titulo: "Antes de entrar: equipo de protección personal", items: [
    "Casco con lámpara cargada y funcionando",
    "Autorrescatador disponible y en buen estado",
    "Botas de seguridad y ropa con material reflectivo",
    "Guantes, protección auditiva y respiratoria según la labor",
    "Equipo de comunicación (radio) operativo",
  ] },
  { titulo: "Antes de entrar: condiciones de la atmósfera (AlpacAire)", atmosfera: true, items: [
    "Central de control en superficie encendida y comunicando",
    "Repetidores de la galería reportando sin fallas",
    "Lecturas de CH₄, CO, CO₂, O₂ y H₂S dentro de los límites permisibles (Decreto 1886 de 2015)",
    "Temperatura efectiva sin alerta de estrés térmico",
    "Alarmas visuales y sonoras del frente sin activar",
  ] },
  { titulo: "Autorización de ingreso", items: [
    "Registro de entrada en superficie (nombre, hora y destino)",
    "Autorización del supervisor SST o jefe de turno",
    "Charla de seguridad del turno recibida",
  ] },
  { titulo: "Salida de la mina", items: [
    "Registro de hora de salida y conteo de personal en superficie",
    "Revisión del historial de alertas del turno en la aplicación",
    "Equipos devueltos y en buen estado (lámpara, autorrescatador, radio)",
    "Novedades o condiciones inseguras reportadas al supervisor",
  ] },
];

// ------------------------------------------------------------ Formato: checklist del supervisor
export const SUPERVISOR_ETAPAS: { titulo: string; items: { punto: string; pregunta: string; rol: string }[] }[] = [
  { titulo: "Antes de entrar a la mina (preparación y equipos)", items: [
    { punto: "1.1", pregunta: "¿El trabajador trajo su autorrescatador, casco, lámpara y EPP en buen estado?", rol: "Todos" },
    { punto: "1.2", pregunta: "¿Tengo la app de AlpacAire prendida, conectada y mostrando los datos del frente?", rol: "Supervisor / SST" },
    { punto: "1.3", pregunta: "¿El equipo de monitoreo del frente está limpio, calibrado y marcando señal verde?", rol: "Técnicos" },
  ] },
  { titulo: "Enseñanza y práctica de alarmas (en el frente de trabajo)", items: [
    { punto: "2.1", pregunta: "¿El trabajador reconoce el sonido y la luz de la alarma del equipo AlpacAire?", rol: "Minero / Todos" },
    { punto: "2.2", pregunta: "¿Sabe qué hacer apenas suena la alarma? (parar el trabajo, avisar y salir rápido)", rol: "Minero / Todos" },
    { punto: "2.3", pregunta: "¿Demostró que sabe ponerse el autorrescatador en menos de 30 segundos sin dudar?", rol: "Minero / Todos" },
    { punto: "2.4", pregunta: "¿Sabe por cuál ruta de evacuación debe salir si la alarma del frente se activa?", rol: "Minero / Todos" },
  ] },
  { titulo: "Manejo de la app y decisiones (para supervisores y jefes)", items: [
    { punto: "3.1", pregunta: "¿El supervisor sabe leer si el valor de gas o temperatura está en verde, amarillo o rojo?", rol: "Supervisor SST" },
    { punto: "3.2", pregunta: "¿Tiene claro cuándo dar la orden de evacuar y cuándo avisar a las brigadas de emergencia?", rol: "Supervisor SST" },
    { punto: "3.3", pregunta: "¿Revisa el historial de la app al iniciar el turno para ver cómo estuvo la atmósfera antes?", rol: "Supervisor SST" },
  ] },
  { titulo: "Mantenimiento del equipo (para técnicos)", items: [
    { punto: "4.1", pregunta: "¿El técnico sabe colocar el sensor en la parte alta o adecuada según el paso del aire?", rol: "Técnico" },
    { punto: "4.2", pregunta: "¿Probó que la alarma suene y la app reciba la señal antes de entregar el frente?", rol: "Técnico" },
  ] },
  { titulo: "Cierre y firma de evidencia", items: [
    { punto: "5.1", pregunta: "¿El trabajador firmó la planilla de asistencia a la capacitación?", rol: "Todos" },
    { punto: "5.2", pregunta: "¿El supervisor registró la nota de la práctica para guardar en el archivo de la mina?", rol: "Supervisor" },
  ] },
];

// ------------------------------------------------------------ Formato: seguimiento de KPI
export const KPI_META = 0.9;
export const KPI: { categoria: string; indicadores: { nombre: string; meta: string }[] }[] = [
  { categoria: "Disponibilidad y comunicación", indicadores: [
    { nombre: "Disponibilidad del dispositivo (tiempo en línea)", meta: "≥ 99 % del turno" },
    { nombre: "Repetidores reportando (40 de 40)", meta: "100 % sin fallas" },
    { nombre: "Retraso del dato hasta la pantalla de superficie", meta: "≤ 10 s" },
    { nombre: "Paquetes perdidos en la troncal", meta: "≤ 1 %" },
  ] },
  { categoria: "Sensores y medición", indicadores: [
    { nombre: "Calibración vigente: CH₄, CO₂, CO, O₂ y H₂S", meta: "Al día según fabricante" },
    { nombre: "Prueba con gas patrón (respuesta de cada sensor)", meta: "Aprobada en cada ciclo" },
    { nombre: "Diferencia frente al detector portátil", meta: "Dentro de la tolerancia definida" },
    { nombre: "Temperatura, humedad, presión y velocidad del aire reportando", meta: "4 de 4 variables" },
    { nombre: "Temperatura efectiva calculada sin datos faltantes", meta: "100 % de las lecturas" },
  ] },
  { categoria: "Alarmas y alertas", indicadores: [
    { nombre: "Alarma local (luz y sonido) al superar el límite", meta: "Se activa en ≤ 5 s" },
    { nombre: "Alerta recibida en la aplicación del supervisor", meta: "Se recibe en ≤ 10 s" },
    { nombre: "Falsas alarmas por turno", meta: "0 (meta de partida)" },
    { nombre: "Prueba de alarma ejecutada en el turno", meta: "1 prueba por turno" },
  ] },
  { categoria: "Electroválvulas y flujo", indicadores: [
    { nombre: "Válvula V1: apertura y cierre correctos", meta: "Responde al comando" },
    { nombre: "Válvula V2: apertura y cierre correctos", meta: "Responde al comando" },
    { nombre: "Válvula V3: apertura y cierre correctos", meta: "Responde al comando" },
    { nombre: "Válvula V4: apertura y cierre correctos", meta: "Responde al comando" },
    { nombre: "Conexiones y mangueras sin fugas ni obstrucciones", meta: "Sin fugas" },
  ] },
  { categoria: "Energía y estado físico", indicadores: [
    { nombre: "Alimentación de 12 V CC estable", meta: "Sin caídas en el turno" },
    { nombre: "ESP32-S3 sin reinicios inesperados", meta: "0 reinicios" },
    { nombre: "Caja y sellos en buen estado (IP67)", meta: "Sin entrada de polvo ni agua" },
    { nombre: "Filtros y cámara de sensores limpios", meta: "Sin obstrucción" },
  ] },
];

// ------------------------------------------------------------ Formato: checklist de EPP (usa EPP y EPP_ROLES)
export const EPP_ESTADOS = ["Bueno", "Malo", "Incompleto", "N/A"];

// ------------------------------------------------------------ Formato: checklist de mantenimiento
export const MANT_FRECUENCIAS = ["Diario", "Semanal", "Quincenal", "Mensual"];
export const MANTENIMIENTO: { titulo: string; items: { id: string; punto: string; frecuencia: string; criterio: string }[] }[] = [
  { titulo: "Estación de sensado en el frente (caja IP67)", items: [
    { id: "1.1", punto: "¿Los sensores NDIR (CH₄, CO₂) registran cero y no presentan deriva?", frecuencia: "Mensual", criterio: "Calibración con gas patrón conforme al Decreto 1886" },
    { id: "1.2", punto: "¿Los sensores electroquímicos (CO, O₂, H₂S) responden al bump test?", frecuencia: "Semanal", criterio: "Medición exacta dentro de límites permisibles de norma" },
    { id: "1.3", punto: "¿La sonda SHT35, el BMP388 y el anemómetro leen Ts, Th y velocidad de aire?", frecuencia: "Semanal", criterio: "Datos correctos para cálculo de temperatura efectiva" },
    { id: "1.4", punto: "¿La microbomba de succión de 12 V y las electroválvulas V1 a V4 conmutan bien?", frecuencia: "Semanal", criterio: "Flujo constante impulsado por relé ESP32-S3 a 12 V CC" },
    { id: "1.5", punto: "¿Los filtros de entrada (PTFE / bronce sinterizado) están limpios?", frecuencia: "Diario", criterio: "Libres de saturación por polvo o condensación de mina" },
    { id: "1.6", punto: "¿La caja IP67, empaquetaduras y prensaestopas mantienen sellado hermético?", frecuencia: "Diario", criterio: "Sin ingreso de humedad, fango o partículas al circuito" },
    { id: "1.7", punto: "¿La sirena sonora y los indicadores LED de alarma activan correctamente?", frecuencia: "Diario", criterio: "Respuesta inmediata audible y visible en el frente" },
  ] },
  { titulo: "Troncal enterrada y red física (2.000 metros)", items: [
    { id: "2.1", punto: "¿La manguera HDPE de 1\" en la cuneta está libre de estrangulamientos?", frecuencia: "Semanal", criterio: "Línea continua sin fisuras ni aplastamiento por rocas" },
    { id: "2.2", punto: "¿El cable industrial blindado RS-485/DC tiene continuidad y blindaje?", frecuencia: "Mensual", criterio: "Sin caídas críticas de voltaje ni interferencia de señal" },
    { id: "2.3", punto: "¿Las uniones de red y fuentes de poder están aisladas y sin sulfatación?", frecuencia: "Mensual", criterio: "Voltaje estable y aislamiento eléctrico de seguridad" },
  ] },
  { titulo: "Repetidores de red en galería (40 nodos cada 50 metros)", items: [
    { id: "3.1", punto: "¿Los nodos ESP32 transmiten datos sin pérdida de paquetes (RS-485 / ESP-NOW)?", frecuencia: "Semanal", criterio: "LED de estado en verde y comunicación continua" },
    { id: "3.2", punto: "¿Las baterías de respaldo LiFePO4 sostienen la carga al cortar energía?", frecuencia: "Mensual", criterio: "Conmutación correcta del relé bypass y autonomía de respaldo" },
    { id: "3.3", punto: "¿Los gabinetes IP67 con visera y kits en \"T\" están firmes en la pared?", frecuencia: "Quincenal", criterio: "Montaje mecánico ajustado y visera limpia de polvo" },
  ] },
  { titulo: "Central de control en superficie (Raspberry Pi 5)", items: [
    { id: "4.1", punto: "¿El Raspberry Pi 5 y el conversor RS-485 operan dentro de temperatura segura?", frecuencia: "Semanal", criterio: "Servidor activo con almacenamiento e historial al día" },
    { id: "4.2", punto: "¿La pantalla de 22\" despliega el mapa de abscisas y el triángulo de Coward?", frecuencia: "Diario", criterio: "Visualización clara en tiempo real para supervisión SST" },
    { id: "4.3", punto: "¿El sistema UPS de respaldo y la sirena general responden ante cortes?", frecuencia: "Mensual", criterio: "Continuidad de operación 24/7 en superficie" },
  ] },
];
