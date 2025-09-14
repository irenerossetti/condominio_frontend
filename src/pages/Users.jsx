// src/pages/Users.jsx
import { useEffect, useState } from "react";
import { listUsers, createUser, updateUser, deleteUser } from "../services/users";

const empty = {
  id: null,
  username: "",
  email: "",
  password: "",
  first_name: "",
  last_name: "",
  is_active: true,
  full_name: "",
  phone: "",
  role: "RESIDENT",
};

export default function Users() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  async function load() {
    setLoading(true);
    try {
      const data = await listUsers();
      setRows(data.results || data); // si hay paginación DRF, usa results
    } catch (e) {
      console.error(e);
      setMsg("No se pudo cargar la lista.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function onEdit(u) {
    setForm({
      id: u.id,
      username: u.username || "",
      email: u.email || "",
      password: "",
      first_name: u.first_name || "",
      last_name: u.last_name || "",
      is_active: u.is_active,
      full_name: u.profile?.full_name || "",
      phone: u.profile?.phone || "",
      role: u.profile?.role || "RESIDENT",
    });
  }

  function onNew() {
    setForm(empty);
  }

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    try {
      const payload = { ...form };
      if (!payload.password) delete payload.password; // no obligar password en edición

      if (payload.id) {
        await updateUser(payload.id, payload);
        setMsg("Usuario actualizado.");
      } else {
        await createUser(payload);
        setMsg("Usuario creado.");
      }
      await load();
      setForm(empty);
    } catch (e) {
      console.error(e);
      setMsg("Error al guardar.");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(id) {
    if (!confirm("¿Eliminar usuario?")) return;
    try {
      await deleteUser(id);
      await load();
    } catch (e) {
      console.error(e);
      setMsg("No se pudo eliminar.");
    }
  }

  return (
    <div style={{ padding: 24, display: "grid", gap: 16 }}>
      <h1>Usuarios</h1>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 8, gridTemplateColumns: "repeat(3, 1fr)" }}>
        <input placeholder="Usuario" value={form.username} onChange={e=>setForm({...form, username:e.target.value})}/>
        <input placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})}/>
        <input placeholder="Password" type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})}/>
        <input placeholder="Nombre" value={form.first_name} onChange={e=>setForm({...form, first_name:e.target.value})}/>
        <input placeholder="Apellido" value={form.last_name} onChange={e=>setForm({...form, last_name:e.target.value})}/>
        <label>
          Activo&nbsp;
          <input type="checkbox" checked={form.is_active} onChange={e=>setForm({...form, is_active:e.target.checked})}/>
        </label>
        <input placeholder="Nombre completo (perfil)" value={form.full_name} onChange={e=>setForm({...form, full_name:e.target.value})}/>
        <input placeholder="Teléfono (perfil)" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})}/>
        <select value={form.role} onChange={e=>setForm({...form, role:e.target.value})}>
          <option value="ADMIN">Administrador</option>
          <option value="RESIDENT">Residente</option>
          <option value="STAFF">Personal</option>
        </select>
        <div style={{ gridColumn: "1 / span 3" }}>
          <button disabled={saving}>{form.id ? "Actualizar" : "Crear"}</button>
          <button type="button" onClick={onNew} style={{ marginLeft: 8 }}>Nuevo</button>
          {msg && <span style={{ marginLeft: 12, color: "#0a7", fontWeight: 600 }}>{msg}</span>}
        </div>
      </form>

      <div>
        {loading ? "Cargando..." : (
          <table width="100%" cellPadding="8" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f4f4f4" }}>
                <th>ID</th><th>Usuario</th><th>Email</th><th>Rol</th><th>Activo</th><th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map(u => (
                <tr key={u.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td>{u.id}</td>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>{u.profile?.role || "-"}</td>
                  <td>{u.is_active ? "Sí" : "No"}</td>
                  <td>
                    <button onClick={() => onEdit(u)}>Editar</button>
                    <button onClick={() => onDelete(u.id)} style={{ marginLeft: 6 }}>Eliminar</button>
                  </td>
                </tr>
              ))}
              {!rows.length && <tr><td colSpan="6">Sin usuarios.</td></tr>}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
