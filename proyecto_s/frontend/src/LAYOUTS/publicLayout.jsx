import Navbar from "../COMPONENTES/Navbar";
import Sidebar from "../COMPONENTES/Sidebar";
import { Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../CONTEXT/AuthContext";

export default function PublicLayout() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <div style={{ width: "100%" }}>
      <Navbar /> 

      <div style={{ display: "flex" }}>
        {isAuthenticated && <Sidebar />}

        <main
          style={{
            flex: 1,
            padding: "20px",
            marginLeft: isAuthenticated ? "0" : "0",
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}