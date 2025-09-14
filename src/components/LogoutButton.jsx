// src/components/LogoutButton.jsx
import { clearSession } from "../services/auth";
import { useNavigate } from "react-router-dom";

export default function LogoutButton({ children = "Cerrar sesión" }) {
  const navigate = useNavigate();

  function handleClick() {
    clearSession();                 // borra el token "access"
    navigate("/login", { replace: true });
  }

  return (
    <button onClick={handleClick}>
      {children}
    </button>
  );
}
