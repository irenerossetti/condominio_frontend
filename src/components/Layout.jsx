import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { fetchMe } from "../services/me";
import LogoutButton from "./LogoutButton";

export default function Layout() {
  const [me, setMe] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMe().then(setMe).catch(() => navigate("/login", { replace: true }));
  }, [navigate]);

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