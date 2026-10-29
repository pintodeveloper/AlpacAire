import { useEffect, type ReactElement } from "react";
import { Layout } from "./components/Layout";
import { useRouter } from "./lib/router";
import { useSesion } from "./lib/session";
import Ayuda from "./pages/Ayuda";
import Detalles from "./pages/Detalles";
import Exportar from "./pages/Exportar";
import Frentes from "./pages/Frentes";
import Login from "./pages/Login";
import Personal from "./pages/Personal";
import { ChecklistEPP, ChecklistMantenimiento, ChecklistSupervisor, ListaChequeo, SeguimientoKPI } from "./pages/docs/Formatos";
import { CronogramaMantenimiento, Documentos, SistemaGases } from "./pages/docs/Documentos";
import { ManualUsuario } from "./pages/docs/Manual";
import Historial from "./pages/Historial";
import { FlujoMonitoreo, MatrizEPP, MatrizRequisitos, PartesInteresadas, PlanCapacitacion, ProcesosMisionales } from "./pages/docs/Normatividad";
import Situacion from "./pages/Situacion";

const RUTAS: Record<string, { permiso: string; el: () => ReactElement; titulo: string }> = {
  "/situacion": { permiso: "situacion", el: () => <Situacion />, titulo: "Situación actual" },
  "/frentes": { permiso: "frentes", el: () => <Frentes />, titulo: "Frentes" },
  "/detalles": { permiso: "detalles", el: () => <Detalles />, titulo: "Detalles" },
  "/operarios": { permiso: "operarios", el: () => <Personal tipo="operario" />, titulo: "Operarios" },
  "/obreros": { permiso: "obreros", el: () => <Personal tipo="obrero" />, titulo: "Obreros" },
  "/exportar": { permiso: "exportar", el: () => <Exportar />, titulo: "Exportar PDF" },
  "/ayuda": { permiso: "situacion", el: () => <Ayuda />, titulo: "Ayuda" },
  "/normatividad/partes-interesadas": { permiso: "situacion", el: () => <PartesInteresadas />, titulo: "Partes interesadas" },
  "/normatividad/flujo-monitoreo": { permiso: "situacion", el: () => <FlujoMonitoreo />, titulo: "Flujo de monitoreo" },
  "/normatividad/procesos-misionales": { permiso: "situacion", el: () => <ProcesosMisionales />, titulo: "Procesos misionales" },
  "/normatividad/matriz-epp": { permiso: "situacion", el: () => <MatrizEPP />, titulo: "Matriz EPP" },
  "/normatividad/matriz-requisitos": { permiso: "situacion", el: () => <MatrizRequisitos />, titulo: "Matriz de requisitos" },
  "/normatividad/plan-capacitacion": { permiso: "situacion", el: () => <PlanCapacitacion />, titulo: "Plan de capacitación" },
  "/formatos/lista-chequeo": { permiso: "situacion", el: () => <ListaChequeo />, titulo: "Lista de chequeo" },
  "/formatos/checklist-supervisor": { permiso: "situacion", el: () => <ChecklistSupervisor />, titulo: "Checklist supervisor" },
  "/formatos/checklist-epp": { permiso: "situacion", el: () => <ChecklistEPP />, titulo: "Checklist EPP" },
  "/formatos/checklist-mantenimiento": { permiso: "situacion", el: () => <ChecklistMantenimiento />, titulo: "Checklist mantenimiento" },
  "/formatos/seguimiento-kpi": { permiso: "situacion", el: () => <SeguimientoKPI />, titulo: "Seguimiento KPI" },
  "/formatos/manual-usuario": { permiso: "situacion", el: () => <ManualUsuario />, titulo: "Manual del usuario" },
  "/documentos": { permiso: "situacion", el: () => <Documentos />, titulo: "Documentos" },
  "/normatividad/sistema-gases": { permiso: "situacion", el: () => <SistemaGases />, titulo: "Sistema de gases" },
  "/formatos/cronograma-mantenimiento": { permiso: "situacion", el: () => <CronogramaMantenimiento />, titulo: "Cronograma de mantenimiento" },
  "/historial": { permiso: "situacion", el: () => <Historial />, titulo: "Historial" },
};

export default function App() {
  const { usuario, cargando, puede, estado } = useSesion();
  const { path, navigate } = useRouter();
  const ruta = RUTAS[path];

  useEffect(() => {
    if (path === "/normatividad" || path === "/formatos") return navigate("/documentos");
    if (usuario && (!ruta || !puede(ruta.permiso))) navigate("/situacion");
  }, [usuario, path]); // eslint-disable-line

  useEffect(() => {
    const pre = estado?.nivel === "peligro" ? "¡EVACUACIÓN! " : estado?.nivel === "alerta" ? "Alerta – " : "";
    document.title = `${pre}${ruta?.titulo ?? "AlpacAire"} – AlpacAire`;
  }, [ruta, estado?.nivel]);

  if (cargando) return null;
  if (!usuario) return <Login />;
  return <Layout>{ruta && puede(ruta.permiso) ? ruta.el() : null}</Layout>;
}
