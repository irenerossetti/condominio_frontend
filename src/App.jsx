// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Protected from "./components/Protected.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import Layout from "./components/Layout.jsx";

import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import MyAccount from "./pages/MyAccount.jsx";
import Notices from "./pages/Notices.jsx";
import Fees from "./pages/Fees.jsx";

import Users from "./pages/Users.jsx";
import Units from "./pages/Units.jsx";
import Reports from "./pages/Reports.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* pública */}
        <Route path="/login" element={<Login />} />

        {/* protegidas (requiere sesión) */}
        <Route element={<Protected />}>
          {/* layout con el menú */}
          <Route element={<Layout />}>
            <Route element={<Layout />}></Route>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/my-account" element={<MyAccount />} />
            <Route path="/notices" element={<Notices />} />
            <Route path="/fees" element={<Fees />} />

            {/* solo admin */}
            <Route element={<AdminRoute />}>
              <Route path="/users" element={<Users />} />
              <Route path="/units" element={<Units />} />
              <Route path="/reports" element={<Reports />} />
            </Route>
          </Route>
        </Route>

        {/* comodín */}
        <Route path="*" element={<h1 style={{ padding: 24 }}>404</h1>} />
      </Routes>
    </BrowserRouter>
  );
}
