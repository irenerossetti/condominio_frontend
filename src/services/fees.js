// src/services/fees.js
import { api } from "../api";

export const listExpenseTypes = () =>
  api.get("expense-types/").then(r => r.data); // <-- con guión

export const listFees = (params) =>
  api.get("fees/", { params }).then(r => r.data);

export const listMyFees = () =>
  api.get("me/fees/").then(r => r.data);

export const issueFees = (payload) =>
  api.post("fees/issue/", payload).then(r => r.data);

export const payFee = (id, payload) =>
  api.post(`fees/${id}/pay/`, payload).then(r => r.data);
