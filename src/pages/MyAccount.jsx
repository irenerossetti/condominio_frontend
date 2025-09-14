import { useEffect, useState } from "react";       // ✅ desde react
import { fetchMe, updateMyProfile } from "../services/me";  // ✅ servicios


export default function MyAccount() {
  const [me, setMe] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchMe();
        setMe(data);
      } catch (e) {
        console.error(e);
        setMsg("No se pudo cargar el perfil.");
      }
    })();
  }, []);

  async function onSave(e) {
    e.preventDefault();
    if (!me) return;
    setMsg("");
    setSaving(true);
    try {
      const prof = await updateMyProfile(me.profile || {});
      setMe((prev) => ({ ...prev, profile: prof }));
      setMsg("Perfil actualizado.");
    } catch (e) {
      console.error(e);
      setMsg("No se pudo actualizar el perfil.");
    } finally {
      setSaving(false);
    }
  }

  if (!me) return <div style={{ padding: 24 }}>Cargando…</div>;

  const p = me.profile || { full_name: "", phone: "", role: "RESIDENT" };

  return (
    <div style={{ padding: 24, maxWidth: 560 }}>
      <h1>Mi cuenta</h1>

      <section style={{ marginTop: 16, padding: 16, border: "1px solid #eee", borderRadius: 12 }}>
        <h3>Datos de usuario</h3>
        <p><b>Usuario:</b> {me.username}</p>
        <p><b>Email:</b> {me.email || "-"}</p>
        <p><b>Nombre:</b> {me.first_name} {me.last_name}</p>
      </section>

      <form onSubmit={onSave} style={{ marginTop: 16, display: "grid", gap: 12 }}>
        <h3>Perfil</h3>

        <label>
          Nombre completo<br/>
          <input
            value={p.full_name}
            onChange={(e) => setMe({ ...me, profile: { ...p, full_name: e.target.value } })}
          />
        </label>

        <label>
          Teléfono<br/>
          <input
            value={p.phone}
            onChange={(e) => setMe({ ...me, profile: { ...p, phone: e.target.value } })}
          />
        </label>

        <label>
          Rol<br/>
          <select
            value={p.role}
            onChange={(e) => setMe({ ...me, profile: { ...p, role: e.target.value } })}
          >
            <option value="ADMIN">Administrador</option>
            <option value="RESIDENT">Residente</option>
            <option value="STAFF">Personal</option>
          </select>
        </label>

        <button disabled={saving}>{saving ? "Guardando…" : "Guardar cambios"}</button>
        {!!msg && <div style={{ color: "#0a7", fontWeight: 600 }}>{msg}</div>}
      </form>
    </div>
  );
}
