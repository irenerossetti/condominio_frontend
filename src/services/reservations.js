// src/services/reservations.js
import { api } from "../api";

// Obtiene la lista de áreas comunes disponibles
export const listCommonAreas = () =>
  api.get("common-areas/").then((r) => r.data);

// Obtiene mis reservaciones (para residentes) o todas (para admin)
export const listReservations = () =>
  api.get("reservations/").then((r) => r.data);

// Crea una nueva reservación
export const createReservation = (payload) =>
  api.post("reservations/", payload).then((r) => r.data);

// Actualiza una reserva existente (usamos PATCH para actualizaciones parciales)
export const updateReservation = (id, payload) =>
  api.patch(`reservations/${id}/`, payload).then((r) => r.data);

// Elimina una reserva
export const deleteReservation = (id) =>
  api.delete(`reservations/${id}/`);