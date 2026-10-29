import type { ReactNode } from "react";
import Seccion, { Nota } from "../Seccion";

const SECCIONES: { id: string; titulo: string; cuerpo: ReactNode }[] = [
  {
    id: "ingreso", titulo: "Ingresar y roles",
    cuerpo: (<>
      <p>Entra con el usuario y la contraseña que te asignó el ingeniero. El menú de la izquierda muestra solo las secciones de tu rol.</p>
      <div className="tabla-envoltura">
        <table className="tabla tabla--doc">
          <thead><tr><th>Rol</th><th>Qué puede hacer</th></tr></thead>
          <tbody>
            <tr><td><strong>Ingeniero</strong></td><td>Todo: consulta, edita el personal, exporta reportes y maneja el simulador de sensores.</td></tr>
            <tr><td><strong>Supervisor SST</strong></td><td>Consulta todo, edita operarios y obreros y exporta reportes.</td></tr>
            <tr><td><strong>Dueño de la mina</strong></td><td>Consulta todo y exporta reportes.</td></tr>
            <tr><td><strong>Ministerio de Minas</strong></td><td>Supervisa en modo consulta y exporta reportes.</td></tr>
            <tr><td><strong>Operario</strong></td><td>Situación actual, frentes, detalles, historial, normatividad y formatos.</td></tr>
            <tr><td><strong>Obrero</strong></td><td>Situación actual, frentes, historial, normatividad y formatos.</td></tr>
          </tbody>
        </table>
      </div>
      <p>La sesión dura 12 horas. Para salir usa <em>Cerrar sesión</em>, abajo en el menú.</p>
    </>),
  },
  {
    id: "situacion", titulo: "Situación actual",
    cuerpo: (<>
      <p>Es la pantalla principal. Se actualiza sola cada 5 segundos con las lecturas de los cuatro frentes y muestra uno de tres estados:</p>
      <dl className="definiciones">
        <div><dt><span className="punto punto--normal" /> Todo en orden (verde)</dt><dd>Todas las variables están dentro de los límites. No hay acciones recomendadas.</dd></div>
        <div><dt><span className="punto punto--alerta" /> ¡Alerta! (amarillo)</dt><dd>Un frente superó un valor de exposición o sus sensores dejaron de reportar por más de 30 segundos. Debajo aparecen las acciones recomendadas agrupadas por frente.</dd></div>
        <div><dt><span className="punto punto--peligro" /> ¡Evacuación inmediata! (rojo pulsante)</dt><dd>Se superó un límite que obliga a desalojar. Todos los mineros deben salir. La pantalla muestra la causa, las personas registradas bajo tierra y suena la sirena.</dd></div>
      </dl>
      <p>El estado también se ve en la cabecera y como un punto de color junto a <em>Situación actual</em> en el menú, desde cualquier página.</p>
    </>),
  },
  {
    id: "sirena", titulo: "La sirena de evacuación",
    cuerpo: (<>
      <p>Cuando la mina pasa a evacuación, la sirena suena en todas las pantallas abiertas, sin importar en qué página estés.</p>
      <ul>
        <li>Los navegadores solo permiten sonido después de un clic. Si recargaste la página, aparece el botón <strong>Activar sonido de alarma</strong>: púlsalo.</li>
        <li><strong>Silenciar 1 min</strong> calla la sirena un minuto; luego vuelve a sonar si el peligro sigue. Con <strong>Reactivar ahora</strong> la vuelves a encender antes.</li>
        <li>Silenciar la sirena no cambia el estado de la mina ni detiene la evacuación.</li>
      </ul>
    </>),
  },
  {
    id: "frentes", titulo: "Frentes",
    cuerpo: (<>
      <p>Muestra el valor actual de cada variable en los cuatro frentes: Frente Norte, Frente Sur, Frente Este y Frente Oeste. Cada variable tiene una regla de colores:</p>
      <ul>
        <li><strong>Franja verde:</strong> rango permitido por el Decreto 1886 de 2015.</li>
        <li><strong>Franja amarilla:</strong> zona de alerta. <strong>Franja roja:</strong> zona de peligro.</li>
        <li>La marca negra es el valor actual. Si la variable está fuera de rango, toda la fila se pinta de amarillo o rojo y dice el riesgo (asfixia, explosión, hipoxia, estrés térmico…).</li>
      </ul>
      <p>La temperatura efectiva se calcula con la fórmula del artículo 217: te = 0,7 × temperatura húmeda + 0,3 × temperatura seca − velocidad del aire.</p>
    </>),
  },
  {
    id: "detalles", titulo: "Detalles",
    cuerpo: (<>
      <p>Gráficas de cada variable en el tiempo. Elige un frente o todos (una línea por frente), el periodo (de 1 hora a 30 días) y qué variables ver. Las líneas punteadas marcan los límites de alerta y peligro. Pasa el cursor sobre la gráfica para ver los valores exactos.</p>
    </>),
  },
  {
    id: "historial", titulo: "Historial",
    cuerpo: (<>
      <p>Lista los eventos en que un frente estuvo fuera de rango: cuándo empezó, cuánto duró, el nivel máximo y el peor valor de cada variable afectada. Filtra por periodo, frente y nivel. Úsalo al iniciar el turno para revisar cómo estuvo la atmósfera y como evidencia del control diario de gases.</p>
    </>),
  },
  {
    id: "personal", titulo: "Operarios y obreros",
    cuerpo: (<>
      <p><em>Operarios</em> lista a quienes manejan máquinas y el equipo asignado. <em>Obreros</em> lista al personal y el frente en el que se encuentra; los frentes en alerta o peligro se marcan con un punto de color. El ingeniero y el supervisor SST pueden agregar, editar y eliminar personas.</p>
    </>),
  },
  {
    id: "exportar", titulo: "Exportar PDF",
    cuerpo: (<>
      <p>Elige el periodo (día, semana, mes u otro rango) y el frente, y pulsa <strong>Descargar PDF</strong>. El reporte incluye mínimos, promedios y máximos por variable, cuántas capturas estuvieron en alerta o peligro, gráficas y la tabla de capturas. <strong>Descargar capturas en CSV</strong> entrega todas las lecturas para abrirlas en Excel.</p>
    </>),
  },
  {
    id: "normatividad", titulo: "Normatividad y políticas",
    cuerpo: (<>
      <p>Documentos del sistema para consulta: partes interesadas, flujo de monitoreo y respuesta, procesos misionales, matriz de EPP, matriz de requisitos legales y plan de capacitación.</p>
    </>),
  },
  {
    id: "formatos", titulo: "Formatos",
    cuerpo: (<>
      <p>Listas para llenar en pantalla: chequeo de entrada y salida, checklist del supervisor, checklist de EPP, checklist de mantenimiento y seguimiento de KPI del dispositivo.</p>
      <ul>
        <li>Marca cada punto con los botones (Sí, No, N/A o Bueno, Malo…). Los resultados y el veredicto se calculan solos.</li>
        <li>Lo escrito se guarda en este navegador mientras no pulses <strong>Limpiar formato</strong>.</li>
        <li><strong>Imprimir o guardar PDF</strong> abre la impresión del navegador; elige "Guardar como PDF" para archivarlo y firmarlo.</li>
      </ul>
    </>),
  },
  {
    id: "simulador", titulo: "Simulador de sensores (ingeniero)",
    cuerpo: (<>
      <p>Mientras no haya sensores físicos, el ingeniero puede elegir en <em>Situación actual</em> el escenario Normal, Alerta o Peligro para hacer demostraciones. Los valores cambian de forma gradual en unos 20 a 40 segundos.</p>
    </>),
  },
  {
    id: "problemas", titulo: "Si algo no funciona",
    cuerpo: (
      <dl className="definiciones">
        <div><dt>"No hay conexión con el servidor"</dt><dd>La pantalla no alcanza la API. Revisa la red de la mina; los datos vuelven solos cuando regresa la conexión.</dd></div>
        <div><dt>Un frente aparece como "Sin datos"</dt><dd>Sus sensores no reportan hace más de 30 segundos. Verifica la estación del frente y los repetidores (ver checklist de mantenimiento).</dd></div>
        <div><dt>No suena la sirena</dt><dd>Pulsa <em>Activar sonido de alarma</em> y revisa que el volumen del equipo no esté silenciado.</dd></div>
        <div><dt>"Tu sesión expiró"</dt><dd>Vuelve a ingresar con tu usuario y contraseña.</dd></div>
      </dl>
    ),
  },
];

export function ManualUsuario() {
  return (
    <Seccion titulo="Manual del usuario" meta="AlpacAire, Mina La coqueta. Protección de vida: datos y alarmas tempranas en tiempo real"
      descripcion="Cómo usar cada sección de la plataforma." acciones={<button className="btn btn--claro" onClick={() => window.print()}>Imprimir o guardar PDF</button>}>
      <nav className="panel indice no-imprimir" aria-label="Contenido del manual">
        <h3 className="panel__titulo">Contenido</h3>
        <ol>{SECCIONES.map((s) => <li key={s.id}><a href={`#${s.id}`} onClick={(e) => { e.preventDefault(); document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" }); }}>{s.titulo}</a></li>)}</ol>
      </nav>
      {SECCIONES.map((s, i) => (
        <section key={s.id} id={s.id} className="panel manual__seccion">
          <h3 className="panel__titulo">{i + 1}. {s.titulo}</h3>
          <div className="manual__cuerpo">{s.cuerpo}</div>
        </section>
      ))}
      <Nota tipo="clave"><strong>Recuerda:</strong> AlpacAire detecta y alerta, pero no reemplaza el EPP, el autorrescatador ni la decisión del supervisor SST.</Nota>
    </Seccion>
  );
}
