import { useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../CONTEXT/AuthContext";
import { ROLES } from "../../CONSTANTES/roles";

import EncuentrosAdmin from "./EncuentrosAdmin";
import EncuentrosOrganizador from "./EncuentrosOrganizador";

export default function Encuentros() {
  const { user } = useContext(AuthContext);
  const { id_torneo } = useParams();
  const params = useParams();

  if (user?.rol === ROLES.ADMINISTRADOR) {
    return <EncuentrosAdmin />;
  }

  if (user?.rol === ROLES.ORGANIZADOR) {
    return <EncuentrosOrganizador />;
  }

  return null;
}
