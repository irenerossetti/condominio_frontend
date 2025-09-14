import { useEffect, useMemo, useState } from "react";
import { listUsers } from "../services/users";

export default function Users() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");

  async function load() {
    setLoading(true);
    try {
      const data = await listUsers();
      setRows(data.results || data);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter(u =>
      (u.username || "").toLowerCase().includes(s) ||
      (u.email || "").toLowerCase().includes(s) ||
      (u.profile?.full_name || "").toLowerCase().includes(s)
    );
  }, [rows, q]);

  return (
    <div className="users-page">
      <h1 className="page-title">Gestión de Usuarios</h1>
      <p className="page-sub">Administra los residentes del condominio</p>

      <div className="card" style={{ display:"grid", gap:12 }}>
        <div className="toolbar">
          <input
            className="grow"
            placeholder="Buscar por nombre, email o usuario…"
            value={q}
            onChange={e=>setQ(e.target.value)}
          />
          <button className="btn-outline">⚙️ Filtros</button>
          <div className="count-chip">🍃 {filtered.length} usuarios</div>
          <button>➕ Nuevo Usuario</button>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th style={{width:40}}></th>
              <th>Usuario</th>
              <th>Contacto</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id}>
                <td><input type="checkbox" /></td>
                <td>
                  <div style={{fontWeight:700}}>{u.profile?.full_name || u.username}</div>
                  <div style={{color:"var(--muted)"}}>@{u.username}</div>
                </td>
                <td>
                  <div>{u.email || "-"}</div>
                </td>
                <td>
                  <span className={"badge " + (u.is_active ? "success" : "gray")}>
                    {u.is_active ? "Activo" : "Inactivo"}
                  </span>
                </td>
              </tr>
            ))}
            {!filtered.length && (
              <tr><td colSpan={4}>Sin resultados.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
