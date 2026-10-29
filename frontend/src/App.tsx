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
import Situacion from "./pages/Situacion";

const RUTAS: Record<string, { permiso: string; el: () => ReactElement; titulo: string }> = {
  "/situacion": { permiso: "situacion", el: () => <Situacion />, titulo: "Situación actual" },
  "/frentes": { permiso: "frentes", el: () => <Frentes />, titulo: "Frentes" },
  "/detalles": { permiso: "detalles", el: () => <Detalles />, titulo: "Detalles" },
  "/operarios": { permiso: "operarios", el: () => <Personal tipo="operario" />, titulo: "Operarios" },
  "/obreros": { permiso: "obreros", el: () => <Personal tipo="obrero" />, titulo: "Obreros" },
  "/exportar": { permiso: "exportar", el: () => <Exportar />, titulo: "Exportar PDF" },
  "/ayuda": { permiso: "situacion", el: () => <Ayuda />, titulo: "Ayuda" },
};

export default function App() {
  const { usuario, cargando, puede, estado } = useSesion();
  const { path, navigate } = useRouter();
  const ruta = RUTAS[path];

  useEffect(() => {
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
