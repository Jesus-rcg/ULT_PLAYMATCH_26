import Sidebar from "../COMPONENTES/Sidebar";
import Navbar from "../COMPONENTES/Navbar";
import { Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../CONTEXT/AuthContext";
import "../STILO/layouts/layoutPrivate.css";

export default function PrivateLayout() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <div className="private-wrapper">
      <Navbar />
      <div className="private-body">
        {isAuthenticated && <Sidebar />}
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
