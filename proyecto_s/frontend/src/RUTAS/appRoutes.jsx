import { Routes, Route, Navigate } from "react-router-dom";
import { ROLES } from "../CONSTANTES/roles";

//Vistas sin login
import Home from "../PAGES/Home";
import TorneoDetalle from "../PAGES/Torneo/TorneoDetalle";

//Login
import Login from "../PAGES/Login/login";
import Registrar from "../PAGES/Login/Registrar";
import ForgotPassword from "../PAGES/Login/ForgotPassword";
import ResetPassword from "../PAGES/Login/ResetPassword";

//Layouts
import PublicLayout from "../LAYOUTS/PublicLayout";
import PrivateLayout from "../LAYOUTS/PrivateLayout";
import ProtectedRoute from "../CONTEXT/protectedRoute";

//Usuarios
import Usuarios from "../PAGES/Usuario/Usuarios";
import UsuarioCrear from "../PAGES/Usuario/UsuarioCrear";
import UsuarioEditar from "../PAGES/Usuario/UsuarioEditar";
import UsuarioEliminar from "../PAGES/Usuario/UsuarioEliminar";

//Torneos
import Torneos from "../PAGES/Torneo/Torneos";
import TorneoCrear from "../PAGES/Torneo/TorneoCrear";
import TorneoEditar from "../PAGES/Torneo/TorneoEditar";
import TorneoEliminar from "../PAGES/Torneo/TorneoEliminar";

//Inscripciones de equipos
import InscripcionesEquipos from "../PAGES/InscripcionesEquipo/inscripcionesEquipos";
import InscripcionesEquiposCrear from "../PAGES/InscripcionesEquipo/inscripcionesEquiposCrear";
import InscripcionesEquiposEditar from "../PAGES/InscripcionesEquipo/inscripcionesEquiposEditar";
import InscripcionesEquiposEliminar from "../PAGES/InscripcionesEquipo/inscripcionesEquiposEliminar";

//Equipos
import Equipos from "../PAGES/Equipos/Equipos";
import EquipoCrear from "../PAGES/Equipos/EquipoCrear";
import EquipoEditar from "../PAGES/Equipos/EquipoEditar";
import EquipoEliminar from "../PAGES/Equipos/EquipoEliminar";

//Inscripciones de jugadores
import InscripcionJugadores from "../PAGES/InscripcionJugador/InscripcionJugadores";
import InscripcionJugadoresCrear from "../PAGES/InscripcionJugador/InscripcionJugadoresCrear";
import InscripcionJugadoresEditar from "../PAGES/InscripcionJugador/InscripcionJugadoresEditar";
import InscripcionJugadoresEliminar from "../PAGES/InscripcionJugador/InscripcionJugadoresEliminar";

//Jugadores
import Jugadores from "../PAGES/Jugadores/Jugadores";
import JugadorCrear from "../PAGES/Jugadores/JugadorCrear";
import JugadorEditar from "../PAGES/Jugadores/JugadorEditar";
import JugadorEliminar from "../PAGES/Jugadores/JugadorEliminar";

//Encuentros
import Encuentros from "../PAGES/Encuentros/Encuentros";
import EncuentrosAdmin from "../PAGES/Encuentros/EncuentrosAdmin";
import EncuentrosCrear from "../PAGES/Encuentros/EncuentrosCrear";
import EncuentrosEditar from "../PAGES/Encuentros/EncuentrosEditar";
import EncuentrosEliminar from "../PAGES/Encuentros/EncuentrosEliminar";

//Cronologias
import Cronologias from "../PAGES/Cronologias/Cronologias";
import CronologiasOrganizador from "../PAGES/Cronologias/CronologiasOrganizador";
import CronologiasCrear from "../PAGES/Cronologias/CronologiasCrear";
import CronologiasEditar from "../PAGES/Cronologias/CronologiasEditar";
import CronologiasEliminar from "../PAGES/Cronologias/CronologiasEliminar";

//Resultados
import Resultados from "../PAGES/Resultados/Resultados";
import ResultadosCrear from "../PAGES/Resultados/ResultadosCrear";
import ResultadosEditar from "../PAGES/Resultados/ResultadosEditar";
import ResultadosEliminar from "../PAGES/Resultados/ResultadosEliminar";

//Posiciones
import Posiciones from "../PAGES/Posiciones/Posiciones";

export default function AppRoutes() {
  return (
    <Routes>
      {/* PUBLICAS */}
      <Route element={<PublicLayout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/torneo/:id" element={<TorneoDetalle />} />

        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registrar />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* PRIVADAS */}
      <Route element={<ProtectedRoute />}>
        <Route element={<PrivateLayout />}>
          <Route
            element={<ProtectedRoute allowedRoles={[ROLES.ADMINISTRADOR]} />}
          >
            //Usuarios
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/usuarios/crear" element={<UsuarioCrear />} />
            <Route path="/usuarios/editar/:id" element={<UsuarioEditar />} />
            <Route
              path="/usuarios/eliminar/:id"
              element={<UsuarioEliminar />}
            />
          </Route>
          //********************************************************************************************
          */
          <Route
            element={
              <ProtectedRoute
                allowedRoles={[ROLES.ADMINISTRADOR, ROLES.ORGANIZADOR]}
              />
            }
          >
            //Cronologias
            <Route path="/cronologias" element={<Cronologias />} />
            <Route
              path="/cronologias/:id"
              element={<CronologiasOrganizador />}
            />
            <Route path="/cronologias/Crear" element={<CronologiasCrear />} />
            <Route
              path="/cronologias/Editar/:id"
              element={<CronologiasEditar />}
            />
            <Route
              path="/cronologias/Eliminar/:id"
              element={<CronologiasEliminar />}
            />
          </Route>
          //*********************************************************************************************
          */
          <Route
            element={
              <ProtectedRoute
                allowedRoles={[
                  ROLES.USUARIO,
                  ROLES.ADMINISTRADOR,
                  ROLES.ORGANIZADOR,
                ]}
              />
            }
          >
            //------------------------Tornoes----------------------------------------
            <Route path="/torneos/:id_torneo" element={<Torneos />} />
            <Route path="/torneos" element={<Torneos />} />
            <Route path="/torneos/crear" element={<TorneoCrear />} />
            <Route path="/torneos/editar/:id" element={<TorneoEditar />} />
            <Route path="/torneos/eliminar/:id" element={<TorneoEliminar />} />
            //----------------Inscripcio-de-equipos----------------------------------
            <Route
              path="/inscripcionEquipos"
              element={<InscripcionesEquipos />}
            />
            <Route
              path="/inscripcionEquipos/Crear"
              element={<InscripcionesEquiposCrear />}
            />
            <Route
              path="/inscripcionEquipos/Editar/:id"
              element={<InscripcionesEquiposEditar />}
            />
            <Route
              path="/inscripcionEquipos/Eliminar/:id"
              element={<InscripcionesEquiposEliminar />}
            />
            //---------------------Equipos--------------------------------------------
            <Route path="/equipos" element={<Equipos />} />
            <Route path="/equipos/crear" element={<EquipoCrear />} />
            <Route path="/equipos/editar/:id" element={<EquipoEditar />} />
            <Route path="/equipos/eliminar/:id" element={<EquipoEliminar />} />
            //--------------Inscripciones-de-jugadores---------------------------------
            <Route
              path="/inscripcionJugadores"
              element={<InscripcionJugadores />}
            />
            <Route
              path="/inscripcionJugadores/Crear"
              element={<InscripcionJugadoresCrear />}
            />
            <Route
              path="/inscripcionJugadores/Editar/:id"
              element={<InscripcionJugadoresEditar />}
            />
            <Route
              path="/inscripcionJugadores/Eliminar/:id"
              element={<InscripcionJugadoresEliminar />}
            />
            //-------------------Jugadores-----------------------------------------------
            <Route path="/jugadores" element={<Jugadores />} />
            <Route path="/jugadores/crear" element={<JugadorCrear />} />
            <Route path="/jugadores/editar/:id" element={<JugadorEditar />} />
            <Route
              path="/jugadores/eliminar/:id"
              element={<JugadorEliminar />}
            />
            //---------------------Encuentros---------------------------------------------
            <Route path="/encuentros/:id_torneo" element={<Encuentros />} />
            <Route path="/encuentros" element={<EncuentrosAdmin />} />
            <Route
              path="/encuentros/Crear/:id_torneo"
              element={<EncuentrosCrear />}
            />
            <Route path="/encuentros/Crear" element={<EncuentrosCrear />} />
            <Route
              path="/encuentros/Editar/:id"
              element={<EncuentrosEditar />}
            />
            <Route
              path="/encuentros/Eliminar/:id"
              element={<EncuentrosEliminar />}
            />
            //-----------------------Resultados--------------------------------------------
            <Route path="/resultados" element={<Resultados />} />
            <Route path="/resultados/Crear" element={<ResultadosCrear />} />
            <Route
              path="/resultados/Editar/:id"
              element={<ResultadosEditar />}
            />
            <Route
              path="/resultados/Eliminar/:id"
              element={<ResultadosEliminar />}
            />
            //-------------------------Posiciones------------------------------------------
            <Route path="/posiciones" element={<Posiciones />} />
          </Route>
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/home" />} />
    </Routes>
  );
}
