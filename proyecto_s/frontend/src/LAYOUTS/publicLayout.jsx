import Navbar from "../COMPONENTES/Navbar";
import Sidebar from "../COMPONENTES/Sidebar";
import { Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../CONTEXT/AuthContext";

export default function PublicLayout() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <div style={{ width: "100%" }}>
      {/* 🔐 Sidebar SOLO si está logueado */}
      {isAuthenticated && <Sidebar />}

      {/* 📄 Contenido */}
      <main
        style={{
          padding: "20px",
          marginTop: "60px",
          marginLeft: isAuthenticated ? "220px" : "0", // 👈 para que no se encime
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}
