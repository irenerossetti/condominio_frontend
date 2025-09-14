// src/pages/Dashboard.jsx
import { Link } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";

export default function Dashboard() {
  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
        <Link to="/my-account">Mi cuenta</Link>
        <Link to="/users">Usuarios</Link>
        <Link to="/units">Casas</Link>
        <Link to="/fees">Cuotas</Link>
        <Link to="/notices">Avisos</Link>
        <Link to="/reports" style={{ marginRight: 12 }}>Reportes</Link>

        <LogoutButton />
      </div>
      <h1>Dashboard</h1>
    </div>
  );
}
