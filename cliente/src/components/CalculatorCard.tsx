import Header from "./Header";
import Form from "./Form";
import { formatoMoneda } from "../utils/formato";
import { useValorUt } from "../utils/valorUt";

export default function CalculatorCard() {
  const { valor, usandoDefecto } = useValorUt();

  return (
    <div className="card mb-3">
      <div className="card-header p-0">
        <Header />
      </div>
      <div className="card-body">
        {valor === null ? (
          <div className="text-center py-4">
            <div className="spinner-border text-secondary" role="status" />
            <p className="text-muted mt-2 mb-0">Cargando valor de la UT…</p>
          </div>
        ) : (
          <>
            <p className="card-title text-center h5">
              Valor de la UT correspondiente al año {new Date().getFullYear()}: {formatoMoneda(valor)}
            </p>
            {usandoDefecto && (
              <p className="text-center text-warning small">
                No se pudo obtener el valor actualizado de la UT; se usa el valor por defecto.
              </p>
            )}
            {/* Formulario */}
            <Form valorUt={valor} />
          </>
        )}
      </div>
    </div>
  );
}
