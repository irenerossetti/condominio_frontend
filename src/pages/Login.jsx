// src/pages/Login.jsx
import { useState } from "react";
import "./login.css";

function LogoIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
      <path d="M3 10.5 12 4l9 6.5" stroke="#14532d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5 10.5V20h14v-9.5" stroke="#14532d" strokeWidth="2" strokeLinecap="round"/>
      <rect x="9" y="13" width="6" height="7" rx="1.5" fill="#16a34a"/>
    </svg>
  );
}
const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6zm2 .5 8 5 8-5"/></svg>
);
const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10V7a5 5 0 0 1 10 0v3"/><rect x="5" y="10" width="14" height="11" rx="2"/><circle cx="12" cy="16" r="1.5"/></svg>
);

export default function Login() {
  const [loading, setLoading] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1200);
  };

  return (
    <div className="lmw-screen">
      <div className="lmw-container">
        <div className="lmw-logo"><LogoIcon /></div>

        <h1 className="lmw-title">Bienvenido</h1>
        <p className="lmw-subtitle">Inicie sesión para acceder a su cuenta</p>

        <form className="lmw-form" onSubmit={onSubmit}>
          <label className="lmw-input">
            <span className="lmw-icon"><MailIcon /></span>
            <input type="email" placeholder="Correo electrónico" required />
          </label>

          <label className="lmw-input">
            <span className="lmw-icon"><LockIcon /></span>
            <input type="password" placeholder="Contraseña" required />
          </label>

          <button className="lmw-submit" disabled={loading}>
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <a className="lmw-link" href="#">¿Olvidó su contraseña?</a>
      </div>
    </div>
  );
}
