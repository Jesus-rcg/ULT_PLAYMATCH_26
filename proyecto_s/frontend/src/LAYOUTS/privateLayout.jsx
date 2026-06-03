import Sidebar from "../COMPONENTES/Sidebar";
import Navbar from "../COMPONENTES/Navbar";
import { Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../CONTEXT/AuthContext";
import "../STILO/layouts/layoutPrivate.css";

export default function PrivateLayout() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <>
      {isAuthenticated && <Sidebar />}

      <main className={isAuthenticated ? "main-content" : ""}>
        <Outlet />
      </main>
    </>
  );
}
