// src/services/log.js
import { api } from "../api";

export const getActivityLog = () => 
  api.get("activity-logs/").then((r) => r.data);

// 👈 Nueva función para crear un registro personalizado
export const createCustomLog = (payload) =>
  api.post("activity-logs/create_custom/", payload).then((r) => r.data);

// 👈 Nueva función de servicio para registrar el acceso a páginas
export const logPageAccess = (page_name) =>
  api.post("log/page-access/", { page_name });
