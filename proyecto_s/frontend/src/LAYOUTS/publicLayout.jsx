import Navbar from "../COMPONENTES/Navbar";
import Sidebar from "../COMPONENTES/Sidebar";
import { Outlet, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../CONTEXT/AuthContext";

export default function PublicLayout() {
  const location = useLocation();

  const mostrarSidebar = ["/home", "/equipos"].includes(location.pathname);

  return (
    <div style={{ width: "100%" }}>
      <Navbar /> 

      <div style={{ display: "flex" }}>
        {mostrarSidebar && <Sidebar />}

        <main
          style={{
            flex: 1,
            padding: "20px",
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}