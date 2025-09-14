import { api } from "../api";

export async function listFees(params = {}) {
  const { data } = await api.get("fees/", { params });
  return data;
}
export async function issueFees(payload) {
  // { period: "YYYY-MM", expense_type?, amount? }
  const { data } = await api.post("fees/issue/", payload);
  return data;
}
export async function payFee(id, payload) {
  // { amount, method?, note? }
  const { data } = await api.post(`fees/${id}/pay/`, payload);
  return data;
}
export async function listMyFees(params = {}) {
  const { data } = await api.get("fees/", { params: { ...params, mine: 1 } });
  return data;
}
