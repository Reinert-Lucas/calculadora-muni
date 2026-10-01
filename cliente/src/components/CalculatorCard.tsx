import Header from "./Header";
import Form from "./Form";
import { VALOR_UT } from "../constants/impuestos";
import { formatoMoneda } from "../utils/formato";

export default function CalculatorCard() {
  return (
    <div className="card mb-3">
      <div className="card-header p-0">
        <Header />
      </div>
      <div className="card-body">
        <p className="card-title text-center h5">
          Valor de la UT correspondiente al año 2026: {formatoMoneda(VALOR_UT)}
        </p>
        <Form />
      </div>
      <span className="text-center p-2 fw-light disclaimer">El presente cálculo es estimativo, no incluye costos menores referidos a los Tributos 231 (Inspecciones y demoliciones) y Tributo 233 (Derechos de Oficina). Los valores están sujetos al valor de la UT (Unidad Tributaria) vigente sujeto a actualización.</span>
    </div>
  );
}