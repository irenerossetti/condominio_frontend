// src/pages/Dashboard.jsx
export default function Dashboard() {
  // Datos demo (luego puedes reemplazar con endpoints reales)
  const totals = {
    usuarios: 248,
    unidades: 156,
    pendientes: 45230,
    reportes: 12,
  };

  const actividad = [
    {
      icon: "🧑",
      titulo: "Nuevo usuario registrado",
      estado: "Completado",
      detalle: "María González se registró en la unidad 4B",
      hace: "Hace 2 horas",
    },
    {
      icon: "💳",
      titulo: "Pago de cuota recibido",
      estado: "Completado",
      detalle: "Unidad 2A pagó la cuota de mantenimiento",
      hace: "Hace 4 horas",
    },
    {
      icon: "🔔",
      titulo: "Aviso publicado",
      estado: "Información",
      detalle: "Mantenimiento de ascensores programado",
      hace: "Hace 6 horas",
    },
    {
      icon: "🏢",
      titulo: "Nueva unidad registrada",
      estado: "Completado",
      detalle: "Unidad 5C agregada al sistema",
      hace: "Hace 1 día",
    },
    {
      icon: "⛔",
      titulo: "Cuota vencida",
      estado: "Pendiente",
      detalle: "Unidad 3B tiene cuota pendiente",
      hace: "Hace 2 días",
    },
  ];

  return (
    <div>
      <h1>Dashboard</h1>
      <p className="muted">Bienvenido al sistema de gestión Smart Condominium</p>

      {/* KPIs */}
      <section className="kpis" style={{ marginTop: 12 }}>
        <div className="kpi">
          <h4> Total Usuarios </h4>
          <div className="big">{totals.usuarios.toLocaleString()}</div>
          <div className="muted" style={{ marginTop: 6 }}>↗︎ +12%&nbsp; <span className="muted">vs mes anterior</span></div>
        </div>
        <div className="kpi">
          <h4> Unidades Activas </h4>
          <div className="big">{totals.unidades.toLocaleString()}</div>
          <div className="muted" style={{ marginTop: 6 }}>↗︎ +3%&nbsp; <span className="muted">vs mes anterior</span></div>
        </div>
        <div className="kpi">
          <h4> Cuotas Pendientes </h4>
          <div className="big">${totals.pendientes.toLocaleString()}</div>
          <div className="muted" style={{ marginTop: 6 }}>↘︎ -8%&nbsp; <span className="muted">vs mes anterior</span></div>
        </div>
        <div className="kpi">
          <h4> Reportes Abiertos </h4>
          <div className="big">{totals.reportes.toLocaleString()}</div>
          <div className="muted" style={{ marginTop: 6 }}>+2&nbsp; <span className="muted">vs mes anterior</span></div>
        </div>
      </section>

      {/* Dos columnas */}
      <section className="columns" style={{ marginTop: 16 }}>
        {/* Acciones rápidas */}
        <div className="section">
          <h3>Acciones Rápidas</h3>
          <div className="grid-1" style={{ display: "grid", gap: 12 }}>
            <QuickAction icon="👤" title="Nuevo Usuario" desc="Agregar un nuevo residente" />
            <QuickAction icon="🏢" title="Nueva Unidad" desc="Registrar unidad habitacional" />
            <QuickAction icon="🔔" title="Publicar Aviso" desc="Crear nuevo comunicado" />
            <QuickAction icon="📄" title="Generar Reporte" desc="Crear reporte financiero" />
          </div>
        </div>

        {/* Actividad reciente */}
        <div className="section">
          <h3>Actividad Reciente</h3>
          <div style={{ display: "grid", gap: 12 }}>
            {actividad.map((a, i) => (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "36px 1fr auto",
                  gap: 12,
                  alignItems: "center",
                  padding: "10px 12px",
                  border: "1px solid #eef2f5",
                  borderRadius: 12,
                  background: "#fff",
                }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: 12,
                  display: "grid", placeItems: "center",
                  background: "var(--brand-100)"
                }}>
                  {a.icon}
                </div>
                <div>
                  <div style={{ fontWeight: 700 }}>{a.titulo}{" "}
                    <span className="badge success" style={{ marginLeft: 6 }}>
                      {a.estado}
                    </span>
                  </div>
                  <div className="muted">{a.detalle}</div>
                  <div className="muted" style={{ fontSize: 12 }}>⏰ {a.hace}</div>
                </div>
                <div style={{ opacity: .4 }}>⋮</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function QuickAction({ icon, title, desc }) {
  return (
    <button
      type="button"
      style={{
        textAlign: "left",
        display: "grid",
        gridTemplateColumns: "44px 1fr",
        gap: 12,
        alignItems: "center",
        background: "#fff",
        color: "var(--text)",
        boxShadow: "var(--shadow)",
      }}
    >
      <div style={{
        width: 44, height: 44, borderRadius: 14,
        display: "grid", placeItems: "center",
        background: "var(--brand-100)", color: "var(--brand-700)",
        fontSize: 20, fontWeight: 700
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontWeight: 800 }}>{title}</div>
        <div className="muted" style={{ fontSize: 13 }}>{desc}</div>
      </div>
    </button>
  );
}
