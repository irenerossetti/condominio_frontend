// src/pages/Maintenance.jsx
import { useEffect, useState } from "react";
import {
  listMaintenanceRequests,
  createMaintenanceRequest,
  updateMaintenanceRequestStatus, // <-- Importado
} from "../services/maintenance";
import { fetchMe } from "../services/me"; // <-- Para saber si es admin
// Componente para los badges de estado (mejora visual)
const StatusBadge = ({ status }) => {
    const styles = {
        PENDING: { backgroundColor: '#fef3c7', color: '#92400e' },
        IN_PROGRESS: { backgroundColor: '#dbeafe', color: '#1e40af' },
        COMPLETED: { backgroundColor: '#dcfce7', color: '#166534' },
    };
    return <span className="badge" style={styles[status] || {}}>{status}</span>;
};

export default function Maintenance() {
  const [me, setMe] = useState(null); // <-- Nuevo estado para el usuario  
  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState({ title: "", description: "" });
  const [msg, setMsg] = useState("");

  const isAdmin = me?.profile?.role === "ADMIN";
  
  async function loadData() {
    try {
      const [meData, requestsData] = await Promise.all([
        fetchMe(),
        listMaintenanceRequests()
      ]);
      setMe(meData);
      setRequests(requestsData.results || requestsData);
    } catch (err) {
      setMsg("Error al cargar los datos.");
      console.error(err);
    }
  }

  useEffect(() => { loadData(); }, []);

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
  
  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateMaintenanceRequestStatus(id, newStatus);
      loadData(); // Recarga los datos para reflejar el cambio
    } catch (error) {
      console.error("Error updating status:", error);
      alert("No se pudo actualizar el estado.");
    }
  };

  return (
    <div style={{ padding: 24, display: "grid", gap: 24 }}>
      <h1>Mantenimiento y Soporte</h1>

    {/* El formulario solo lo ven los residentes */}
    {!isAdmin && (
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
   )}
      <section>
        <h3>{isAdmin ? "Todas las Solicitudes" : "Mis Solicitudes"}</h3>
        <table width="100%" cellPadding="8" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f4f4f4" }}>
              <th>Título</th>
              {isAdmin && <th>Reportado por</th>}
              <th>Estado</th>
              <th>Fecha de Reporte</th>
              {isAdmin && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id} style={{ borderBottom: "1px solid #eee" }}>
                <td>{req.title}</td>
                {isAdmin && <td>{req.reported_by_username}</td>}
                <td>{req.status}</td>
                <td>{new Date(req.created_at).toLocaleString()}</td>
                {isAdmin && (
                  <td>
                    <select
                      value={req.status}
                      onChange={(e) => handleStatusChange(req.id, e.target.value)}
                    >
                      <option value="PENDING">Pendiente</option>
                      <option value="IN_PROGRESS">En Progreso</option>
                      <option value="COMPLETED">Completado</option>
                    </select>
                  </td>
                )}
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