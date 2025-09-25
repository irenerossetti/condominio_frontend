// src/components/LogoutButton.jsx
import { clearSession } from "../services/auth";
import { logout } from "../services/auth"; // 👈 Cambia la importación
import { useNavigate } from "react-router-dom";

export default function LogoutButton({ children = "Cerrar sesión" }) {
  const navigate = useNavigate();

  async function handleClick() {
    await logout(); // 👈 Llama a la nueva función asíncrona
    navigate("/login", { replace: true });
  }

  return (
    <button onClick={handleClick}>
      {children}
    </button>
  );
}
