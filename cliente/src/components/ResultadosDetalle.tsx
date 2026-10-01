import type { Resultado } from "../utils/types";

function ResultadosDetalle({ resultados }: { resultados: Resultado }) {
  return (
    <>
      {resultados && (
        <>
          <h1 className="text-center mt-2">Total General</h1>
          <p className="text-center fw-bold fs-4">
            ${resultados.TotalGeneral.toFixed(2)}
          </p>
          <section className="detalle-categoria">
            <article className="text-center">
              <h5>Total de m2</h5>
              <span>{resultados.TotalM2.toFixed(2)} m2</span>
            </article>
            <article className="text-center">
              <h5>Categoria Determinada</h5>
              <span>{resultados.CategoriaDeterminada}</span>
            </article>
          </section>
          <section className="detalle-general">
            <section className="detalle-fdu">
              <h2>Resultados FDU</h2>
              {resultados.ResultadosFDU.sup_12.subtotal > 0 ||
                resultados.ResultadosFDU.sup_8.subtotal > 0 ||
                resultados.ResultadosFDU.sup_4.subtotal > 0 ? (
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">SUP (m2)</th>
                      <th scope="col">FDU</th>
                      <th scope="col">Categoria</th>
                      <th scope="col">Valor m2 x UT</th>
                      <th scope="col">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        {resultados.ResultadosFDU.sup_4.valor_m2.toFixed(2)}
                      </td>
                      <td>{resultados.ResultadosFDU.sup_4.fdu}</td>
                      <td>{resultados.ResultadosFDU.sup_4.categoria}</td>
                      <td>
                        {resultados.ResultadosFDU.sup_4.valorMxUt.toFixed(2)}
                      </td>
                      <td>
                        {resultados.ResultadosFDU.sup_4.subtotal.toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        {resultados.ResultadosFDU.sup_8.valor_m2.toFixed(2)}
                      </td>
                      <td>{resultados.ResultadosFDU.sup_8.fdu}</td>
                      <td>{resultados.ResultadosFDU.sup_8.categoria}</td>
                      <td>
                        {resultados.ResultadosFDU.sup_8.valorMxUt.toFixed(2)}
                      </td>
                      <td>
                        {resultados.ResultadosFDU.sup_8.subtotal.toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        {resultados.ResultadosFDU.sup_12.valor_m2.toFixed(2)}
                      </td>
                      <td>{resultados.ResultadosFDU.sup_12.fdu}</td>
                      <td>{resultados.ResultadosFDU.sup_12.categoria}</td>
                      <td>
                        {resultados.ResultadosFDU.sup_12.valorMxUt.toFixed(2)}
                      </td>
                      <td>
                        {resultados.ResultadosFDU.sup_12.subtotal.toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={5} className="text-end">
                        <strong>
                          Total FDU:{" "}
                          {resultados.ResultadosFDU.sup_12.subtotal +
                            resultados.ResultadosFDU.sup_8.subtotal +
                            resultados.ResultadosFDU.sup_4.subtotal}
                        </strong>
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
                <div className="detalle-obra" key={obra.id}>
                  <li>
                    <span className="obra-pill">
                      Obra <strong>#{obra.id}</strong>
                    </span>
                    <span className="obra-pill">
                      Superficie: <strong>{obra.superficie}m2</strong>
                    </span>
                    <span className="obra-pill">
                      Categoria: <strong>{obra.categoria}</strong>
                    </span>
                    <span className="obra-pill">
                      Estado: <strong>{obra.estado}</strong>
                    </span>
                    <section>
                      Subtotal de la Seccion: $
                      {obra.DatosCategoria.PorcentajeAplicado}
                    </section>
                    <table className="table">
                      <tbody>
                        <tr>
                          <td>Valor m2 de la categoria</td>
                          <td>{obra.DatosCategoria.valor_m2.toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td>Monto (valor m2 x UT)</td>
                          <td>{obra.DatosCategoria.Monto.toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td>Subtotal (monto x superficie ingresada)</td>
                          <td>{obra.DatosCategoria.Subtotal.toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td>UT 2026</td>
                          <td>{obra.DatosCategoria.UT.toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td>% aplicado por estado de obra</td>
                          <td>
                            {obra.DatosCategoria.PorcentajeAplicado.toFixed(2)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </li>
                </div>
              ))}
            </ul>
          </section>
        </>
      )}
    </>
  );
}

export default ResultadosDetalle;
