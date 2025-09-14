// src/api.js
import axios from "axios";

// Normaliza la base URL (asegura una sola barra al final)
const base = (
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api"
).replace(/\/+$/, "") + "/";

export const api = axios.create({
  baseURL: base,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// Inyecta Authorization: Bearer <token> si existe
api.interceptors.request.use((config) => {
  const t = localStorage.getItem("access");
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

// Si el backend responde 401 → limpiar sesión y mandar a /login
api.interceptors.response.use(
  (r) => r,
  (err) => {
    const status = err?.response?.status;
    if (status === 401) {
      localStorage.removeItem("access");
      if (!location.pathname.startsWith("/login")) {
        location.assign("/login");
      }
    }
    return Promise.reject(err);
  }
);
