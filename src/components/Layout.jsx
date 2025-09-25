import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom"; // <-- Asegúrate de que useLocation está aquí
import { fetchMe } from "../services/me";
import { logPageAccess } from "../services/log";
import LogoutButton from "./LogoutButton";

// Mapea las rutas a un nombre legible
const pageMap = {
  "/dashboard": "Dashboard",
  "/my-account": "Mi Cuenta",
  "/notices": "Avisos",
  "/fees": "Cuotas",
  "/reservations": "Reservas",
  "/maintenance": "Mantenimiento",
  "/users": "Usuarios",
  "/units": "Unidades",
  "/reports": "Reportes",
  "/activity-log": "Bitácora de Actividad",
};

export default function Layout() {
  const [me, setMe] = useState(null);
  const navigate = useNavigate();
  const location = useLocation(); // 👈 Obtiene el objeto de ubicación

  useEffect(() => {
    fetchMe().then(setMe).catch(() => navigate("/login", { replace: true }));
  }, [navigate]);

  // 👈 Nuevo useEffect para registrar la visita a la página
  useEffect(() => {
    const pageName = pageMap[location.pathname] || location.pathname;
    logPageAccess(pageName)
      .catch(err => console.error("Error al registrar acceso a página:", err));
  }, [location.pathname]); // El efecto se ejecuta cada vez que cambia la ruta

  const isAdmin = me?.profile?.role === "ADMIN";
  const s = ({ isActive }) => "s-navlink" + (isActive ? " active" : "");

  return (
    <div className="app-shell has-sidebar">
      {/* Sidebar */}
      <aside className="sidebar">
        <a className="brand" href="/dashboard" title="Ir al inicio">
          <img src="/brand/logo-smart.png" alt="Smart" className="brand-mark" />
          <div className="brand-text">
            <strong>Smart</strong><span>Condominium</span>
          </div>
        </a>

        <nav className="side-nav">
          <NavLink to="/dashboard" className={s}>🏠 Inicio</NavLink>
          <NavLink to="/my-account" className={s}>👤 Mi cuenta</NavLink>
          <NavLink to="/notices" className={s}>🔔 Avisos</NavLink>
          <NavLink to="/fees" className={s}>💳 Cuotas</NavLink>
          <NavLink to="/reservations" className={s}>📅 Reservas</NavLink>
          {/* --- LÍNEA AÑADIDA --- */}
          <NavLink to="/maintenance" className={s}>🛠️ Mantenimiento</NavLink>
          
          {isAdmin && (
            <>
              <NavLink to="/users" className={s}>👥 Usuarios</NavLink>
              <NavLink to="/units" className={s}>🏢 Unidades</NavLink>
              <NavLink to="/reports" className={s}>📄 Reportes</NavLink>
              <NavLink to="/activity-log" className={s}>📋 Bitácora</NavLink>
            </>
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="whoami">
            <div className="avatar">{(me?.username || "?")[0]?.toUpperCase()}</div>
            <div>
              <div style={{ fontWeight: 700 }}>{me?.username || "—"}</div>
              <div className="role">{me?.profile?.role || "—"}</div>
            </div>
          </div>
          <LogoutButton>Cerrar sesión</LogoutButton>
        </div>
      </aside>

      {/* Contenido */}
      <main className="content">
        <header className="topbar">
          <div className="app-title">🌿 Gestión Ecológica e Inteligente</div>
          <div style={{ opacity: .6 }}>🔔</div>
        </header>

        <div className="app-main">
          <div className="container">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}