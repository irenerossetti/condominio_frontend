import { useEffect, useState } from "react";
import { listExpenseTypes } from "../services/expenseTypes";
import { issueFees, listFees, listMyFees, payFee } from "../services/fees";

export default function Fees() {
  const [ets, setEts] = useState([]);
  const [period, setPeriod] = useState("");
  const [expenseType, setExpenseType] = useState("");
  const [amount, setAmount] = useState("");
  const [adminList, setAdminList] = useState([]);
  const [myList, setMyList] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const etData = await listExpenseTypes({ active: true });
        setEts(etData.results || etData);
        const mine = await listMyFees();
        setMyList(mine.results || mine);
      } catch {}
    })();
  }, []);

  async function onIssue(e) {
    e.preventDefault();
    setMsg("");
    try {
      const payload = { period };
      if (expenseType) payload.expense_type = expenseType;
      if (amount) payload.amount = Number(amount);
      const r = await issueFees(payload);
      setMsg(`Cuotas emitidas: ${r.count} para ${r.period}`);
      const all = await listFees({ period });
      setAdminList(all.results || all);
    } catch (e) {
      console.error(e);
      setMsg("Error al emitir cuotas");
    }
  }

  async function onPay(feeId) {
    const monto = prompt("Monto a registrar:");
    if (!monto) return;
    try { await payFee(feeId, { amount: Number(monto) }); alert("Pago registrado"); }
    catch { alert("No se pudo registrar el pago"); }
  }

  return (
    <div style={{ padding: 24, display: "grid", gap: 16 }}>
      <h1>Cuotas</h1>

      <section style={{ border: "1px solid #eee", borderRadius: 12, padding: 16 }}>
        <h3>Emitir cuotas (ADMIN)</h3>
        <form onSubmit={onIssue} style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <input placeholder="Periodo YYYY-MM" value={period} onChange={(e)=>setPeriod(e.target.value)} />
          <select value={expenseType} onChange={(e)=>setExpenseType(e.target.value)}>
            <option value="">— Cualquier tipo activo —</option>
            {ets.map(et => <option key={et.id} value={et.id}>{et.name} (def: {et.amount_default})</option>)}
          </select>
          <input placeholder="Monto (opcional)" value={amount} onChange={(e)=>setAmount(e.target.value)} />
          <button>Emitir</button>
          {msg && <span style={{ color: "#0a7", fontWeight: 600 }}>{msg}</span>}
        </form>

        {!!adminList.length && (
          <div style={{ marginTop: 10 }}>
            <h4>Cuotas emitidas en {period}</h4>
            <table width="100%" cellPadding="8" style={{ borderCollapse: "collapse" }}>
              <thead><tr><th>Unidad</th><th>Propietario</th><th>Tipo</th><th>Periodo</th><th>Monto</th><th>Estado</th><th></th></tr></thead>
              <tbody>
                {adminList.map(f => (
                  <tr key={f.id} style={{ borderBottom: "1px solid #eee" }}>
                    <td>{f.unit_code}</td>
                    <td>{f.owner_username}</td> {/* nuevo */}
                    <td>{f.expense_type_name}</td>
                    <td>{f.period}</td>
                    <td>{f.amount}</td>
                    <td>{f.status}</td>
                    <td><button onClick={() => onPay(f.id)}>Registrar pago</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <h3>Mi estado de cuenta (CU8)</h3>
        <table width="100%" cellPadding="8" style={{ borderCollapse: "collapse" }}>
          <thead><tr><th>Unidad</th><th>Tipo</th><th>Periodo</th><th>Monto</th><th>Estado</th></tr></thead>
          <tbody>
            {myList.map(f => (
              <tr key={f.id} style={{ borderBottom: "1px solid #eee" }}>
                <td>{f.unit_code}</td>
                <td>{f.expense_type_name}</td>
                <td>{f.period}</td>
                <td>{f.amount}</td>
                <td>{f.status}</td>
              </tr>
            ))}
            {!myList.length && <tr><td colSpan="5">Sin cuotas</td></tr>}
          </tbody>
        </table>
      </section>
    </div>
  );
}
