import type { ResultadoVisados } from "../utils/types";
import { Info } from "lucide-react";
import { formatoMoneda, formatoNumero } from "../utils/formato";

function ResultadosVisadosDetalle({
    resultados,
}: {
    resultados: ResultadoVisados;
}) {
    return (
        <div className="res">
            <h1 className="text-center mt-2 display-6" id="resultado-general">
                Resultado Visados
            </h1>
            <p className="text-center text-muted">
                Colegio de Arquitectos de la Provincia de Misiones
            </p>
            <p className="text-center fw-bold text-success total-general">
                {formatoMoneda(resultados.TotalVisados)}
            </p>

            <section className="detalle-fdu">
                <h2>Detalle por instalación</h2>
                <div className="table-responsive tabla-fdu-responsive">
                    <table className="table tabla-fdu-resultados">
                        <thead>
                            <tr>
                                <th>Instalación</th>
                                <th>Unidades</th>
                                <th>Factor</th>
                                <th>UT</th>
                                <th>Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {resultados.DetalleVisados.map((d) => (
                                <tr key={d.clave}>
                                    <td data-label="Instalación">{d.nombre}</td>
                                    <td data-label="Unidades">{d.unidades}</td>
                                    <td data-label="Factor">
                                        {formatoNumero(d.factor)}
                                    </td>
                                    <td data-label="UT">
                                        {formatoMoneda(d.ut)}
                                    </td>
                                    <td data-label="Subtotal">
                                        {formatoMoneda(d.subtotal)}
                                    </td>
                                </tr>
                            ))}
                            <tr className="tabla-fdu-total">
                                <td colSpan={6} className="text-end">
                                    <strong>
                                        Total visados:{" "}
                                        <span className="text-success">
                                            {formatoMoneda(
                                                resultados.TotalVisados,
                                            )}
                                        </span>
                                    </strong>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
            <h6 className="text-center text-muted p-2 fw-light disclaimer">
                <Info size={18} /> Este resultado corresponde únicamente al
                visado del Colegio de Arquitectos. Cálculo estimativo.
            </h6>
        </div>
    );
}

export default ResultadosVisadosDetalle;
