import { useContext } from "react";
import { AuthContext } from "../../CONTEXT/AuthContext";
import { ROLES } from "../../CONSTANTES/roles";

import PosicionesAdmin from "./PosicionesAdmin";
import PosicionesOrganizador from "./PosicionesOrganizador";

export default function Posiciones() {
  const { user } = useContext(AuthContext);

  if (user?.rol === ROLES.ADMINISTRADOR) {
    return <PosicionesAdmin />;
  }

  return <PosicionesOrganizador />;
}
