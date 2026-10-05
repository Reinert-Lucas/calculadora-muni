import type { ResultadoSoloFDU } from "../utils/types";
import { Info, Download } from "lucide-react";
import { formatoMoneda, formatoNumero } from "../utils/formato";
import { useState } from "react";
import LogoIcon from "../imgs/gop-icon.png"

function ResultadosFDUDetalle({ resultados }: { resultados: ResultadoSoloFDU }) {
  const [generando, setGenerando] = useState(false);

  async function descargarPdf() {
    setGenerando(true);
    try {
      // import dinámico: jsPDF no pesa en la carga inicial de la página
      const { generarInformePdfSoloFdu } = await import("../utils/informePdf");
      await generarInformePdfSoloFdu(resultados, LogoIcon);
    } catch {
      alert("No se pudo generar el PDF. Intentá nuevamente.");
    } finally {
      setGenerando(false);
    }
  }

  return (
    <>
      <div className="res">
        <h1 className="text-center mt-2 display-6" id="resultado-general">Resultado FDU</h1>
        <p className="text-center fw-bold text-success total-general">{formatoMoneda(resultados.TotalFDU)}</p>

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

        <section className="detalle-fdu">
          <h2>Resultados FDU</h2>
          {resultados.ResultadosFDU.length > 0 ? (
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
                  {resultados.ResultadosFDU.map((f) => (
                    <tr key={f.clave}>
                      <td>{formatoNumero(f.superficie)}</td>
                      <td>{f.fdu}</td>
                      <td>{f.superficie === 0 ? "-" : f.categoria}</td>
                      <td>{formatoMoneda(f.valorMxUt)}</td>
                      <td>{formatoMoneda(f.subtotal)}</td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={5} className="text-end">
                      <strong>Total FDU: <span className="text-success">{formatoMoneda(resultados.TotalFDU)}</span></strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <p>No se aplica FDU.</p>
          )}
        </section>
        <h6 className="text-center text-muted p-2 fw-light disclaimer"> <Info size={18} />  Este resultado corresponde únicamente al FDU. No incluye el cálculo de honorarios/obra ni otros tributos. El presente cálculo es estimativo, no incluye costos menores referidos a los Tributos 231 (Inspecciones y demoliciones) y Tributo 233 (Derechos de Oficina). Los valores están sujetos al valor de la UT (Unidad Tributaria) vigente sujeto a actualización.</h6>
      </div>
    </>
  );
}

export default ResultadosFDUDetalle;