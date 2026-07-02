import { useContext } from "react";
import { AuthContext } from "../../CONTEXT/AuthContext";
import { ROLES } from "../../CONSTANTES/roles";

import EquiposAdmin from "./EquiposAdmin";
import EquiposOrganizador from "./EquiposOrganizador";
import EquiposJugador from "./EquiposJugador";
import EquiposUsuario from "./EquipoUsuario";

export default function Equipos() {
  const { user } = useContext(AuthContext);

  if (user?.rol === ROLES.ADMINISTRADOR) {
    return <EquiposAdmin />;
  }

  if (user?.rol === ROLES.ORGANIZADOR) {
    return <EquiposOrganizador />;
  }

  if (user?.rol === ROLES.USUARIO) {
    return <EquiposJugador />;
  }

  // return <EquiposUsuario />;
}
