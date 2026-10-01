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
      <h1 className="text-center mt-2 display-6">Total General</h1>
      <p className="text-center fw-bold text-success display-2">{formatoMoneda(resultados.TotalGeneral)}</p>

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
          <span className="display-6 text-primary">{formatoNumero(resultados.TotalM2)} m2</span>
        </article>
        <article className="text-center">
          <h5>Categoría determinada</h5>
          <span className="display-6 text-success">{resultados.CategoriaDeterminada}</span>
        </article>
      </section>

      <section className="detalle-fdu">
        <h2>Resultados FDU</h2>
        {fduUsados.length > 0 ? (
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

            <table className="table">
              <tbody>
                <tr><td>Valor m2 de la categoría</td><td>{formatoNumero(obra.valorM2)}</td></tr>
                <tr><td>Monto (valor m2 x UT)</td><td>{formatoMoneda(obra.monto)}</td></tr>
                <tr><td>Subtotal (monto x superficie ingresada)</td><td>{formatoMoneda(obra.subtotal)}</td></tr>
                <tr><td>UT 2026</td><td>{formatoMoneda(obra.ut)}</td></tr>
                <tr><td>% aplicado por estado de obra</td><td>{formatoNumero(obra.porcentaje)} %</td></tr>
              </tbody>
            </table>
          </li>
        ))}
      </ul>
    </>
  );
}

export default ResultadosDetalle;