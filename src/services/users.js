// src/services/users.js
import { api } from "../api";

export async function listUsers(params = {}) {
  const r = await api.get("users/", { params });
  return r.data;
}

export async function createUser(payload) {
  const r = await api.post("users/", payload);
  return r.data;
}
export async function updateUser(id, payload) {
  const r = await api.put(`users/${id}/`, payload);
  return r.data;
}
export async function deleteUser(id) {
  const r = await api.delete(`users/${id}/`);
  return r.data;
}
