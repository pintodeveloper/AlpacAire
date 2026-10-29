export default function Seccion({ titulo, descripcion }: { titulo: string; descripcion: string }) {
  return (
    <div className="pagina pagina--estrecha">
      <div className="pagina__cabeza">
        <h2>{titulo}</h2>
        <p className="tenue">{descripcion}</p>
      </div>
      <section className="panel vacio">
        <p>Esta sección aún no tiene contenido.</p>
      </section>
    </div>
  );
}
