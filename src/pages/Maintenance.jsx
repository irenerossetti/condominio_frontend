// src/pages/Maintenance.jsx
import { useEffect, useState } from "react";
import {
  listMaintenanceRequests,
  createMaintenanceRequest,
  updateMaintenanceRequestStatus,
  listMaintenanceRequestComments, // 👈 Nuevo: Importa el servicio de comentarios
  createMaintenanceRequestComment, // 👈 Nuevo: Importa la función para crear comentarios
} from "../services/maintenance";
import { fetchMe } from "../services/me";

const StatusBadge = ({ status }) => {
  const styles = {
    PENDING: { backgroundColor: '#fef3c7', color: '#92400e' },
    IN_PROGRESS: { backgroundColor: '#dbeafe', color: '#1e40af' },
    COMPLETED: { backgroundColor: '#dcfce7', color: '#166534' },
  };
  return <span className="badge" style={styles[status] || {}}>{status}</span>;
};

export default function Maintenance() {
  const [me, setMe] = useState(null);
  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState({ title: "", description: "" });
  const [msg, setMsg] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null); // 👈 Nuevo: Para ver detalles
  const [comments, setComments] = useState([]); // 👈 Nuevo: Para los comentarios de la solicitud
  const [commentForm, setCommentForm] = useState({ body: "" }); // 👈 Nuevo: Para el formulario de comentarios

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

  async function loadComments(requestId) {
    try {
      const commentsData = await listMaintenanceRequestComments(requestId);
      setComments(commentsData.results || commentsData);
    } catch (err) {
      console.error("Error loading comments:", err);
    }
  }
  
  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedRequest) {
      loadComments(selectedRequest.id);
    }
  }, [selectedRequest]);

  async function onSubmit(e) {
    e.preventDefault();
    setMsg("");
    try {
      await createMaintenanceRequest(form);
      setMsg("Solicitud enviada con éxito.");
      setForm({ title: "", description: "" });
      loadData();
    } catch (err) {
      setMsg("No se pudo enviar la solicitud.");
      console.error(err);
    }
  }
  
  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateMaintenanceRequestStatus(id, newStatus);
      loadData();
    } catch (error) {
      console.error("Error updating status:", error);
      alert("No se pudo actualizar el estado.");
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentForm.body || !selectedRequest) return;
    try {
      await createMaintenanceRequestComment({
        request: selectedRequest.id,
        body: commentForm.body,
      });
      setCommentForm({ body: "" });
      loadComments(selectedRequest.id); // Recargar comentarios
    } catch (error) {
      console.error("Error creating comment:", error);
      alert("No se pudo agregar el comentario.");
    }
  };

  return (
    <div style={{ padding: 24, display: "grid", gap: 24 }}>
      <h1>Mantenimiento y Soporte</h1>

      {/* Formulario para residentes */}
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
              <th></th> {/* 👈 Nueva columna para el botón de detalles */}
              {isAdmin && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id} style={{ borderBottom: "1px solid #eee" }}>
                <td>{req.title}</td>
                {isAdmin && <td>{req.reported_by_username}</td>}
                <td><StatusBadge status={req.status} /></td>
                <td>{new Date(req.created_at).toLocaleString()}</td>
                <td>
                  <button onClick={() => setSelectedRequest(req)}>Ver detalles</button>
                </td>
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
                <td colSpan={isAdmin ? 6 : 4}>No hay solicitudes.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {/* 👈 Nuevo: Modal para ver detalles y comentarios */}
      {selectedRequest && (
        <div className="card" style={{ maxWidth: 600, justifySelf: "center" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3>Detalles de la Solicitud: {selectedRequest.title}</h3>
            <button onClick={() => setSelectedRequest(null)}>Cerrar</button>
          </div>
          <p><b>Descripción:</b> {selectedRequest.description}</p>
          <p><b>Reportado por:</b> {selectedRequest.reported_by_username}</p>
          <p><b>Estado:</b> <StatusBadge status={selectedRequest.status} /></p>

          <hr style={{ margin: "16px 0" }} />

          <h4>Comentarios</h4>
          <div style={{ maxHeight: 200, overflowY: "auto", display: "grid", gap: 12 }}>
            {comments.map((c) => (
              <div key={c.id} style={{ padding: 8, background: "#f8fafc", borderRadius: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--muted)" }}>
                  <span>{c.user_username}</span>
                  <span>{new Date(c.created_at).toLocaleString()}</span>
                </div>
                <p style={{ margin: "4px 0 0" }}>{c.body}</p>
              </div>
            ))}
            {!comments.length && <p>No hay comentarios aún.</p>}
          </div>

          <form onSubmit={handleCommentSubmit} style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <textarea
              placeholder="Añadir un comentario..."
              rows={2}
              value={commentForm.body}
              onChange={(e) => setCommentForm({ body: e.target.value })}
              style={{ flex: 1 }}
            />
            <button type="submit">Enviar</button>
          </form>
        </div>
      )}
    </div>
  );
}