import { useContext } from "react";
import { AuthContext } from "../../CONTEXT/AuthContext";
import { ROLES } from "../../CONSTANTES/roles";

import InscripcionesEquiposAdmin from "./InscripcionesEquiposAdmin";
import InscripcionesEquiposOrganizador from "./InscripcionesEquiposOrganizador";
import InscripcionesEquiposUsuario from "./InscripcionesEquiposUsuario";

export default function InscripcionesEquipos({ id_torneo }) {
  const { user } = useContext(AuthContext);

  if (user?.rol === ROLES.ADMINISTRADOR) {
    return <InscripcionesEquiposAdmin />;
  }

  if (user?.rol == ROLES.ORGANIZADOR) {
    return <InscripcionesEquiposOrganizador id_torneo={id_torneo} />;
  }

  return <InscripcionesEquiposUsuario id_torneo={id_torneo} />;
}
