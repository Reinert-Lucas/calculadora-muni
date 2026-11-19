import { useState, type FormEvent } from "react";
import "../css/views.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_LOGIN_URL || "http://localhost:5050";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await axios.post(
        new URL("/auth/login", apiUrl).toString(),
        { username, password },
        { withCredentials: true },
      );
      setPassword("");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setErrorMessage(
        axios.isAxiosError(error) && error.response?.status === 401
          ? "Usuario o contraseña incorrectos."
          : "No se pudo conectar con el servidor. Intentá nuevamente.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <header className="login-card__header">
          <h1 className="text-center">Iniciar sesión</h1>
        </header>
        <div className="login-card__body">
          <div className="login-field">
            <label htmlFor="username">Usuario</label>
            <input
              className="login-input"
              type="text"
              placeholder="Usuario"
              id="username"
              name="username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="login-field">
            <label htmlFor="password">Contraseña</label>
            <input
              className="login-input"
              type="password"
              placeholder="Contraseña"
              id="password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="login-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Ingresando..." : "Ingresar"}
          </button>
          {errorMessage && (
            <p className="login-error" role="alert">
              {errorMessage}
            </p>
          )}
          <Link className="login-back-link" to="/">
            Volver a la calculadora
          </Link>
        </div>
      </form>
    </main>
  );
}
