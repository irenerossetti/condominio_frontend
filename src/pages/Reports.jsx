import { useEffect, useState } from "react";
import { financeReport } from "../services/reports";

function money(n){ return (n??0).toLocaleString(undefined,{minimumFractionDigits:2, maximumFractionDigits:2}); }

export default function Reports(){
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [owner, setOwner] = useState(""); // opcional (admin)
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  async function load(){
    setLoading(true);
    try{
      const d = await financeReport({ from, to, owner: owner.trim() || undefined });
      setData(d);
    } finally {
      setLoading(false);
    }
  }
  useEffect(()=>{ load(); },[]);

  return (
    <div style={{ padding: 24, display:"grid", gap:16 }}>
      <h1>Reporte financiero</h1>

      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
        <input placeholder="Desde (YYYY-MM)" value={from} onChange={e=>setFrom(e.target.value)} />
        <input placeholder="Hasta (YYYY-MM)" value={to} onChange={e=>setTo(e.target.value)} />
        <input placeholder="Propietario (username o id, solo admin)" value={owner} onChange={e=>setOwner(e.target.value)} />
        <button onClick={load} disabled={loading}>{loading? "Cargando..." : "Aplicar"}</button>
      </div>

      {!data ? "Cargando..." : (
        <>
          <section style={{ background:"#f7f7f7", borderRadius:8, padding:12 }}>
            <h3 style={{ marginTop:0 }}>Resumen</h3>
            <table cellPadding="8">
              <tbody>
                <tr><td><b>Emitido</b></td><td>{money(data.overall.issued)}</td></tr>
                <tr><td><b>Pagado</b></td><td>{money(data.overall.paid)}</td></tr>
                <tr><td><b>Pendiente</b></td><td>{money(data.overall.outstanding)}</td></tr>
              </tbody>
            </table>
          </section>

          <section>
            <h3>Por período</h3>
            <table width="100%" cellPadding="8" style={{ borderCollapse:"collapse" }}>
              <thead>
                <tr style={{ background:"#f4f4f4" }}>
                  <th>Periodo</th><th>#Cuotas</th><th>Emitido</th><th>Pagado</th><th>Pendiente</th>
                </tr>
              </thead>
              <tbody>
                {data.by_period.map(r=>(
                  <tr key={r.period} style={{ borderBottom:"1px solid #eee" }}>
                    <td>{r.period}</td>
                    <td>{r.count}</td>
                    <td>{money(r.issued)}</td>
                    <td>{money(r.paid)}</td>
                    <td>{money(r.outstanding)}</td>
                  </tr>
                ))}
                {!data.by_period.length && <tr><td colSpan="5">Sin datos</td></tr>}
              </tbody>
            </table>
          </section>

          <section>
            <h3>Por tipo de expensa</h3>
            <table width="100%" cellPadding="8" style={{ borderCollapse:"collapse" }}>
              <thead>
                <tr style={{ background:"#f4f4f4" }}>
                  <th>Tipo</th><th>#Cuotas</th><th>Emitido</th><th>Pagado</th><th>Pendiente</th>
                </tr>
              </thead>
              <tbody>
                {data.by_type.map((r,i)=>(
                  <tr key={i} style={{ borderBottom:"1px solid #eee" }}>
                    <td>{r.type}</td>
                    <td>{r.count}</td>
                    <td>{money(r.issued)}</td>
                    <td>{money(r.paid)}</td>
                    <td>{money(r.outstanding)}</td>
                  </tr>
                ))}
                {!data.by_type.length && <tr><td colSpan="5">Sin datos</td></tr>}
              </tbody>
            </table>
          </section>
        </>
      )}
    </div>
  );
}
