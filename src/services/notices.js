import { api } from "../api";

export async function listNotices(params = {}) {
  const { data } = await api.get("notices/", { params });
  return data;
}
export async function createNotice(payload) {
  const { data } = await api.post("notices/", payload);
  return data;
}
