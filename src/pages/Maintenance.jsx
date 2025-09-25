// src/pages/Maintenance.jsx
import { useEffect, useState } from "react";
import {
  listMaintenanceRequests,
  createMaintenanceRequest,
} from "../services/maintenance";

export default function Maintenance() {
  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState({ title: "", description: "" });
  const [msg, setMsg] = useState("");

  async function loadData() {
    try {
      const data = await listMaintenanceRequests();
      setRequests(data.results || data);
    } catch (err) {
      setMsg("Error al cargar las solicitudes.");
      console.error(err);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    setMsg("");
    try {
      await createMaintenanceRequest(form);
      setMsg("Solicitud enviada con éxito.");
      setForm({ title: "", description: "" }); // Limpiar formulario
      loadData(); // Recargar lista
    } catch (err) {
      setMsg("No se pudo enviar la solicitud.");
      console.error(err);
    }
  }

  return (
    <div style={{ padding: 24, display: "grid", gap: 24 }}>
      <h1>Mantenimiento y Soporte</h1>

      <section className="card">
        <h3>Reportar un Incidente</h3>
        <form onSubmit={onSubmit} style={{ display: "grid", gap: 12, maxWidth: 600 }}>
          <input
            placeholder="Título (ej. Foco quemado en pasillo)"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <textarea
            placeholder="Descripción del problema..."
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />
          <button type="submit">Enviar Reporte</button>
          {msg && <p style={{ color: msg.includes("Error") ? "red" : "#0a7" }}>{msg}</p>}
        </form>
      </section>

      <section>
        <h3>Mis Solicitudes</h3>
        <table width="100%" cellPadding="8" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f4f4f4" }}>
              <th>Título</th>
              <th>Estado</th>
              <th>Fecha de Reporte</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id} style={{ borderBottom: "1px solid #eee" }}>
                <td>{req.title}</td>
                <td>{req.status}</td>
                <td>{new Date(req.created_at).toLocaleString()}</td>
              </tr>
            ))}
            {!requests.length && (
              <tr>
                <td colSpan="3">No tienes solicitudes pendientes.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}