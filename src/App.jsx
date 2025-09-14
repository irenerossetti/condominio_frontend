import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Protected from "./components/Protected.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Users from "./pages/Users.jsx";
import Units from "./pages/Units.jsx";
import MyAccount from "./pages/MyAccount.jsx";
import Fees from "./pages/Fees.jsx";
import Notices from "./pages/Notices.jsx";
import Reports from "./pages/Reports.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Rutas protegidas */}
        <Route element={<Protected />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/my-account" element={<MyAccount />} />
          <Route path="/units" element={<Units />} />
          <Route path="/fees" element={<Fees />} />
          <Route path="/notices" element={<Notices />} />
          <Route path="/reports" element={<Reports />} /> {/* CU9 aquí */}
        </Route>

        {/* comodín */}
        <Route path="*" element={<h1>404</h1>} />
      </Routes>
    </BrowserRouter>
  );
}
