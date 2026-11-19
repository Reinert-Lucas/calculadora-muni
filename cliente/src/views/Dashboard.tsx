import { useEffect, useState, type FormEvent } from "react";
import axios from "axios";
import { Link, Navigate, useNavigate } from "react-router-dom";

export type DynamicValue = {
  _id: string;
  value_type: string;
  value: number;
  last_update: string;
};

type EditableDynamicValue = Omit<DynamicValue, "value"> & { value: string };

export default function Dashboard() {
  const [status, setStatus] = useState<
    "loading" | "authenticated" | "unauthenticated" | "error"
  >("loading");
  const [values, setValues] = useState<EditableDynamicValue[]>([]);
  const [username, setUsername] = useState("");
  const [logoutError, setLogoutError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const apiUrl = import.meta.env.VITE_LOGIN_URL || "http://localhost:5050";
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    const loadDashboard = async () => {
      try {
        const { data: session } = await axios.get<{
          user: { username: string };
        }>(new URL("/auth/me", apiUrl).toString(), { withCredentials: true });
        const { data: dynamicValues } = await axios.get<DynamicValue[]>(
          new URL("/values", apiUrl).toString(),
          { withCredentials: true },
        );

        if (active) {
          setUsername(session.user.username);
          setValues(
            dynamicValues.map((item) => ({
              ...item,
              value: String(item.value),
            })),
          );
          setStatus("authenticated");
        }
      } catch (error: unknown) {
        if (!active) return;
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          setStatus("unauthenticated");
        } else {
          setStatus("error");
        }
      }
    };

    void loadDashboard();
    return () => {
      active = false;
    };
  }, [apiUrl]);

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaveError("");
    setSaveMessage("");

    const hasInvalidValue = values.some(
      ({ value }) =>
        value.trim() === "" ||
        !Number.isFinite(Number(value)) ||
        Number(value) < 0,
    );
    if (hasInvalidValue) {
      setSaveError(
        "Ingresá un número válido, mayor o igual a cero, en cada campo.",
      );
      return;
    }

    setIsSaving(true);
    try {
      const { data: updatedValues } = await axios.put<DynamicValue[]>(
        new URL("/values", apiUrl).toString(),
        {
          values: values.map(({ _id, value }) => ({
            _id,
            value: Number(value),
          })),
        },
        { withCredentials: true },
      );
      setValues(
        updatedValues.map((item) => ({ ...item, value: String(item.value) })),
      );
      setSaveMessage("Los valores se guardaron correctamente.");
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setStatus("unauthenticated");
      } else {
        setSaveError("No se pudieron guardar los valores. Intentá nuevamente.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    setLogoutError("");
    try {
      await axios.post(
        new URL("/auth/logout", apiUrl).toString(),
        {},
        { withCredentials: true },
      );
      navigate("/login", { replace: true });
    } catch {
      setLogoutError("No se pudo cerrar la sesión. Intentá nuevamente.");
    }
  };

  if (status === "loading") {
    return <main className="container py-5">Cargando dashboard...</main>;
  }
  if (status === "unauthenticated") {
    return <Navigate to="/login" replace />;
  }
  if (status === "error") {
    return (
      <main className="container py-5" role="alert">
        No se pudieron cargar los datos del dashboard. Intentá nuevamente más
        tarde.
      </main>
    );
  }

  return (
    <main className="container py-5">
      <section className="card mx-auto mb-4" style={{ maxWidth: "56rem" }}>
        <div className="card-body d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div>
            <h1 className="h3 card-title mb-1">Dashboard</h1>
            <p className="card-text mb-0">Sesión iniciada como {username}.</p>
          </div>
          <div className="d-flex gap-2">
            <Link className="btn btn-success" to="/">
              Ir a la calculadora
            </Link>
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={handleLogout}
            >
              Cerrar sesión
            </button>
          </div>
          {logoutError && (
            <p className="text-danger mb-0" role="alert">
              {logoutError}
            </p>
          )}
        </div>
      </section>

      <section className="card mx-auto" style={{ maxWidth: "56rem" }}>
        <div className="card-body">
          <h2 className="h4 card-title">Valores dinámicos</h2>
          <p className="text-muted">
            Editá los valores y guardá los cambios en la base de datos.
          </p>

          {values.length === 0 ? (
            <p className="mb-0">No hay valores dinámicos para mostrar.</p>
          ) : (
            <form onSubmit={handleSave}>
              <div className="row g-3">
                {values.map((item, index) => (
                  <div className="col-12 col-md-6" key={item._id}>
                    <label
                      className="form-label"
                      htmlFor={`dynamic-value-${item._id}`}
                    >
                      {item.value_type}
                    </label>
                    <input
                      className="form-control"
                      id={`dynamic-value-${item._id}`}
                      type="number"
                      min="0"
                      step="any"
                      required
                      value={item.value}
                      onChange={(event) => {
                        const nextValue = event.target.value;
                        setValues((current) =>
                          current.map((value, valueIndex) =>
                            valueIndex === index
                              ? { ...value, value: nextValue }
                              : value,
                          ),
                        );
                        setSaveMessage("");
                      }}
                    />
                    <small className="text-muted">
                      Última actualización:{" "}
                      {new Date(item.last_update).toLocaleString()}
                    </small>
                  </div>
                ))}
              </div>

              {saveError && (
                <p className="text-danger mt-3 mb-0" role="alert">
                  {saveError}
                </p>
              )}
              {saveMessage && (
                <p className="text-success mt-3 mb-0" role="status">
                  {saveMessage}
                </p>
              )}
              <button
                className="btn btn-success mt-4"
                type="submit"
                disabled={isSaving}
              >
                {isSaving ? "Guardando..." : "Guardar"}
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
