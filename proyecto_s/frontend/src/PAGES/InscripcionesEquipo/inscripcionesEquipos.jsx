import { useContext } from "react";
import { AuthContext } from "../../CONTEXT/AuthContext";
import { ROLES } from "../../CONSTANTES/roles";

import InscripcionesEquiposAdmin from "./InscripcionesEquiposAdmin";
import InscripcionesEquiposOrganizador from "./InscripcionesEquiposOrganizador";

export default function InscripcionesEquipos({ id_torneo }) {
  const { user } = useContext(AuthContext);

  if (user?.rol === ROLES.ADMINISTRADOR) {
    return <InscripcionesEquiposAdmin />;
  }

  return <InscripcionesEquiposOrganizador id_torneo={id_torneo} />;
}
