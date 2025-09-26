// src/services/maintenance.js
import { api } from "../api";

// Obtiene la lista de solicitudes de mantenimiento
export const listMaintenanceRequests = () =>
  api.get("maintenance-requests/").then((r) => r.data);

// Crea una nueva solicitud
export const createMaintenanceRequest = (payload) =>
  api.post("maintenance-requests/", payload).then((r) => r.data);

// Actualiza el estado de una solicitud (para admins)
export const updateMaintenanceRequest = (id, payload) =>
  api.patch(`maintenance-requests/${id}/`, payload).then((r) => r.data);

// Al final de src/services/maintenance.js
export const updateMaintenanceRequestStatus = (id, status) =>
  api.patch(`maintenance-requests/${id}/update_status/`, { status });

// 👈 Nuevas funciones para comentarios
export const listMaintenanceRequestComments = (requestId) =>
  api.get(`maintenance-request-comments/?request=${requestId}`).then((r) => r.data);

export const createMaintenanceRequestComment = (payload) =>
  api.post("maintenance-request-comments/", payload).then((r) => r.data);