import type { Resultado } from "../utils/types";
import { ArrowRight, Building, Calculator, Calendar, Download, Grid, Info, Layers2Icon, PlusCircleIcon, Ruler } from "lucide-react";
import LogoIcon from "../imgs/gop-icon.png";
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
      <div className="res">
        <h1 className="text-center mt-2 display-6" id="resultado-general">Total General</h1>
        <p className="text-center fw-bold text-success total-general">{formatoMoneda(resultados.TotalGeneral)}</p>
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
            <div className="table-responsive tabla-fdu-responsive">
              <table className="table tabla-fdu-resultados">
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
                      <td data-label="SUP (m2)">{formatoNumero(f.superficie)}</td>
                      <td data-label="FDU">{f.fdu}</td>
                      <td data-label="Categoría">{f.categoria}</td>
                      <td data-label="Valor m2 x UT">{formatoMoneda(f.valorMxUt)}</td>
                      <td data-label="Subtotal">{formatoMoneda(f.subtotal)}</td>
                    </tr>
                  ))}
                  <tr className="tabla-fdu-total">
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

        <ul className="lista-obras">
          {resultados.EstadoObras.map((obra) => (
            <li key={obra.id} className="detalle-obra">
              <span className="obra-pill"> <Layers2Icon size={18} /> Obra <strong>#{obra.id}</strong></span>
              <span className="obra-pill"> <Ruler size={18} /> Superficie: <strong>{formatoNumero(obra.superficie)} m2</strong></span>
              <span className="obra-pill"> <Grid size={18} /> Categoría: <strong>{obra.categoria}</strong></span>
              <span className="obra-pill"> <Building size={18} /> Estado: <strong>{obra.estado}</strong></span>

              <div className="obra-importe">Subtotal de la sección: {formatoMoneda(obra.importe)}</div>
              <div className="accordion" id={"accordion-" + obra.id}>
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button className="accordion-button obra-importe" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                      <PlusCircleIcon size={18} className="btn-icon" />
                      Ver Detalles del Cálculo
                    </button>
                  </h2>
                  <div id="collapseOne" className="accordion-collapse collapse" data-bs-parent={"accordion-" + obra.id}>
                    <div className="accordion-body">
                      <div className="table-responsive tabla-movil-responsive">
                        <table className="table tabla-movil-detalle">
                          <thead className="visually-hidden">
                            <tr><th>Concepto</th><th>Importe</th></tr>
                          </thead>
                          <tbody className="tabla-res">
                            <tr><td data-label="Concepto"> <Ruler size={18} /> Valor m2 de la categoría</td><td data-label="Importe" className="fw-bold text-end">{formatoNumero(obra.valorM2)}</td></tr>
                            <tr><td data-label="Concepto"> <ArrowRight size={18} /> Monto (valor m2 x UT)</td><td data-label="Importe" className="fw-bold text-end">{formatoMoneda(obra.monto)}</td></tr>
                            <tr><td data-label="Concepto"> <Calculator size={18} /> Subtotal (monto x superficie ingresada)</td><td data-label="Importe" className="fw-bold text-end">{formatoMoneda(obra.subtotal)}</td></tr>
                            <tr><td data-label="Concepto"> <Calendar size={18} /> UT {new Date().getFullYear()}</td><td data-label="Importe" className="fw-bold text-end">{formatoMoneda(obra.ut)}</td></tr>
                            <tr><td data-label="Concepto">% aplicado por estado de obra ({formatoNumero(obra.porcentaje)}%)</td><td data-label="Importe" className="text-success fw-bold text-end">{formatoMoneda(obra.importe)}</td></tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
        {resultados.TotalAdicionales > 0 ? (
          <section className="detalle-costos-adicionales">
            <h2>Costos Adicionales Aplicados</h2>
            <div className="accordion" id={"total-adicional"}>
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button className="accordion-button obra-importe" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                    <PlusCircleIcon size={18} className="btn-icon" />
                    Ver Costos Adicionales
                  </button>
                </h2>
                <div id="collapseTwo" className="accordion-collapse collapse" data-bs-parent={"total-adicional"}>
                  <div className="accordion-body">
                    <div className="table-responsive tabla-movil-responsive">
                      <table className="table tabla-movil-detalle">
                        <thead className="visually-hidden">
                          <tr><th>Concepto</th><th>Importe</th></tr>
                        </thead>
                        <tbody className="tabla-res">
                          {resultados.CostosAdicionales.colegio1 > 0 && (
                            <tr>
                              <td data-label="Concepto">Visado de Instalaciones Complementarias</td>
                              <td data-label="Importe">{formatoMoneda(resultados.CostosAdicionales.colegio1)}</td>
                            </tr>
                          )}
                          {resultados.CostosAdicionales.colegio2 > 0 && (
                            <tr>
                              <td data-label="Concepto">Colegio de Arquitectos de la Provincia de Misiones</td>
                              <td data-label="Importe">{formatoMoneda(resultados.CostosAdicionales.colegio2)}</td>
                            </tr>
                          )}
                          {resultados.CostosAdicionales.bomberos > 0 && (
                            <tr>
                              <td data-label="Concepto">Costo del Trámite en Bomberos</td>
                              <td data-label="Importe">{formatoMoneda(resultados.CostosAdicionales.bomberos)}</td>
                            </tr>
                          )}
                          {resultados.CostosAdicionales.honorarios > 0 && (
                            <tr>
                              <td data-label="Concepto">Honorarios del Profesional</td>
                              <td data-label="Importe">{formatoMoneda(resultados.CostosAdicionales.honorarios)}</td>
                            </tr>
                          )}
                          <tr className="adicionales-foot">
                            <td data-label="Concepto"><strong>Total adicional</strong></td>
                            <td data-label="Importe"><strong className="text-success">{formatoMoneda(resultados.TotalAdicionales)}</strong></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : <section className="detalle-costos-adicionales">
          <h2>Costos Adicionales Aplicados</h2>
          <p>No se aplicaron costos adicionales</p>
        </section>}
        <h6 className="text-center text-muted p-2 fw-light disclaimer"> <Info size={18} /> El presente cálculo es estimativo, no incluye costos menores referidos a los Tributos 231 (Inspecciones y demoliciones) y Tributo 233 (Derechos de Oficina). Los valores están sujetos al valor de la UT (Unidad Tributaria) vigente sujeto a actualización.</h6>
      </div>
    </>
  );
}

export default ResultadosDetalle;