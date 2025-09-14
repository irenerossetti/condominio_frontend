import { useEffect, useState } from "react";
import { listNotices, createNotice } from "../services/notices";

export default function Notices() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({ title: "", body: "" });
  const [msg, setMsg] = useState("");

  async function load() {
    const data = await listNotices();
    setRows(data.results || data);
  }
  useEffect(() => { load(); }, []);

  async function onSubmit(e) {
    e.preventDefault();
    setMsg("");
    try {
      await createNotice(form);
      setForm({ title: "", body: "" });
      await load();
      setMsg("Aviso publicado.");
    } catch (e) {
      setMsg("No tienes permiso para publicar (solo admin).");
    }
  }

  return (
    <div style={{ padding: 24, display: "grid", gap: 16 }}>
      <h1>Avisos</h1>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 8, maxWidth: 600 }}>
        <input placeholder="Título" value={form.title} onChange={e=>setForm({...form, title:e.target.value})}/>
        <textarea placeholder="Contenido" rows={4} value={form.body} onChange={e=>setForm({...form, body:e.target.value})}/>
        <button>Publicar</button>
        {!!msg && <span style={{ color: "#0a7", fontWeight: 600 }}>{msg}</span>}
      </form>

      <div style={{ display: "grid", gap: 10 }}>
        {rows.map(n => (
          <article key={n.id} style={{ border: "1px solid #eee", borderRadius: 12, padding: 12 }}>
            <h3 style={{ margin: "0 0 6px" }}>{n.title}</h3>
            <small>por {n.created_by_username} — {new Date(n.published_at).toLocaleString()}</small>
            <p style={{ marginTop: 8 }}>{n.body}</p>
          </article>
        ))}
        {!rows.length && <p>No hay avisos.</p>}
      </div>
    </div>
  );
}
