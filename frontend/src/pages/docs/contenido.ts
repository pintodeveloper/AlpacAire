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

// ------------------------------------------------------------ Formato CH-CM: cronograma anual de mantenimiento 2026
// "semanas": 52 caracteres, uno por semana; "." = nada programado, letra = tipo marcado en esa semana.
export const CM_TIPOS: Record<string, string> = { P: "Programado / preventivo", C: "Calibración normativa (Decreto 1886 de 2015)", I: "Inspección de rutina" };
export const CM_MESES: [string, number][] = [["Enero", 1], ["Febrero", 5], ["Marzo", 9], ["Abril", 14], ["Mayo", 18], ["Junio", 23], ["Julio", 27], ["Agosto", 31], ["Septiembre", 36], ["Octubre", 40], ["Noviembre", 44], ["Diciembre", 49]];
export const CRONOGRAMA: { codigo: string; objeto: string; it: string; tm: string; semanas: string }[] = [
  { codigo: "ALP-101", objeto: "Filtros PTFE / bronce y microbomba 12 V", it: "IT-01", tm: "P", semanas: "PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP" },
  { codigo: "ALP-102", objeto: "Caja IP67, sellos y prensaestopas de sensado", it: "IT-02", tm: "I", semanas: "PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP" },
  { codigo: "ALP-103", objeto: "Alarmas locales (sirena y luz LED de frente)", it: "IT-03", tm: "P", semanas: "PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP" },
  { codigo: "ALP-104", objeto: "Bump test a sensores electroquímicos (CO, O₂, H₂S)", it: "IT-04", tm: "I", semanas: "PPPPPPPPPPPPPPPPPIPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP" },
  { codigo: "ALP-201", objeto: "Calibración cero/span NDIR (CH₄ y CO₂) con gas patrón", it: "IT-05", tm: "C", semanas: "...P...P....P...P....P...P...P....P...P...P....P...P" },
  { codigo: "ALP-202", objeto: "Verificación de sensores de clima (SHT35, BMP388, anemómetro)", it: "IT-06", tm: "P", semanas: ".P...P...P....P...P....P...P...P....P...P...P....P.." },
  { codigo: "ALP-203", objeto: "Inspección de manguera HDPE 1\" en cuneta (2.000 m)", it: "IT-07", tm: "I", semanas: "..P...P...P....P...P....P...P...P....P...P...P....P." },
  { codigo: "ALP-204", objeto: "Comprobación de enlace RS-485 / ESP-NOW en nodos", it: "IT-08", tm: "P", semanas: "P...P...P....P...P....P...P...P....P...P...P....P..." },
  { codigo: "ALP-301", objeto: "Prueba de carga y descarga de baterías LiFePO4 de repetidores", it: "IT-09", tm: "P", semanas: "............P............P............P............P" },
  { codigo: "ALP-302", objeto: "Prueba de autonomía de UPS y servidor Raspberry Pi 5", it: "IT-10", tm: "P", semanas: "............P............P............P............P" },
  { codigo: "ALP-401", objeto: "Reemplazo de celdas electroquímicas afectadas", it: "IT-11", tm: "P", semanas: ".........................P.........................P" },
  { codigo: "ALP-402", objeto: "Mantenimiento general de cuneta y cableado blindado", it: "IT-12", tm: "P", semanas: ".........................P.........................P" },
];

// ------------------------------------------------------------ Presupuesto del prototipo
export const PRESUPUESTO: { bloque: string; incluye: string; usd: number; cop: number; prototipo: boolean }[] = [
  { bloque: "Estación de sensado en el frente (1 unidad)", incluye: "ESP32-S3, microbomba de succión 12 V, válvula, filtros PTFE/bronce, sensores NDIR (CH₄, CO₂), electroquímicos (CO, O₂, H₂S), sonda SHT35 (Ts, HR), barómetro BMP388 (Th), anemómetro (Te), relé de corte y caja IP67.", usd: 455, cop: 1433000, prototipo: true },
  { bloque: "Troncal enterrada por 2.000 metros", incluye: "2.000 m de manguera HDPE de 1\" (1.700 USD) + 2.000 m de cable industrial blindado RS-485/DC (1.900 USD) + uniones y fuentes (220 USD) + mano de obra de enterrado en cuneta (360 USD).", usd: 4180, cop: 13164000, prototipo: false },
  { bloque: "Los 40 repetidores cada 50 m (instalados)", incluye: "40 nodos completos (88 USD c/u): ESP32 (con ESP-NOW), módulo RS-485 aislado, relé bypass, batería LiFePO4, caja IP67 con visera y kit de subida vertical en \"T\" desde la cuneta.", usd: 3520, cop: 11849000, prototipo: false },
  { bloque: "Central de control en superficie", incluye: "Raspberry Pi 5 (4 GB), conversor maestro RS-485 aislado, pantalla de 22\" con el software del triángulo de Coward y mapa de abscisas, UPS y sirena.", usd: 320, cop: 10078000, prototipo: true },
];
export const PRESUPUESTO_TOTAL_DOC = { usd: 8475, cop: 26689000 };

// ------------------------------------------------------------ Costo-beneficio (DC-AC): supuestos editables
export interface SupuestosCB {
  trm: number; smmlv: number; pension: number; mesadas: number; anosPension: number; tasa: number; horizonte: number;
  muertesTotal: number; emergencias: number; eventosExp: number; muertesExp: number; anosANM: number;
  efectividad: number; vev: number; invSistemaUSD: number; invPrototipoUSD: number; mantenimiento: number;
  detectorUSD: number; muertesCiscuda: number; muertesChapa: number; probabilidad: number; valoracion: "Pensión" | "Social";
}
export const SUPUESTOS_CB: SupuestosCB = {
  trm: 3158.43, smmlv: 1750905, pension: 0.75, mesadas: 12, anosPension: 15, tasa: 0.1225, horizonte: 5,
  muertesTotal: 1638, emergencias: 1459, eventosExp: 148, muertesExp: 378, anosANM: 15.9,
  efectividad: 0.4, vev: 128000000, invSistemaUSD: 8475, invPrototipoUSD: 775, mantenimiento: 0.1,
  detectorUSD: 1049.74, muertesCiscuda: 9, muertesChapa: 15, probabilidad: 0.01, valoracion: "Pensión",
};
export const SUPUESTOS_CB_INFO: { clave: keyof SupuestosCB; nombre: string; unidad: string; tipo: string; fuente: string; pct?: boolean; editable?: boolean }[] = [
  { clave: "trm", nombre: "Tasa de cambio (TRM)", unidad: "COP/USD", tipo: "Dato sustentado", fuente: "TRM oficial vigente del 24 al 26 de octubre de 2026 (Portafolio)", editable: true },
  { clave: "smmlv", nombre: "Salario mínimo mensual 2026 (SMMLV)", unidad: "COP", tipo: "Dato sustentado", fuente: "Decreto 1469 de 2025 (Buk; Consultorsalud)", editable: true },
  { clave: "pension", nombre: "Pensión de sobrevivientes por muerte laboral", unidad: "% del IBL", tipo: "Dato sustentado", fuente: "Ley 776 de 2002 y Decreto 1295 de 1994: 75 % del salario base de liquidación (Colmena Seguros)", pct: true, editable: true },
  { clave: "mesadas", nombre: "Mesadas por año consideradas", unidad: "mesadas", tipo: "Supuesto", fuente: "Simplificación conservadora: no incluye mesadas adicionales; se asume IBL = 1 SMMLV", editable: true },
  { clave: "anosPension", nombre: "Años de pensión a los beneficiarios", unidad: "años", tipo: "Supuesto", fuente: "Por confirmar con un asesor de riesgos laborales; a mayor duración, mayor beneficio", editable: true },
  { clave: "tasa", nombre: "Tasa de descuento", unidad: "anual", tipo: "Dato sustentado", fuente: "Tasa de interés del Banco de la República, 12,25 % (Portafolio, octubre de 2026), usada como referencia", pct: true, editable: true },
  { clave: "horizonte", nombre: "Horizonte de evaluación", unidad: "años", tipo: "Supuesto", fuente: "Vida útil de referencia del equipo; sensores electroquímicos duran cerca de 2 años o más (ficha MGT, Gas Detection Australia)", editable: true },
  { clave: "muertesTotal", nombre: "Muertes por emergencias mineras 2005 a nov. 2020", unidad: "personas", tipo: "Dato sustentado", fuente: "ANM, estudio de caso de explosión de metano y polvo de carbón (corte 24 nov. 2020)" },
  { clave: "emergencias", nombre: "Emergencias mineras 2005 a nov. 2020", unidad: "eventos", tipo: "Dato sustentado", fuente: "ANM, mismo documento" },
  { clave: "eventosExp", nombre: "Explosiones de CH₄ y/o polvo de carbón: eventos", unidad: "eventos", tipo: "Dato sustentado", fuente: "ANM, mismo documento" },
  { clave: "muertesExp", nombre: "Explosiones de CH₄ y/o polvo de carbón: muertes", unidad: "personas", tipo: "Dato sustentado", fuente: "ANM, mismo documento" },
  { clave: "anosANM", nombre: "Años del periodo ANM (1 ene. 2005 a 24 nov. 2020)", unidad: "años", tipo: "Dato derivado", fuente: "Cálculo propio a partir del periodo reportado por la ANM" },
  { clave: "efectividad", nombre: "Meta nacional de reducción de accidentalidad", unidad: "%", tipo: "Dato sustentado", fuente: "Política Nacional de Seguridad Minera: 40 % menos para 2025 y 80 % para 2030 (EFE vía Swissinfo). Se usa como efectividad del sistema", pct: true, editable: true },
  { clave: "vev", nombre: "Valor estadístico de la vida (aproximación)", unidad: "COP", tipo: "Dato sustentado", fuente: "Rev. Ingenierías Universidad de Medellín: 128 millones de pesos, estimado para seguridad vial en Bogotá; es una aproximación, no un dato minero y no está actualizado", editable: true },
  { clave: "invSistemaUSD", nombre: "Inversión sistema completo 2 km", unidad: "USD", tipo: "Dato del equipo", fuente: "Documento de costos del equipo (suma de los 4 bloques)", editable: true },
  { clave: "invPrototipoUSD", nombre: "Inversión del prototipo (bloques 1 y 4)", unidad: "USD", tipo: "Dato del equipo", fuente: "Documento de costos del equipo: estación de sensado (455) + central (320)", editable: true },
  { clave: "mantenimiento", nombre: "Mantenimiento y calibración anual", unidad: "% de la inversión", tipo: "Supuesto", fuente: "Por validar con el prototipo y los fabricantes de sensores", pct: true, editable: true },
  { clave: "detectorUSD", nombre: "Precio de un detector multigás portátil", unidad: "USD", tipo: "Dato sustentado", fuente: "BESANTEK BST-MG09 (CH₄, O₂, H₂S, CO), Test Equipment Depot; referencia internacional", editable: true },
  { clave: "muertesCiscuda", nombre: "Muertes en explosión La Ciscuda (mayo de 2026)", unidad: "personas", tipo: "Dato sustentado", fuente: "ANM vía Reuters: explosión por acumulación de gases en Sutatausa" },
  { clave: "muertesChapa", nombre: "Muertes en explosión La Chapa (Tasco, Boyacá)", unidad: "personas", tipo: "Dato sustentado", fuente: "ANM: explosión de metano, 15 mineros fallecidos" },
  { clave: "probabilidad", nombre: "Probabilidad anual de explosión fatal en la mina", unidad: "anual", tipo: "Supuesto", fuente: "No existe cifra pública por mina; se prueba entre 0,5 % y 10 % en el análisis de sensibilidad", pct: true, editable: true },
];
export const CONCLUSIONES_CB = [
  "El problema es grave: las explosiones de metano o polvo de carbón fueron el 10,1 % de las emergencias mineras pero el 23,1 % de las muertes (378 de 1.638, ANM 2005-2020), con unos 2,6 muertos por evento y cerca de 24 muertes por año en el país.",
  "Solo con la pensión de sobrevivientes (75 % del IBL, Ley 776 de 2002), perder un trabajador cuesta cerca de 106 millones de COP en valor presente; el valor estadístico de la vida de referencia es de 128 millones.",
  "El prototipo (3,3 millones de COP en valor presente, con mantenimiento) se paga con una probabilidad anual de evento de 0,9 % si se usa el promedio nacional de víctimas, y de 0,2 % si el evento es como La Ciscuda. Con 1 % de probabilidad, su razón beneficio-costo es de 1,2 a 4,1.",
  "El sistema completo de 2 km (36,4 millones de COP) no se paga solo con estos beneficios: con 1 % de probabilidad la razón es de 0,11 a 0,63. Necesita una probabilidad anual de 1,6 % a 9,4 %, o incluir beneficios no valorados aquí: heridos, paradas de producción, rescate, sanciones y cumplimiento del Decreto 1886 de 2015.",
  "Límites: no hay cifra pública de probabilidad por mina (es un supuesto que se prueba de 0,5 % a 10 %) y el 40 % de efectividad es la meta nacional de reducción, no una medición del dispositivo. Conviene validar ambos con el piloto.",
];
export const FUENTES_CB: [string, string, string][] = [
  ["Emergencias, muertes y explosiones de metano y polvo 2005-2020", "Agencia Nacional de Minería, estudio de caso de explosión de metano y polvo de carbón", "https://www.anm.gov.co/sites/default/files/DocumentosAnm/estudio-caso-explosion-metano-y-polvo-carbon.pdf"],
  ["Promedio de 103 muertes por año y meta de reducción de 40 % (2025) y 80 % (2030)", "EFE vía Swissinfo, con datos de la ANM", "https://www.swissinfo.ch/spa/m%C3%A1s-de-1-262-accidentes-mineros-en-colombia-durante-los-%C3%BAltimos-10-a%C3%B1os/48364264"],
  ["90 % de las muertes en minería subterránea; tasa de accidentes del sector 12,54 por 100 trabajadores en 2022", "El País Cali, con datos de la ANM y el Consejo Colombiano de Seguridad", "https://www.elpais.com.co/colombia/crudo-panorama-de-los-mineros-en-han-fallecido-1857-personas.html"],
  ["Explosión La Ciscuda: 9 muertos, acumulación de gases (mayo de 2026)", "Reuters, citando a la ANM", "https://979weve.com/?p=835884"],
  ["Explosión La Chapa: 15 muertos por metano", "ANM vía Miners News", "https://minersnews.net/colombian-regulators-confirm-15-killed-in-recent-mine-explosion/"],
  ["Salario mínimo 2026: 1.750.905 COP", "Decreto 1469 de 2025 (Buk)", "https://www.buk.co/blog/salario-minimo-2026-en-colombia"],
  ["Pensión de sobrevivientes de 75 % del IBL por muerte laboral", "Colmena Seguros; Ley 776 de 2002 y Decreto 1295 de 1994", "https://colmenaseguros.com/documents/d/guest/17-proceso-de-pago-de-pension-de-sobrevivientes-por-evento-laboral-mortal"],
  ["TRM 3.158,43 (24 al 26 de octubre de 2026) y tasa del Banco de la República 12,25 %", "Portafolio", "https://www.portafolio.co/economia/finanzas/precio-del-dolar-en-colombia-divisa-inicia-la-semana-cerca-de-los-3-505113"],
  ["Valor estadístico de la vida: 128 millones de pesos (seguridad vial, Bogotá)", "Revista Ingenierías Universidad de Medellín", "https://dialnet.unirioja.es/descarga/articulo/4738627.pdf"],
  ["Detector multigás portátil BESANTEK BST-MG09: 1.049,74 USD", "Test Equipment Depot", "https://www.testequipmentdepot.com/besantek-bst-mg09-heavy-duty-multi-gas-leak-detector-for-ch4-lel-o2-h2s-and-co.html"],
  ["Vida útil de sensores electroquímicos y NDIR (cerca de 2 años o más)", "Gas Detection Australia, ficha del detector MGT", "https://www.gasdetectionaustralia.com.au/?p=263815"],
  ["Costos del prototipo y del sistema", "Documento de costos del equipo IMS Alpac", ""],
];

// ------------------------------------------------------------ Matriz de riesgos (DC-MR)
export const RIESGO_ESTADOS = ["Controlado", "En mitigación", "Pendiente", "Crítico"];
export const RIESGOS: { categoria: string; items: { id: string; riesgo: string; causa: string; impacto: string; p: number; i: number; control: string; responsable: string }[] }[] = [
  { categoria: "Riesgos técnicos y de sensores en el frente", items: [
    { id: "R-01", riesgo: "Deriva de lectura o descalibración en sensores NDIR (CH₄, CO₂)", causa: "Polvo constante en el frente, vibración de voladuras y humedad", impacto: "Falsas alarmas o falta de detección de concentraciones peligrosas de metano", p: 2, i: 4, control: "Muestreo con bomba 12 V a través de filtros PTFE/bronce y calibración mensual cero/span con gas patrón", responsable: "Técnico de mantenimiento / SST" },
    { id: "R-02", riesgo: "Saturación o agotamiento prematuro de sensores electroquímicos (CO, O₂, H₂S)", causa: "Exposición continua a humos de voladura y gases corrosivos de mina", impacto: "Pérdida de medición del monóxido de carbono u oxígeno de seguridad", p: 3, i: 4, control: "Bump test semanal, rutina de purga de aire limpio y reemplazo semestral de celdas electroquímicas", responsable: "Técnico electrónico" },
    { id: "R-03", riesgo: "Ingreso de fango o condensación de agua a la caja electrónica de la estación", causa: "Alta humedad relativa en la galería y filtraciones de agua de roca", impacto: "Cortocircuito en placa ESP32-S3, sensores o sistema de relés", p: 2, i: 5, control: "Envolvente hermética con certificación IP67, prensaestopas sellados y purga diaria de condensado", responsable: "Técnico de mantenimiento" },
  ] },
  { categoria: "Riesgos de comunicación y red de transporte (2.000 metros)", items: [
    { id: "R-04", riesgo: "Interrupción o aplastamiento de la manguera HDPE 1\" / cable RS-485 en cuneta", causa: "Desprendimiento de rocas, tráfico de vagonetas o mantenimiento de vía", impacto: "Pérdida de transmisión de datos en tiempo real hacia la superficie", p: 3, i: 4, control: "Instalación enterrada en cuneta de protección con manguera HDPE de alto impacto y cable blindado RS-485", responsable: "Mantenimiento mina" },
    { id: "R-05", riesgo: "Falla de comunicación en repetidores RS-485 / ESP-NOW por caída de energía", causa: "Corte del suministro eléctrico principal en la labor subterránea", impacto: "Incapacidad de enviar alertas preventivas al supervisor en superficie", p: 2, i: 4, control: "Nodos equipados con batería LiFePO4 de respaldo y relé de conmutación bypass automática", responsable: "Técnico de sistemas" },
  ] },
  { categoria: "Riesgos de hardware en superficie y software de monitoreo", items: [
    { id: "R-06", riesgo: "Bloqueo o falla del servidor Raspberry Pi 5 en la central de control", causa: "Sobrecalentamiento, falla en tarjeta microSD o fluctuación eléctrica", impacto: "Interrupción del despliegue gráfico del triángulo de Coward y la app", p: 2, i: 4, control: "Servidor con carcasa de disipación, respaldos periódicos en memoria y sistema de alimentación UPS 24/7", responsable: "Responsable de sistemas" },
    { id: "R-07", riesgo: "Falla en la activación de alarmas locales sonoras/luminosas en el frente", causa: "Desconexión de relé de corte o falla de alimentación a la sirena", impacto: "El minero de frente no recibe la alerta de evacuación inmediata ante gas", p: 2, i: 5, control: "Prueba funcional diaria de sirena y LED desde el frente, complementada con el uso obligatorio del autorrescatador", responsable: "Supervisor SST / minero" },
  ] },
  { categoria: "Riesgos operativos y humanos en el frente de trabajo", items: [
    { id: "R-08", riesgo: "Omisión de la orden de evacuación por parte del supervisor o renuencia del personal", causa: "Falta de capacitación o desconocimiento de los niveles normativos del Dec. 1886", impacto: "Exposición del personal a intoxicación por CO, asfixia o golpe de calor", p: 2, i: 5, control: "Programa de capacitación operativa por rol de 4 días, simulacros con la app y lista de chequeo de campo", responsable: "Supervisor SST / gerencia" },
  ] },
];
export const ESCALA_P: [number, string, string, string][] = [
  [1, "Raro", "Casi imposible que ocurra durante la operación del prototipo", "Menos de 1 vez al año"],
  [2, "Improbable", "Podría ocurrir en condiciones extremas de humedad o mina", "1 vez al año"],
  [3, "Posible", "Evento conocido que ocurre ocasionalmente en labores subterráneas", "1 vez al mes"],
  [4, "Probable", "Ocurrirá con frecuencia si no se aplica mantenimiento preventivo", "1 vez a la semana"],
  [5, "Casi seguro", "Se espera que ocurra en casi cualquier turno de trabajo", "Diario"],
];
export const ESCALA_I: [number, string, string, string][] = [
  [1, "Insignificante", "Sin lesiones ni afectación a trabajadores", "Sin pérdida de datos ni falla en componentes"],
  [2, "Menor", "Primeros auxilios o molestias menores por clima", "Falla menor con reemplazo rápido de filtro o sensor"],
  [3, "Moderado", "Atención médica sin incapacidad o reubicación temporal", "Interrupción temporal de señal en un sector de la galería"],
  [4, "Mayor", "Incapacidad o riesgo severo por gases de mina", "Pérdida de transmisión en la troncal principal de 2 km"],
  [5, "Catastrófico", "Fatalidad o emergencia grave en el frente por intoxicación", "Falla total del sistema de alarma y daño en el frente"],
];

// ------------------------------------------------------------ Plan de emergencias (DC-PO)
export const PON_ESTADOS = ["Operativo", "En revisión", "Pendiente", "Inactivo"];
export const PONS: { categoria: string; items: { codigo: string; escenario: string; criterio: string; frente: string; superficie: string; equipos: string; responsable: string; variable?: string }[] }[] = [
  { categoria: "Emergencias atmosféricas y de gases en el frente de trabajo", items: [
    { codigo: "PON-ATM-01", escenario: "Alerta crítica por concentración de metano (CH₄ > 1,0 %)", criterio: "CH₄ ≥ 1,0 % o NDIR AlpacAire en rojo", frente: "Suspender de inmediato trabajos con chispa o eléctricos, avisar al compañero y evacuar hacia la vía de aire limpio.", superficie: "Monitorear el tablero de la app AlpacAire, cortar energía eléctrica de la zona y activar la brigada de ventilación.", equipos: "Autorrescatador de oxígeno/CO, detector portátil de respaldo y lámpara de casco.", responsable: "Supervisor SST / jefe de turno", variable: "ch4" },
    { codigo: "PON-ATM-02", escenario: "Presencia de monóxido de carbono (CO > 50 ppm)", criterio: "CO ≥ 50 ppm (límite permisible de intoxicación)", frente: "Colocarse inmediatamente el autorrescatador (menos de 30 s), parar labores y evacuar por la ruta de emergencia.", superficie: "Recibir la notificación automática en la app, confirmar el sector afectado y verificar el conteo de personal en superficie.", equipos: "Autorrescatador obligatorio puesto, máscara de escape de CO.", responsable: "Minero de frente / brigada SST", variable: "co" },
    { codigo: "PON-ATM-03", escenario: "Deficiencia severa de oxígeno (O₂ < 19,5 %)", criterio: "O₂ < 19,5 % (riesgo inminente de asfixia)", frente: "Retirarse inmediatamente del área ciega hacia la galería principal donde circule aire fresco.", superficie: "Validar lecturas en el panel AlpacAire, ordenar presurización o refuerzo del ventilador secundario.", equipos: "Autorrescatador y equipo de circuito cerrado de salvamento.", responsable: "Supervisor SST", variable: "o2" },
    { codigo: "PON-ATM-04", escenario: "Estrés térmico crítico (temperatura efectiva > 30 °C)", criterio: "Te > 30 °C calculada por SHT35, BMP388 y anemómetro", frente: "Suspender trabajo pesado, hidratarse en el punto de descanso y notificar la elevación de temperatura.", superficie: "Rotar el turno de trabajo, verificar el funcionamiento del sistema de aire de la galería y autorizar descansos.", equipos: "Ropa reflectiva ligera, puntos de hidratación potable.", responsable: "Jefe de turno", variable: "temp_efectiva" },
  ] },
  { categoria: "Emergencias técnicas y fallas del sistema prototipo AlpacAire", items: [
    { codigo: "PON-TEC-01", escenario: "Corte total de señal en la troncal de 2 km o caída de red", criterio: "Pérdida de paquetes RS-485 / ESP-NOW > 2 min", frente: "Verificar si la luz verde local del sensor del frente sigue activa. En caso de duda, detener el avance.", superficie: "Verificar el diagnóstico de repetidores en la app, enviar técnico de inspección por la cuneta y activar muestreo manual.", equipos: "Detector portátil multigás de respaldo, radio de comunicación.", responsable: "Técnico de mantenimiento / sistemas" },
    { codigo: "PON-TEC-02", escenario: "Corte de energía eléctrica principal en la mina subterránea", criterio: "Corte de fluido eléctrico general", frente: "Mantener la calma, no manipular cables y esperar confirmación de conmutación de alarmas.", superficie: "Confirmar que la Raspberry Pi 5 conmutó a UPS y los 40 repetidores entraron en batería LiFePO4.", equipos: "Lámpara minera de casco cargada, UPS y baterías LiFePO4.", responsable: "Técnico electrónico" },
  ] },
  { categoria: "Emergencias mecánicas y eventos estructurales en galería", items: [
    { codigo: "PON-EST-01", escenario: "Desprendimiento de rocas o colapso en tramo de galería", criterio: "Aplastamiento de cuneta o manguera de monitoreo", frente: "Si la vía principal está bloqueada, dirigirse a la salida alternativa o refugio de salvamento.", superficie: "Localizar la última abscisa reportada por los repetidores AlpacAire y movilizar la brigada de salvamento ANM.", equipos: "Equipos de corte, entibado de emergencia, autorrescatador y camilla.", responsable: "Brigada de salvamento minero / ANM" },
  ] },
];
export const DIRECTORIO: { rol: string; nombre: string; editable: boolean; contacto: string; ubicacion: string; responsabilidad: string }[] = [
  { rol: "Estación de Salvamento Minero ANM", nombre: "Agencia Nacional de Minería", editable: false, contacto: "Línea nacional 123 / ANM 018000", ubicacion: "Punto de salvamento regional", responsabilidad: "Atención de emergencias y salvamento subterráneo" },
  { rol: "Supervisor SST de turno", nombre: "", editable: true, contacto: "Radio canal 1 / celular SST", ubicacion: "Boca de mina / superficie", responsabilidad: "Toma de decisiones de evacuación y aviso a brigadas" },
  { rol: "Jefe de turno / operaciones", nombre: "", editable: true, contacto: "Radio canal 2", ubicacion: "Superficie / frente", responsabilidad: "Coordinación de personal y paro de actividades" },
  { rol: "Técnico de mantenimiento AlpacAire", nombre: "", editable: true, contacto: "Radio canal 3", ubicacion: "Taller de mantenimiento", responsabilidad: "Soporte técnico, calibración y revisión de troncal" },
  { rol: "Hospital / centro médico cercano", nombre: "Urgencias salud", editable: false, contacto: "Línea de urgencias directa", ubicacion: "Municipio local", responsabilidad: "Atención médica especializada por gases o accidentes" },
];
export const RECURSOS_SALVAMENTO: [string, string, string, string, string][] = [
  ["Autorrescatadores de oxígeno / CO de repuesto", "Punto de acopio en frente y boca de mina", "1 por trabajador + 20 % de reserva", "Bueno", "Semanal"],
  ["Detectores portátiles multigás de respaldo", "Oficina SST / central de control", "3 unidades", "Bueno", "Semanal"],
  ["Camillas de salvamento y botiquín de primeros auxilios", "Estación intermedia y superficie", "2 kits completos", "Bueno", "Mensual"],
  ["Equipos de respiración autónoma (circuito cerrado)", "Estación de brigada de salvamento", "4 unidades", "Bueno", "Mensual"],
  ["Sirena de alerta general y altavoces", "Central en superficie (Raspberry Pi 5)", "1 sistema integral", "Bueno", "Diario"],
];
