// src/pages/Fees.jsx
import { useEffect, useState } from "react";
import { fetchMe } from "../services/me";
import {
  listExpenseTypes,
  listFees,      // GET /api/fees/?period=YYYY-MM
  listMyFees,    // GET /api/me/fees/
  issueFees,     // POST /api/fees/issue/
  payFee,        // POST /api/fees/:id/pay/
} from "../services/fees";

export default function Fees() {
  // ---- sesión / rol
  const [me, setMe] = useState(null);
  useEffect(() => { fetchMe().then(setMe).catch(() => {}); }, []);
  const isAdmin = me?.profile?.role === "ADMIN";

  // ---- filtros / form
  const [period, setPeriod] = useState("");
  const [expenseType, setExpenseType] = useState("");
  const [amount, setAmount] = useState("");

  // ---- data
  const [types, setTypes] = useState([]);
  const [issued, setIssued] = useState([]);
  const [mine, setMine] = useState([]);
  const [msg, setMsg] = useState("");

  async function loadTypes() {
    const data = await listExpenseTypes();
    setTypes(data.results || data);
  }
  async function loadIssued(p) {
    if (!p) { setIssued([]); return; }
    const data = await listFees({ period: p });
    setIssued(data.results || data);
  }
  async function loadMine() {
    const data = await listMyFees();
    setMine(data.results || data);
  }

  useEffect(() => { loadTypes(); loadMine(); }, []);
  useEffect(() => { loadIssued(period); }, [period]);

  async function onIssue(e) {
    e.preventDefault();
    setMsg("");
    try {
      await issueFees({
        period,
        expense_type: expenseType || undefined,
        amount: amount || undefined,
      });
      setMsg(`Cuotas emitidas${period ? `: ${period}` : ""}`);
      await loadIssued(period);
      await loadMine();
    } catch {
      setMsg("Error al emitir cuotas");
    }
  }

  async function onPay(fee) {
    const val = prompt("Monto a registrar:", fee.amount);
    if (!val) return;
    try {
      await payFee(fee.id, { amount: parseFloat(val) });
      await loadIssued(period);
      await loadMine();
    } catch {
      alert("No se pudo registrar el pago");
    }
  }

  return (
    <div style={{ padding: 24, display: "grid", gap: 24 }}>
      <h1>Cuotas</h1>

      {/* ---------- SOLO ADMIN: emitir cuotas ---------- */}
      {isAdmin && (
        <section
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            padding: 16,
            background: "#fafafa",
          }}
        >
          <h3>Emitir cuotas (ADMIN)</h3>
          <form
            onSubmit={onIssue}
            style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}
          >
            <input
              type="month"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              placeholder="Periodo YYYY-MM"
            />
            <select value={expenseType} onChange={(e) => setExpenseType(e.target.value)}>
              <option value="">Cualquier tipo activo</option>
              {types.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                  {t.amount_default ? ` (def: ${Number(t.amount_default).toFixed(2)})` : ""}
                </option>
              ))}
            </select>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Monto (opcional)"
            />
            <button>Emitir</button>
          </form>

          {msg && (
            <div style={{ marginTop: 8, color: msg.startsWith("Error") ? "#b91c1c" : "#059669" }}>
              {msg}
            </div>
          )}

          {period && (
            <>
              <h4 style={{ marginTop: 16 }}>Cuotas emitidas en {period}</h4>
              <table width="100%" cellPadding="8" style={{ borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f4f4f4" }}>
                    <th>Unidad</th>
                    <th>Propietario</th>
                    <th>Tipo</th>
                    <th>Periodo</th>
                    <th>Monto</th>
                    <th>Estado</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {issued.map((f) => (
                    <tr key={f.id} style={{ borderBottom: "1px solid #eee" }}>
                      <td>{f.unit?.code}</td>
                      <td>{f.unit_owner_username || f.unit?.owner_username}</td>
                      <td>{f.expense_type?.name}</td>
                      <td>{f.period}</td>
                      <td>{Number(f.amount).toFixed(2)}</td>
                      <td>{f.status}</td>
                      <td>
                        <button onClick={() => onPay(f)}>Registrar pago</button>
                      </td>
                    </tr>
                  ))}
                  {!issued.length && (
                    <tr>
                      <td colSpan={7}>Sin cuotas.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}
        </section>
      )}

      {/* ---------- CU8: Mi estado de cuenta ---------- */}
      <section>
        <h3>Mi estado de cuenta (CU8)</h3>
        <table width="100%" cellPadding="8" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f4f4f4" }}>
              <th>Unidad</th>
              <th>Tipo</th>
              <th>Periodo</th>
              <th>Monto</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {mine.map((f) => (
              <tr key={f.id} style={{ borderBottom: "1px solid #eee" }}>
                <td>{f.unit?.code}</td>
                <td>{f.expense_type?.name}</td>
                <td>{f.period}</td>
                <td>{Number(f.amount).toFixed(2)}</td>
                <td>{f.status}</td>
              </tr>
            ))}
            {!mine.length && (
              <tr>
                <td colSpan={5}>Sin cuotas</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
