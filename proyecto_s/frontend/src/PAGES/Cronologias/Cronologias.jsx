import { useContext } from "react";
import { AuthContext } from "../../CONTEXT/AuthContext";
import { ROLES } from "../../CONSTANTES/roles";

import CronologiasAdmin from "./CronologiasAdmin";
import CronologiasOrganizador from "./CronologiasOrganizador";

export default function Cronologias() {
  const { user } = useContext(AuthContext);

  if (user?.rol === ROLES.ORGANIZADOR) {
    return <CronologiasOrganizador />;
  }

  return <CronologiasAdmin />;
}
