import { useContext } from "react";
import { AuthContext } from "../../CONTEXT/AuthContext";
import { ROLES } from "../../CONSTANTES/roles";

import ResultadoAdmin from "./ResultadoAdmin";
import ResultadoOrganizador from "./ResultadoOrganizador";
import ResultadoJugador from "./ResultadoJugador";

export default function Resultados() {
  const { user } = useContext(AuthContext);

  if (user?.rol === ROLES.ADMINISTRADOR) {
    return <ResultadoAdmin />;
  }

  if (user?.rol === ROLES.ORGANIZADOR) {
    return <ResultadoOrganizador />;
  }

  return <ResultadoJugador />;
}
