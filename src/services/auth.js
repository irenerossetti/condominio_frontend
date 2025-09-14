import { api } from "../api";

export async function login(arg1, arg2) {
  // Permite login({email, password}) o login(email, password)
  const payload = typeof arg1 === "object" ? arg1 : { email: arg1, password: arg2 };

  const { data } = await api.post("auth/login/", payload); // 👈 sin "/" inicial
  localStorage.setItem("access", data.access);
  localStorage.setItem("refresh", data.refresh);
  return data;
}

export function clearSession() {
  localStorage.removeItem("access");
}

export function isAuthed() {
  return !!localStorage.getItem("access");
}

// Alias para que Protected.jsx pueda importar isAuthenticated sin romperse
export const isAuthenticated = isAuthed;
