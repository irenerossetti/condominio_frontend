// src/pages/ActivityLog.jsx
import { useEffect, useState } from "react";
import { getActivityLog } from "../services/log";

export default function ActivityLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getActivityLog()
      .then(data => setLogs(data.results || data))
      .catch(err => console.error("Failed to fetch logs:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Cargando bitácora...</p>;

  return (
    <div style={{ padding: 24 }}>
      <h1>Bitácora de Actividad del Sistema</h1>
      <table className="table" style={{ marginTop: 16 }}>
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Acción</th>
            <th>Fecha y Hora</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <tr key={log.id}>
              <td>{log.user_username}</td>
              <td>{log.action}</td>
              <td>{new Date(log.timestamp).toLocaleString()}</td>
            </tr>
          ))}
          {!logs.length && (
            <tr><td colSpan="3">No hay registros en la bitácora.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}