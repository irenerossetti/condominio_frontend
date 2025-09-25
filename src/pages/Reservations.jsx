// src/pages/Reservations.jsx
import { useEffect, useState } from "react";
import {
  listCommonAreas,
  listReservations,
  createReservation,
  updateReservation, // <-- Importado
  deleteReservation, // <-- Importado
} from "../services/reservations";

// Formato de fecha para los inputs 'datetime-local'
const toDateTimeLocal = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
};

export default function Reservations() {
  const [areas, setAreas] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [editingId, setEditingId] = useState(null); 
  const [form, setForm] = useState({ area: "", start_time: "", end_time: "" });
  const [msg, setMsg] = useState("");

  async function loadData() {
    try {
      const [areasData, reservationsData] = await Promise.all([
        listCommonAreas(),
        listReservations(),
      ]);
      setAreas(areasData.results || areasData);
      setReservations(reservationsData.results || reservationsData);
    } catch (error) {
      console.error(error);
      setMsg("Error al cargar los datos.");
    }
  }

  useEffect(() => { loadData(); }, []);

  const handleEdit = (res) => {
    setEditingId(res.id);
    setForm({
      area: res.area,
      start_time: toDateTimeLocal(res.start_time),
      end_time: toDateTimeLocal(res.end_time),
    });
    window.scrollTo(0, 0); // Sube al inicio de la página para ver el form
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ area: "", start_time: "", end_time: "" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta reserva?")) {
      try {
        await deleteReservation(id);
        setMsg("Reserva eliminada.");
        loadData(); // Recargar la lista
      } catch (error) {
        console.error(error);
        setMsg("No se pudo eliminar la reserva.");
      }
    }
  };

  async function onSubmit(e) {
    e.preventDefault();
    setMsg("");
    if (!form.area || !form.start_time || !form.end_time) {
      setMsg("Por favor, completa todos los campos.");
      return;
    }
    try {
      if (editingId) { // Si estamos editando...
        await updateReservation(editingId, form);
        setMsg("¡Reserva actualizada con éxito!");
      } else { // Si estamos creando...
        await createReservation(form);
        setMsg("¡Reserva creada con éxito!");
      }
      cancelEdit();
      loadData();
    } catch (error) {
      console.error(error);
      setMsg("No se pudo guardar la reserva. Revisa los horarios.");
    }
  }

  return (
    <div style={{ padding: 24, display: "grid", gap: 24 }}>
      <h1>Reservas de Áreas Comunes</h1>

      <section className="card">
        <h3>{editingId ? "Editar Reserva" : "Crear Nueva Reserva"}</h3>
        <form onSubmit={onSubmit} style={{ display: "grid", gap: 12, maxWidth: 600 }}>
          <select value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })}>
            <option value="">-- Selecciona un área --</option>
            {areas.map((a) => ( <option key={a.id} value={a.id}>{a.name}</option> ))}
          </select>
          <input type="datetime-local" value={form.start_time} onChange={(e) => setForm({ ...form, start_time: e.target.value })} />
          <input type="datetime-local" value={form.end_time} onChange={(e) => setForm({ ...form, end_time: e.target.value })} />
          <div style={{display: 'flex', gap: '8px'}}>
            <button type="submit">{editingId ? "Actualizar" : "Reservar"}</button>
            {editingId && <button type="button" onClick={cancelEdit} style={{background: 'grey'}}>Cancelar Edición</button>}
          </div>
          {msg && <p style={{ color: msg.includes("Error") ? "red" : "#0a7", fontWeight: 600 }}>{msg}</p>}
        </form>
      </section>

      <section>
        <h3>Mis Próximas Reservas</h3>
        <table width="100%" cellPadding="8" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f4f4f4" }}>
              <th>Área</th><th>Desde</th><th>Hasta</th><th>Hecha el</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((r) => (
              <tr key={r.id} style={{ borderBottom: "1px solid #eee" }}>
                <td>{r.area_name}</td>
                <td>{new Date(r.start_time).toLocaleString()}</td>
                <td>{new Date(r.end_time).toLocaleString()}</td>
                <td>{new Date(r.created_at).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => handleEdit(r)} style={{fontSize: 12, padding: '6px 8px'}}>Editar</button>
                  <button onClick={() => handleDelete(r.id)} style={{fontSize: 12, padding: '6px 8px', background: '#dc2626', marginLeft: '6px'}}>Eliminar</button>
                </td>
              </tr>
            ))}
            {!reservations.length && <tr><td colSpan="5">No tienes reservas.</td></tr>}
          </tbody>
        </table>
      </section>
    </div>
  );
}