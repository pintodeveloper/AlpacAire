import { useState } from "react";
import { LogoMark } from "../components/Logo";
import { desbloquearAudio } from "../lib/alarm";
import { useSesion } from "../lib/session";

const DEMO = [
  ["andrey", "Ingeniero"], ["sst", "Supervisor SST"], ["dueno", "Dueño"],
  ["ministerio", "Ministerio"], ["operario", "Operario"], ["obrero", "Obrero"],
];

// Solo se muestra si el build define VITE_DEMO_PASSWORD (útil para el jurado de la hackatón).
const DEMO_PASSWORD: string = import.meta.env.VITE_DEMO_PASSWORD ?? "";

export default function Login() {
  const { login } = useSesion();
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    desbloquearAudio(); // el clic permite que la sirena suene después
    setEnviando(true); setError(null);
    try { await login(usuario, password); }
    catch (err) { setError((err as Error).message); }
    finally { setEnviando(false); }
  };

  return (
    <div className="login">
      <section className="login__marca">
        <LogoMark size={220} color="#EDF0EF" bg="var(--pizarra)" />
        <h1>AlpacAire</h1>
        <p>Protección de vida: datos y alarmas tempranas en tiempo real.</p>
        <span className="login__mina">Mina "La coqueta", Cúcuta</span>
      </section>
      <section className="login__form">
        <form onSubmit={enviar}>
          <h2>Ingresar</h2>
          <label className="campo"><span>Usuario</span>
            <input autoFocus autoComplete="username" value={usuario} onChange={(e) => setUsuario(e.target.value)} required /></label>
          <label className="campo"><span>Contraseña</span>
            <input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
          {error && <p className="error" role="alert">{error}</p>}
          <button className="btn btn--primario btn--ancho" disabled={enviando}>{enviando ? "Ingresando…" : "Ingresar"}</button>
          {DEMO_PASSWORD && <details className="login__demo">
            <summary>Usuarios de demostración</summary>
            <p>Contraseña de todos: <code>{DEMO_PASSWORD}</code></p>
            <ul>
              {DEMO.map(([u, r]) => (
                <li key={u}><button type="button" className="btn-texto" onClick={() => { setUsuario(u); setPassword(DEMO_PASSWORD); }}>{u}</button> {r}</li>
              ))}
            </ul>
          </details>}
        </form>
      </section>
    </div>
  );
}
