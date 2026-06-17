export default function PosicionCampo({
  id,
  clase,
  abreviatura,
  posiciones,
  handleDrop,
  handleDragOver,
  handleDragStart,
  handleSeleccionarJugador,
  renderBotonEliminar,
}) {
  const jugador = posiciones[id];

  return (
    <div className="contenedor-posicion">
      <div
        className={`${clase} ${
          jugador
            ? jugador.equipo === "A"
              ? "ocupado-local"
              : "ocupado-visitante"
            : ""
        }`}
        onDrop={(e) => handleDrop(e, id)}
        onDragOver={handleDragOver}
        onClick={() => handleSeleccionarJugador(id)}
        draggable={!!jugador}
        onDragStart={(e) => jugador && handleDragStart(e, jugador)}
      >
        <div className="cajita">
          <div className="n-camiseta">
            {jugador ? jugador.numero_camiseta : ""}
          </div>

          <div>{jugador ? jugador.nombre_usuario : abreviatura}</div>
        </div>
      </div>

      <div className="btn-l">{renderBotonEliminar(id)}</div>
    </div>
  );
}
