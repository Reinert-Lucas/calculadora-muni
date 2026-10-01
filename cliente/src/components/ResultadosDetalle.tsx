import type { Resultado } from "../utils/types";
import { Download } from "lucide-react";
import LogoIcon from "../imgs/calculadora-icon.png";
import { formatoMoneda, formatoNumero } from "../utils/formato";
import { useState } from "react";

function ResultadosDetalle({ resultados }: { resultados: Resultado }) {
  // Solo mostramos los tramos FDU que realmente se usaron
  const fduUsados = resultados.ResultadosFDU.filter((f) => f.superficie > 0);

  const [generando, setGenerando] = useState(false);

  async function descargarPdf() {
    setGenerando(true);
    try {
      // import dinámico: jsPDF no pesa en la carga inicial de la página
      const { generarInformePdf } = await import("../utils/informePdf");
      await generarInformePdf(resultados, LogoIcon);
    } catch {
      alert("No se pudo generar el PDF. Intentá nuevamente.");
    } finally {
      setGenerando(false);
    }
  }

  return (
    <>
      <h1 className="text-center mt-2 display-6" id="resultado-general">Total General</h1>
      <p className="text-center fw-bold text-success total-general">{formatoMoneda(resultados.TotalGeneral)}</p>

      {resultados.TotalAdicionales > 0 && (
        <section className="detalle-costos-adicionales">
          <h2>Costos adicionales incluidos</h2>
          <ul>
            {resultados.CostosAdicionales.colegio1 > 0 && (
              <li>Colegio 1: {formatoMoneda(resultados.CostosAdicionales.colegio1)}</li>
            )}
            {resultados.CostosAdicionales.colegio2 > 0 && (
              <li>Colegio 2: {formatoMoneda(resultados.CostosAdicionales.colegio2)}</li>
            )}
            {resultados.CostosAdicionales.honorarios > 0 && (
              <li>Honorarios: {formatoMoneda(resultados.CostosAdicionales.honorarios)}</li>
            )}
            <li><strong>Total adicional: {formatoMoneda(resultados.TotalAdicionales)}</strong></li>
          </ul>
        </section>
      )}

      <div className="text-center mb-3">
        <button
          type="button"
          className="descargar-pdf-btn"
          onClick={descargarPdf}
          disabled={generando}
        >
          <Download size={18} />
          {generando ? "Generando..." : "Descargar PDF"}
        </button>
      </div>

      <section className="detalle-categoria">
        <article className="text-center">
          <h5>Total de m2</h5>
          <span className="valor-categoria text-primary">{formatoNumero(resultados.TotalM2)} m2</span>
        </article>
        <article className="text-center">
          <h5>Categoría determinada</h5>
          <span className="valor-categoria text-success">{resultados.CategoriaDeterminada}</span>
        </article>
      </section>

      <section className="detalle-fdu">
        <h2>Resultados FDU</h2>
        {fduUsados.length > 0 ? (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>SUP (m2)</th>
                  <th>FDU</th>
                  <th>Categoría</th>
                  <th>Valor m2 x UT</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {fduUsados.map((f) => (
                  <tr key={f.clave}>
                    <td>{formatoNumero(f.superficie)}</td>
                    <td>{f.fdu}</td>
                    <td>{f.categoria}</td>
                    <td>{formatoMoneda(f.valorMxUt)}</td>
                    <td>{formatoMoneda(f.subtotal)}</td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={5} className="text-end">
                    <strong>Total FDU: {formatoMoneda(resultados.TotalFDU)}</strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <p>No se aplica FDU.</p>
        )}
      </section>

      <ul className="lista-obras">
        {resultados.EstadoObras.map((obra) => (
          <li key={obra.id} className="detalle-obra">
            <span className="obra-pill">Obra <strong>#{obra.id}</strong></span>
            <span className="obra-pill">Superficie: <strong>{formatoNumero(obra.superficie)} m2</strong></span>
            <span className="obra-pill">Categoría: <strong>{obra.categoria}</strong></span>
            <span className="obra-pill">Estado: <strong>{obra.estado}</strong></span>

            <div className="obra-importe">Subtotal de la sección: {formatoMoneda(obra.importe)}</div>
            <div className="table-responsive">
              <table className="table">
                <tbody>
                  <tr><td>Valor m2 de la categoría</td><td>{formatoNumero(obra.valorM2)}</td></tr>
                  <tr><td>Monto (valor m2 x UT)</td><td>{formatoMoneda(obra.monto)}</td></tr>
                  <tr><td>Subtotal (monto x superficie ingresada)</td><td>{formatoMoneda(obra.subtotal)}</td></tr>
                  <tr><td>UT 2026</td><td>{formatoMoneda(obra.ut)}</td></tr>
                  <tr><td>% aplicado por estado de obra</td><td>{formatoNumero(obra.porcentaje)} %</td></tr>
                </tbody>
              </table>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

export default ResultadosDetalle;