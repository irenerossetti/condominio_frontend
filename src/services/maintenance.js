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