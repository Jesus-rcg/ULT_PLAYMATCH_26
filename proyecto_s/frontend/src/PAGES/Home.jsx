import "../STILO/estilosPages/home.css";

export default function Home() {
  return (
    <div className="home-container">
      {/* HERO */}
      <section className="hero">
        <h1>⚽ Bienvenido a PlayMatch</h1>

        <p className="hero-description">
          PlayMatch es una plataforma web diseñada para la
          gestión de torneos de fútbol. Permite organizar competencias,
          administrar equipos, registrar jugadores, programar encuentros y
          consultar resultados desde un único lugar, facilitando la experiencia
          tanto para organizadores como para entrenadores y jugadores.
        </p>
      </section>

      {/* CARACTERÍSTICAS */}
      <section className="features">
        <h2>¿Qué puedes hacer en PlayMatch?</h2>

        <div className="cards">

          <div className="card">
            <div className="icon">🏆</div>
            <h3>Administrar torneos</h3>
            <p>
              Crea torneos, configura sus encuentros y administra todo el desarrollo
              de la competencia.
            </p>
          </div>

          <div className="card">
            <div className="icon">👥</div>
            <h3>Gestionar equipos</h3>
            <p>
              Registra equipos, administra su información y controla su
              participación en los torneos.
            </p>
          </div>

          <div className="card">
            <div className="icon">⚽</div>
            <h3>Administrar jugadores</h3>
            <p>
              Mantén organizada la información de los jugadores pertenecientes a
              cada equipo.
            </p>
          </div>

          <div className="card">
            <div className="icon">📅</div>
            <h3>Programar encuentros</h3>
            <p>
              Organiza el calendario de partidos y consulta la programación de
              cada jornada.
            </p>
          </div>

          <div className="card">
            <div className="icon">📊</div>
            <h3>Resultados y posiciones</h3>
            <p>
              Registra marcadores y consulta automáticamente la tabla de
              posiciones del torneo.
            </p>
          </div>

          <div className="card">
            <div className="icon">🏃</div>
            <h3>Jugadores y equipo</h3>
            <p>
              Inscribete para dar la máxima calidad en un equipo y participa en los mejores
              torneos de fútbol.
            </p>
          </div>


        </div>
      </section>

      {/* ROLES */}
      <section className="roles">
        <h2>Roles dentro de la plataforma</h2>

        <div className="role-card">
          <h3>👑 Organizador</h3>

          <ul>
            <li>Crear torneos.</li>
            <li>Administrar equipos inscritos.</li>
            <li>Programar encuentros.</li>
            <li>Registrar resultados.</li>
            <li>Gestionar el desarrollo del torneo.</li>
          </ul>
        </div>

        <div className="role-card">
          <h3>🛡️ Entrenador</h3>

          <ul>
            <li>Crear y administrar equipos.</li>
            <li>Inscribir jugadores para su equipo.</li>
            <li>Inscribir a sus equipos en torneos.</li>
            <li>Consultar encuentros y resultados.</li>
          </ul>
        </div>

        <div className="role-card">
          <h3>⚽ Jugador</h3>

          <ul>
            <li>Inscribirse a un equipo.</li>
            <li>Consultar la información de su equipo.</li>
            <li>Ver el calendario de encuentros.</li>
            <li>Consultar resultados y posiciones.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}