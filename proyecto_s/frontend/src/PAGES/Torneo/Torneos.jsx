import { useContext } from "react";
import { AuthContext } from "../../CONTEXT/AuthContext";
import { ROLES } from "../../CONSTANTES/roles";

import TorneosAdmin from "./TorneosAdmin";
import TorneosOrganizador from "./TorneosOrganizador";
import TorneosJugador from "./TorneosJugador";

export default function Torneos() {
  const { user } = useContext(AuthContext);

  if (user?.rol === ROLES.ADMINISTRADOR) {
    return <TorneosAdmin />;
  }

  if (user?.rol === ROLES.ORGANIZADOR) {
    return <TorneosOrganizador />;
  }
}
