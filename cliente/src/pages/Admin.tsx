import { useEffect, useState, type FormEvent } from "react";
import {
  acceptInvite,
  AuthError,
  getUser,
  handleAuthCallback,
  login,
  logout,
  MissingIdentityError,
  requestPasswordRecovery,
  updateUser,
  type User,
} from "@netlify/identity";
import { Link } from "react-router-dom";
import { LogOutIcon, SaveIcon } from "lucide-react";
import GopIcon from "../imgs/gop-icon.png";
import { formatoMoneda } from "../utils/formato";
import { guardarValorUt, obtenerValorUt } from "../utils/valorUt";
import "../index.css";

type Vista = "cargando" | "login" | "recuperar" | "invitacion" | "nueva-clave" | "panel";

function mensajeDeError(err: unknown) {
  if (err instanceof MissingIdentityError) return "Netlify Identity no está habilitado en este sitio.";
  if (err instanceof AuthError) {
    if (err.status === 401) return "Usuario o contraseña incorrectos.";
    if (err.status === 422) return "Datos inválidos. Revisá el correo y la contraseña.";
    return err.message;
  }
  return err instanceof Error ? err.message : "Ocurrió un error inesperado.";
}

export default function Admin() {
  const [vista, setVista] = useState<Vista>("cargando");
  const [user, setUser] = useState<User | null>(null);
  const [inviteToken, setInviteToken] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [valorActual, setValorActual] = useState<number | null>(null);
  const [nuevoValor, setNuevoValor] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        // Procesa links de invitación / recuperación / confirmación (#..._token=)
        const callback = await handleAuthCallback();
        if (callback?.type === "invite") {
          setInviteToken(callback.token ?? null);
          setVista("invitacion");
          return;
        }
        if (callback?.type === "recovery") {
          setUser(callback.user);
          setVista("nueva-clave");
          return;
        }
      } catch (err) {
        setError(mensajeDeError(err));
      }
      const actual = await getUser();
      setUser(actual);
      setVista(actual ? "panel" : "login");
    })();
  }, []);

  useEffect(() => {
    if (vista !== "panel") return;
    obtenerValorUt()
      .then((v) => {
        setValorActual(v);
        setNuevoValor(String(v));
      })
      .catch((err) => setError(mensajeDeError(err)));
  }, [vista]);

  async function ejecutar(accion: () => Promise<void>) {
    setEnviando(true);
    setError(null);
    setAviso(null);
    try {
      await accion();
    } catch (err) {
      setError(mensajeDeError(err));
    } finally {
      setEnviando(false);
    }
  }

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    ejecutar(async () => {
      setUser(await login(email, password));
      setPassword("");
      setVista("panel");
    });
  };

  const handleRecuperar = (e: FormEvent) => {
    e.preventDefault();
    ejecutar(async () => {
      await requestPasswordRecovery(email);
      setAviso("Si el correo está registrado, vas a recibir un enlace para restablecer la contraseña.");
      setVista("login");
    });
  };

  const handleInvitacion = (e: FormEvent) => {
    e.preventDefault();
    if (!inviteToken) return;
    ejecutar(async () => {
      setUser(await acceptInvite(inviteToken, password));
      setPassword("");
      setVista("panel");
    });
  };

  const handleNuevaClave = (e: FormEvent) => {
    e.preventDefault();
    ejecutar(async () => {
      setUser(await updateUser({ password }));
      setPassword("");
      setAviso("Contraseña actualizada.");
      setVista("panel");
    });
  };

  const handleGuardar = (e: FormEvent) => {
    e.preventDefault();
    ejecutar(async () => {
      const valor = await guardarValorUt(Number(nuevoValor));
      setValorActual(valor);
      setNuevoValor(String(valor));
      setAviso("Valor de la UT actualizado.");
    });
  };

  const handleLogout = () =>
    ejecutar(async () => {
      await logout();
      setUser(null);
      setVista("login");
    });

  const esAdmin = user?.roles?.includes("admin") ?? false;

  const campoPassword = (etiqueta: string, autoComplete: string) => (
    <div className="mb-3">
      <label htmlFor="password" className="form-label">{etiqueta}</label>
      <input id="password" type="password" className="form-control" required minLength={6}
        autoComplete={autoComplete} value={password} onChange={(e) => setPassword(e.target.value)} />
    </div>
  );

  const campoEmail = (
    <div className="mb-3">
      <label htmlFor="email" className="form-label">Correo electrónico</label>
      <input id="email" type="email" className="form-control" required autoComplete="username"
        value={email} onChange={(e) => setEmail(e.target.value)} />
    </div>
  );

  return (
    <div className="main-container">
      <section className="titulo">
        <h1><img src={GopIcon} alt="Gop Icono" className="logo-gop" />Administración</h1>
        <h6>Municipalidad de Posadas</h6>
      </section>

      <div className="card mb-3 mx-auto" style={{ maxWidth: 480 }}>
        <div className="card-body">
          {error && <div className="alert alert-danger py-2">{error}</div>}
          {aviso && <div className="alert alert-success py-2">{aviso}</div>}

          {vista === "cargando" && (
            <div className="text-center py-4"><div className="spinner-border text-secondary" role="status" /></div>
          )}

          {vista === "login" && (
            <form onSubmit={handleLogin}>
              <h5 className="card-title mb-3">Iniciar sesión</h5>
              {campoEmail}
              {campoPassword("Contraseña", "current-password")}
              <button type="submit" className="btn btn-primary w-100" disabled={enviando}>Ingresar</button>
              <button type="button" className="btn btn-link w-100 mt-2" onClick={() => setVista("recuperar")}>
                Olvidé mi contraseña
              </button>
            </form>
          )}

          {vista === "recuperar" && (
            <form onSubmit={handleRecuperar}>
              <h5 className="card-title mb-3">Recuperar contraseña</h5>
              {campoEmail}
              <button type="submit" className="btn btn-primary w-100" disabled={enviando}>Enviar enlace</button>
              <button type="button" className="btn btn-link w-100 mt-2" onClick={() => setVista("login")}>Volver</button>
            </form>
          )}

          {vista === "invitacion" && (
            <form onSubmit={handleInvitacion}>
              <h5 className="card-title mb-3">Aceptar invitación</h5>
              <p className="text-muted">Elegí una contraseña para tu cuenta.</p>
              {campoPassword("Nueva contraseña", "new-password")}
              <button type="submit" className="btn btn-primary w-100" disabled={enviando}>Crear cuenta</button>
            </form>
          )}

          {vista === "nueva-clave" && (
            <form onSubmit={handleNuevaClave}>
              <h5 className="card-title mb-3">Nueva contraseña</h5>
              {campoPassword("Nueva contraseña", "new-password")}
              <button type="submit" className="btn btn-primary w-100" disabled={enviando}>Guardar contraseña</button>
            </form>
          )}

          {vista === "panel" && user && (
            <>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="text-muted small">{user.email}</span>
                <button type="button" className="btn btn-outline-secondary btn-sm" onClick={handleLogout} disabled={enviando}>
                  <LogOutIcon size={16} /> Salir
                </button>
              </div>

              {esAdmin ? (
                <form onSubmit={handleGuardar}>
                  <h5 className="card-title">Valor de la UT</h5>
                  <p className="text-muted">
                    Valor vigente: {valorActual === null ? "…" : formatoMoneda(valorActual)}
                  </p>
                  <div className="mb-3">
                    <label htmlFor="valor-ut" className="form-label">Nuevo valor</label>
                    <input id="valor-ut" type="number" className="form-control" required min="0.01" step="0.01"
                      value={nuevoValor} onChange={(e) => setNuevoValor(e.target.value)} />
                  </div>
                  <button type="submit" className="btn btn-primary w-100" disabled={enviando}>
                    <SaveIcon size={16} /> Guardar
                  </button>
                </form>
              ) : (
                <div className="alert alert-warning mb-0">
                  Tu usuario no tiene el rol <strong>admin</strong>. Pedile a un administrador que te lo asigne.
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <p className="text-center"><Link to="/">Volver a la calculadora</Link></p>
    </div>
  );
}
