import { useEffect, useState } from "react";
import axios from "axios";
import Form from "./Form";
import { formatoMoneda } from "../utils/formato";
import { CalculatorIcon } from "lucide-react";

type CalculatorValues = {
  ut_muni: number;
  ut_capm: number;
};

export default function CalculatorCard() {
  const [values, setValues] = useState<CalculatorValues | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const apiUrl = import.meta.env.VITE_LOGIN_URL || "http://localhost:5050";

  useEffect(() => {
    let active = true;

    axios
      .get<CalculatorValues>(new URL("/values/calculator", apiUrl).toString())
      .then(({ data }) => {
        if (
          !Number.isFinite(data.ut_muni) ||
          data.ut_muni <= 0 ||
          !Number.isFinite(data.ut_capm) ||
          data.ut_capm <= 0
        ) {
          throw new Error("La respuesta no contiene valores de UT válidos");
        }
        if (active) setValues(data);
      })
      .catch(() => {
        if (active) {
          setValues({ ut_capm: 3748.5, ut_muni: 1430 });
          // setError("No se pudieron cargar los valores desde el servidor.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [apiUrl, retry]);

  return (
    <div className="card mb-3">
      <div className="card-header p-0">
        <div className="header-container">
          <CalculatorIcon size={48} />
          <h1>Calculadora de Derechos Municipales</h1>
        </div>
      </div>
      <div className="card-body">
        {loading && (
          <p className="text-center" role="status">
            Cargando valores de la calculadora...
          </p>
        )}
        {error && (
          <div className="alert alert-danger" role="alert">
            <p>{error}</p>
            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={() => {
                setLoading(true);
                setError("");
                setRetry((current) => current + 1);
              }}
            >
              Reintentar
            </button>
          </div>
        )}
        {values && !loading && (
          <>
            <p className="card-title text-center h5">
              Valor de la UT municipal ({new Date().getFullYear()}):{" "}
              {formatoMoneda(values.ut_muni)}
            </p>
            <p className="card-title text-center text-muted">
              UT CAPM para visados: {formatoMoneda(values.ut_capm)}
            </p>
            <Form utMuni={values.ut_muni} utCapm={values.ut_capm} />
          </>
        )}
      </div>
    </div>
  );
}
