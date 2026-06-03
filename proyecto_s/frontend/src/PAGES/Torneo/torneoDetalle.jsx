import { useContext } from "react";
import { AuthContext } from "../../CONTEXT/AuthContext";
import { ROLES } from "../../CONSTANTES/roles";

import TorneoDetalleOrganizador from "./TorneoDetalleOrganizador";
import TorneoDetalleUsuario from "./TorneoDetalleUsuario";

export default function Torneos() {
  const { user } = useContext(AuthContext);

  if (user?.rol === ROLES.ORGANIZADOR) {
    return <TorneoDetalleOrganizador />;
  }

  if (user?.rol === ROLES.USUARIO) {
    return <TorneoDetalleUsuario />;
  }

  // fallback seguro
  return <p>No tienes acceso a esta sección</p>;
}
