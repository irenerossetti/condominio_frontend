import { useEffect, useState } from "react";
import {
  listMaintenanceRequests,
  createMaintenanceRequest,
  updateMaintenanceRequestStatus,
  listMaintenanceRequestComments,
  createMaintenanceRequestComment,
  updateMaintenanceRequest,
} from "../services/maintenance";
import { fetchMe } from "../services/me";
import { listStaffUsers } from "../services/users";
import { toast } from "react-hot-toast";

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
  const [staff, setStaff] = useState([]);
  const [form, setForm] = useState({ title: "", description: "" });
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentForm, setCommentForm] = useState({ body: "" });

  const isAdmin = me?.profile?.role === "ADMIN";

  async function loadData() {
    try {
      const fetchPromises = [fetchMe(), listMaintenanceRequests()];
      // Solo pedimos la lista de personal si es un admin
      if (me?.profile?.role === "ADMIN") {
        fetchPromises.push(listStaffUsers());
      }
      
      const [meData, requestsData, staffData] = await Promise.all(fetchPromises);
      
      setMe(meData);
      setRequests(requestsData.results || requestsData);
      if (staffData) {
        setStaff(staffData);
      }
    } catch (err) {
      toast.error("Error al cargar los datos de mantenimiento.");
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
  
  // Usamos un solo useEffect para cargar los datos basado en 'me'
  useEffect(() => {
    fetchMe().then(userData => {
        setMe(userData);
    });
  }, []);
  
  useEffect(() => {
    // Carga los datos una vez que sabemos quién es el usuario
    if(me) loadData();
  }, [me]);

  useEffect(() => {
    if (selectedRequest) {
      loadComments(selectedRequest.id);
    }
  }, [selectedRequest]);

  async function onSubmit(e) {
    e.preventDefault();
    try {
      await createMaintenanceRequest(form);
      toast.success("Solicitud enviada con éxito.");
      setForm({ title: "", description: "" });
      loadData();
    } catch (err) {
      toast.error("No se pudo enviar la solicitud.");
    }
  }
  
  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateMaintenanceRequestStatus(id, newStatus);
      toast.success("Estado actualizado.");
      loadData();
    } catch (error) {
      toast.error("No se pudo actualizar el estado.");
    }
  };

  const handleAssignWorker = async (requestId, workerId) => {
    try {
      await updateMaintenanceRequest(requestId, { assigned_to: workerId || null });
      toast.success("Trabajador asignado.");
      loadData();
    } catch (error) {
      toast.error("No se pudo asignar el trabajador.");
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
      loadComments(selectedRequest.id);
    } catch (error) {
      toast.error("No se pudo agregar el comentario.");
    }
  };

  return (
    <div style={{ padding: 24, display: "grid", gap: 24 }}>
      <h1>Mantenimiento y Soporte</h1>

      {/* 👇 CÓDIGO DEL FORMULARIO PARA RESIDENTES RESTAURADO Y CORREGIDO */}
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
            {/* La línea que usaba 'msg' ha sido eliminada */}
          </form>
        </section>
      )}

      <section>
        <h3>{isAdmin ? "Todas las Solicitudes" : "Mis Solicitudes"}</h3>
        <table className="table">
            {/* ... el resto de la tabla se queda igual ... */}
            <thead>
            <tr>
              <th>Título / Asignado a</th>
              {isAdmin && <th>Reportado por</th>}
              <th>Estado</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id}>
                <td>
                  <div style={{ fontWeight: 'bold' }}>{req.title}</div>
                  <div style={{ fontSize: '12px', color: 'gray' }}>
                    Asignado a: {req.assigned_to_username || 'Nadie'}
                  </div>
                </td>
                {isAdmin && <td>{req.reported_by_username}</td>}
                <td><StatusBadge status={req.status} /></td>
                <td>{new Date(req.created_at).toLocaleDateString()}</td>
                <td>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button onClick={() => setSelectedRequest(req)}>Ver detalles</button>
                    {isAdmin && (
                      <>
                        <select
                          value={req.status}
                          onChange={(e) => handleStatusChange(req.id, e.target.value)}
                        >
                          <option value="PENDING">Pendiente</option>
                          <option value="IN_PROGRESS">En Progreso</option>
                          <option value="COMPLETED">Completado</option>
                        </select>
                        <select
                          value={req.assigned_to || ''}
                          onChange={(e) => handleAssignWorker(req.id, e.target.value)}
                        >
                          <option value="">-- Asignar a --</option>
                          {staff.map(s => (
                            <option key={s.id} value={s.id}>{s.username}</option>
                          ))}
                        </select>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {!requests.length && (
              <tr><td colSpan={isAdmin ? 5 : 4}>No hay solicitudes.</td></tr>
            )}
          </tbody>
        </table>
      </section>

      {selectedRequest && (
        <div className="card" style={{ maxWidth: 600, justifySelf: "center", marginTop: '16px' }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3>Detalles de: {selectedRequest.title}</h3>
            <button onClick={() => setSelectedRequest(null)}>Cerrar</button>
          </div>
          <p><b>Descripción:</b> {selectedRequest.description}</p>
          <p><b>Reportado por:</b> {selectedRequest.reported_by_username}</p>
          <p><b>Asignado a:</b> {selectedRequest.assigned_to_username || 'Nadie'}</p>
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