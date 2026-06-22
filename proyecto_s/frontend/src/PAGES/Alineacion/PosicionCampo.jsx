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
  renderBotonesEvento,

  soloLectura = false,

  obtenerEstadisticasJugador,
}) {
  const jugador = posiciones[id];

  if (soloLectura && !jugador) {
    return null;
  }

  const stats =
    jugador && typeof obtenerEstadisticasJugador === "function"
      ? obtenerEstadisticasJugador(jugador.id_jugador)
      : {
          goles: 0,
          amarillas: 0,
          rojas: 0,
        };

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
        onDrop={
          !soloLectura && handleDrop ? (e) => handleDrop(e, id) : undefined
        }
        onDragOver={!soloLectura && handleDragOver ? handleDragOver : undefined}
        draggable={!soloLectura && !!jugador}
        onDragStart={
          !soloLectura && handleDragStart
            ? (e) => handleDragStart(e, jugador)
            : undefined
        }
        onClick={() => {
          if (jugador && handleSeleccionarJugador) {
            handleSeleccionarJugador(id);
          }
        }}
      >
        <div className="cajita">
          <div className="n-camiseta">
            {jugador ? jugador.numero_camiseta : ""}
          </div>

          <div>{jugador ? `${jugador.nombre_usuario}` : abreviatura}</div>

          {/* 🔥 ESTADÍSTICAS */}
          {jugador && (
            <div className="estadisticas">
              {stats.goles > 0 && (
                <div className="badge-gol">
                  <span className="cantida">{stats.goles}</span>
                  <br />
                  <span className="icono-gol">⚽</span>
                </div>
              )}

              {stats.amarillas > 0 && (
                <div className="badge-tarjeta">
                  <span className="cantida">{stats.amarillas}</span>
                  <br />
                  <span className="icono-tarjeta">🟨</span>
                </div>
              )}

              {stats.rojas > 0 && (
                <div className="badge-tarjeta">
                  <span className="cantida">{stats.rojas}</span>
                  <br />
                  <span className="icono-tarjeta">🟥</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="btn-l">
        {!soloLectura && renderBotonEliminar && renderBotonEliminar(id)}
      </div>

      <div className="btn-evento">
        {renderBotonesEvento && renderBotonesEvento(id)}
      </div>
    </div>
  );
}
