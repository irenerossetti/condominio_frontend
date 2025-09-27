// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDashboardStats } from "../services/reports";
import { listNotices } from "../services/notices";
import { listMyFees } from "../services/fees";
import { listMaintenanceRequests } from "../services/maintenance";
import FeesChart from '../components/FeesChart';
import { financeReport } from "../services/reports"; // 👈 Importa este servicio

// --- Pequeña función para formatear fechas relativas ---
function formatRelativeTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.round((now - date) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  if (seconds < 60) return `Hace ${seconds} segundos`;
  if (minutes < 60) return `Hace ${minutes} minutos`;
  if (hours < 24) return `Hace ${hours} horas`;
  return `Hace ${days} días`;
}

// --- Componente para las "Acciones Rápidas" con descripción ---
function QuickAction({ icon, title, desc, to }) {
  return (
    <Link to={to} className="quick-action-link">
      <div className="quick-action-icon">{icon}</div>
      <div>
        <div style={{ fontWeight: 800 }}>{title}</div>
        <div className="muted" style={{ fontSize: 13 }}>{desc}</div>
      </div>
    </Link>
  );
}


export default function Dashboard() {
  // --- Estados para almacenar los datos de la API ---
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null); // 👈 Nuevo estado para el reporte
  
  // --- Hook para cargar todos los datos cuando el componente se monta ---
  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [statsData, noticesData, feesData, maintenanceData, reportData] = await Promise.all([
          getDashboardStats(),
          listNotices({ limit: 5 }), // Pedimos solo los 5 más recientes
          listMyFees(),
          listMaintenanceRequests(),
          financeReport()
        ]);

        setStats(statsData);
        setReport(reportData); // 👈 Guarda los datos del reporte
        // --- Unifica los datos en un solo feed de actividad ---
        const notices = (noticesData.results || []).map(item => ({
          id: `n-${item.id}`,
          icon: '🔔',
          title: item.title,
          detail: `Por ${item.created_by_username}`,
          status: 'Información',
          date: new Date(item.published_at)
        }));

        const fees = (feesData.results || []).filter(f => f.status !== 'PAID').map(item => ({
          id: `f-${item.id}`,
          icon: '💳',
          title: `Cuota Vencida (${item.expense_type_name || 'General'})`,
          detail: `Monto: $${Number(item.amount).toFixed(2)}`,
          status: item.status,
          date: new Date(item.issued_at)
        }));

        const maintenance = (maintenanceData.results || []).filter(r => r.status !== 'COMPLETED').map(item => ({
          id: `m-${item.id}`,
          icon: '🛠️',
          title: item.title,
          detail: `Reportado por ${item.reported_by_username}`,
          status: item.status,
          date: new Date(item.created_at)
        }));

        const combined = [...notices, ...fees, ...maintenance]
          .sort((a, b) => b.date - a.date)
          .slice(0, 5);
        
        setRecentActivity(combined);

      } catch (error) {
        console.error("Error al cargar el dashboard:", error);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div>
        <div className="skeleton skeleton-title"></div>
        <div className="skeleton skeleton-text" style={{width: '70%'}}></div>
        <section className="kpis" style={{ marginTop: 12 }}>
          <div className="kpi skeleton" style={{height: 80}}></div>
          <div className="kpi skeleton" style={{height: 80}}></div>
          <div className="kpi skeleton" style={{height: 80}}></div>
          <div className="kpi skeleton" style={{height: 80}}></div>
        </section>
        <section className="columns" style={{ marginTop: 16 }}>
            <div className="section skeleton" style={{height: 300}}></div>
            <div className="section skeleton" style={{height: 300}}></div>
        </section>
      </div>
    );
}

  return (
    <div>
      <h1>Dashboard</h1>
      <p className="muted">Bienvenido al sistema de gestión Smart Condominium</p>

      {/* --- KPIs dinámicos --- */}
      <section className="kpis" style={{ marginTop: 12 }}>
        <div className="kpi">
          <h4> Total Usuarios </h4>
          <div className="big">{stats?.total_users ?? 0}</div>
        </div>
        <div className="kpi">
          <h4> Unidades Activas </h4>
          <div className="big">{stats?.active_units ?? 0}</div>
        </div>
        <div className="kpi">
          <h4> Cuotas Pendientes </h4>
          <div className="big">${(stats?.pending_fees_total ?? 0).toLocaleString()}</div>
        </div>
        <div className="kpi">
          <h4> Reportes Abiertos </h4>
          <div className="big">{stats?.open_maintenance_requests ?? 0}</div>
        </div>
      </section>

      <section className="columns" style={{ marginTop: 16 }}>
        {/* --- "Acciones Rápidas" como enlaces con descripción --- */}
        <div className="section">
          <h3>Acciones Rápidas</h3>
          <div className="grid-1" style={{ display: "grid", gap: 12 }}>
            <QuickAction icon="🔔" title="Avisos" to="/notices" desc="Ver comunicados" />
            <QuickAction icon="📅" title="Reservas" to="/reservations" desc="Agendar áreas comunes" />
            <QuickAction icon="🛠️" title="Mantenimiento" to="/maintenance" desc="Reportar incidentes" />
            <QuickAction icon="💳" title="Cuotas" to="/fees" desc="Consultar estado de cuenta" />
            <QuickAction icon="👥" title="Usuarios" to="/users" desc="Gestionar residentes" />
            <QuickAction icon="🏢" title="Unidades" to="/units" desc="Administrar propiedades" />
            <QuickAction icon="📄" title="Reportes" to="/reports" desc="Generar informes" />
            <QuickAction icon="📋" title="Bitácora" to="/activity-log" desc="Ver actividad del sistema" />
          </div>
        </div>

        {/* --- "Actividad Reciente" dinámica y con estilos --- */}
        <div className="section">
          <h3>Actividad Reciente</h3>
          <div style={{ display: "grid", gap: 12 }}>
            {recentActivity.length > 0 ? recentActivity.map((a) => (
              <div key={a.id} className="activity-item">
                <div className="quick-action-icon" style={{width: 36, height: 36}}>
                  {a.icon}
                </div>
                <div>
                  <div style={{ fontWeight: 700 }}>{a.title}{" "}
                    <span className={`badge ${a.status === 'Información' ? 'gray' : 'warn'}`} style={{ marginLeft: 6 }}>
                      {a.status}
                    </span>
                  </div>
                  <div className="muted">{a.detail}</div>
                  <div className="muted" style={{ fontSize: 12 }}>⏰ {formatRelativeTime(a.date)}</div>
                </div>
                <div style={{ opacity: .4 }}>⋮</div>
              </div>
            )) : <p>No hay actividad reciente.</p>}
          </div>
        </div>
      </section>
      {/* 👇 AÑADE ESTA NUEVA SECCIÓN AL FINAL, ANTES DEL ÚLTIMO </div> */}
      <section className="card" style={{ marginTop: 16 }}>
        <FeesChart reportData={report} />
      </section>
    </div>
  );
}