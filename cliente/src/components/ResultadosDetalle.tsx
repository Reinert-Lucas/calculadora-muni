import type { Resultado } from "../utils/types";
import {
  ArrowRight,
  Building,
  Calculator,
  Calendar,
  Download,
  Grid,
  Info,
  PlusCircleIcon,
  Ruler,
} from "lucide-react";
import { formatoMoneda, formatoNumero } from "../utils/formato";
import { useState } from "react";

function ResultadosDetalle({
  resultados,
  utMuni,
}: {
  resultados: Resultado;
  utMuni: number;
}) {
  // Solo mostramos los tramos FDU que realmente se usaron
  const fduUsados = resultados.ResultadosFDU.filter((f) => f.superficie > 0);

  const [generando, setGenerando] = useState(false);

  async function descargarPdf() {
    setGenerando(true);
    try {
      // import dinámico: jsPDF no pesa en la carga inicial de la página
      const { generarInformePdf } = await import("../utils/informePdf");
      await generarInformePdf(resultados, utMuni);
    } catch {
      alert("No se pudo generar el PDF. Intentá nuevamente.");
    } finally {
      setGenerando(false);
    }
  }

  return (
    <>
      <div className="res">
        <h1 className="text-center mt-2 display-6" id="resultado-general">
          Total General
        </h1>
        <p className="text-center fw-bold text-success total-general">
          {formatoMoneda(resultados.TotalGeneral)}
        </p>
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
            <span className="valor-categoria text-primary">
              {formatoNumero(resultados.TotalM2)} m2
            </span>
          </article>
          <article className="text-center">
            <h5>Categoría determinada</h5>
            <span className="valor-categoria text-success">
              {resultados.CategoriaDeterminada}
            </span>
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
                      <td data-label="SUP (m2)">
                        {formatoNumero(f.superficie)}
                      </td>
                      <td data-label="FDU">{f.fdu}</td>
                      <td data-label="Categoría">{f.categoria}</td>
                      <td data-label="Valor m2 x UT">
                        {formatoMoneda(f.valorMxUt)}
                      </td>
                      <td data-label="Subtotal">{formatoMoneda(f.subtotal)}</td>
                    </tr>
                  ))}
                  <tr className="tabla-fdu-total">
                    <td colSpan={5} className="text-end">
                      <strong>
                        Total FDU:{" "}
                        <span className="text-success">
                          {formatoMoneda(resultados.TotalFDU)}
                        </span>
                      </strong>
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
              <span className="obra-pill">
                {" "}
                <Building size={18} /> Estado: <strong>{obra.estado}</strong>
              </span>
              <span className="obra-pill">
                {" "}
                <Ruler size={18} /> Superficie:{" "}
                <strong>{formatoNumero(obra.superficie)} m2</strong>
              </span>
              <span className="obra-pill">
                {" "}
                <Grid size={18} /> Categoría: <strong>{obra.categoria}</strong>
              </span>

              <div className="obra-importe">
                Subtotal de la sección: {formatoMoneda(obra.importe)}
              </div>
              <div className="accordion" id={"accordion-" + obra.id}>
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button
                      className="accordion-button obra-importe"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target={"#collapse" + obra.id}
                      aria-expanded="false"
                      aria-controls={"collapse" + obra.id}
                    >
                      <PlusCircleIcon size={18} className="btn-icon" />
                      Ver Detalles del Cálculo
                    </button>
                  </h2>
                  <div
                    id={"collapse" + obra.id}
                    className="accordion-collapse collapse"
                    data-bs-parent={"accordion-" + obra.id}
                  >
                    <div className="accordion-body">
                      <div className="table-responsive tabla-movil-responsive">
                        <table className="table tabla-movil-detalle">
                          <thead className="visually-hidden">
                            <tr>
                              <th>Concepto</th>
                              <th>Importe</th>
                            </tr>
                          </thead>
                          <tbody className="tabla-res">
                            <tr>
                              <td data-label="Concepto">
                                {" "}
                                <Ruler size={18} /> Valor m2 de la categoría
                              </td>
                              <td
                                data-label="Importe"
                                className="fw-bold text-end"
                              >
                                {formatoNumero(obra.valorM2)}
                              </td>
                            </tr>
                            <tr>
                              <td data-label="Concepto">
                                {" "}
                                <ArrowRight size={18} /> Monto (valor m2 x UT)
                              </td>
                              <td
                                data-label="Importe"
                                className="fw-bold text-end"
                              >
                                {formatoMoneda(obra.monto)}
                              </td>
                            </tr>
                            <tr>
                              <td data-label="Concepto">
                                {" "}
                                <Calculator size={18} /> Subtotal (monto x
                                superficie ingresada)
                              </td>
                              <td
                                data-label="Importe"
                                className="fw-bold text-end"
                              >
                                {formatoMoneda(obra.subtotal)}
                              </td>
                            </tr>
                            <tr>
                              <td data-label="Concepto">
                                {" "}
                                <Calendar size={18} /> UT{" "}
                                {new Date().getFullYear()}
                              </td>
                              <td
                                data-label="Importe"
                                className="fw-bold text-end"
                              >
                                {formatoMoneda(obra.ut)}
                              </td>
                            </tr>
                            <tr>
                              <td data-label="Concepto">
                                % aplicado por estado de obra (
                                {formatoNumero(obra.porcentaje)}
                                %)
                              </td>
                              <td
                                data-label="Importe"
                                className="text-success fw-bold text-end"
                              >
                                {formatoMoneda(obra.importe)}
                              </td>
                            </tr>
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
                  <button
                    className="accordion-button obra-importe"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseTwo"
                    aria-expanded="false"
                    aria-controls="collapseTwo"
                  >
                    <PlusCircleIcon size={18} className="btn-icon" />
                    Ver Costos Adicionales
                  </button>
                </h2>
                <div
                  id="collapseTwo"
                  className="accordion-collapse collapse"
                  data-bs-parent={"total-adicional"}
                >
                  <div className="accordion-body">
                    {resultados.DetalleVisados.length > 0 && (
                      <>
                        <h6 className="fw-bold mb-2">
                          Visados - Colegio de Arquitectos de la Provincia de Misiones y Consejo Profesional de Ingeniería de Misiones
                        </h6>
                        <div className="table-responsive tabla-fdu-responsive mb-3">
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
                                  <td data-label="Instalaci?n">{d.nombre}</td>
                                  <td data-label="Unidades">{d.unidades}</td>
                                  <td data-label="Factor">
                                    {formatoNumero(d.factor)}
                                  </td>
                                  <td data-label="UT">{formatoMoneda(d.ut)}</td>
                                  <td data-label="Subtotal">
                                    {formatoMoneda(d.subtotal)}
                                  </td>
                                </tr>
                              ))}
                              <tr className="tabla-fdu-total">
                                <td colSpan={5} className="text-end">
                                  <strong>
                                    Total visados:{" "}
                                    <span className="text-success">
                                      {formatoMoneda(
                                        resultados.CostosAdicionales
                                          .colegioArquitectos,
                                      )}
                                    </span>
                                  </strong>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {resultados.DetalleVisados.length > 0 && (
              <h6 className="text-center text-muted p-2 fw-light disclaimer">
                <Info size={18} /> Este simulador es estimativo de las tareas de
                visado de las Instalaciones Complementarias conforme a la
                Ordenanza XVIII - N°320. No se contemplan gastos menores
                correspondientes al registro de la tarea profesional que puede
                gestionarse en las plataformas de Autogesti?n del Colegio de
                Arquitectos o consultar por medios habilitados al CPIM
              </h6>
            )}
          </section>
        ) : (
          <section className="detalle-costos-adicionales">
            <h2>Costos Adicionales Aplicados</h2>
            <p>No se aplicaron costos adicionales</p>
          </section>
        )}
        <h6 className="text-center text-muted p-2 fw-light disclaimer">
          {" "}
          <Info size={18} /> El presente cálculo es estimativo, no incluye
          costos menores referidos a los Tributos 231 (Inspecciones y
          demoliciones) y Tributo 233 (Derechos de Oficina). Los valores están
          sujetos al valor de la UT (Unidad Tributaria) vigente sujeto a
          actualización.
        </h6>
      </div>
    </>
  );
}

export default ResultadosDetalle;
