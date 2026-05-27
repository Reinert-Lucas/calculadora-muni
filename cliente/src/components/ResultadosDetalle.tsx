import type { Resultado } from "../utils/types";

function ResultadosDetalle({ resultados }: { resultados: Resultado }) {
  return (
    <>
      {resultados && (
        <>
          <h1>Total General</h1>
          <span>${resultados.TotalGeneral.toFixed(2)}</span>
          <section>
            <h2>Total de m2</h2>
            <span>{resultados.TotalM2.toFixed(2)} m2</span>
            <h2>Categoria Determinada</h2>
            <span>{resultados.CategoriaDeterminada}</span>
          </section>
          <section>
            {/* Una seccion por cada obra distinta cargada */}
            <ul>
              {resultados.EstadoObras.map((obra) => (
                <section>
                  <section>
                    <h2>Resultados FDU</h2>
                    {resultados.ResultadosFDU && (
                      <ul>
                        <li>
                          <strong>Sup 4:</strong> SUP:{" "}
                          {resultados.ResultadosFDU.sup_4.valor_m2.toFixed(2)}{" "}
                          m2 FDU:<span>4% aplicado</span>
                          Categoria:{
                            resultados.ResultadosFDU.sup_4.categoria
                          }{" "}
                          Valor:{" "}
                          {resultados.ResultadosFDU.sup_4.valorMxUt.toFixed(2)}
                          UTs Subtotal: $
                          {resultados.ResultadosFDU.sup_4.subtotal.toFixed(2)}
                        </li>
                        <li>
                          <strong>Sup 8:</strong> SUP:{" "}
                          {resultados.ResultadosFDU.sup_8.valor_m2.toFixed(2)}{" "}
                          m2 FDU:<span>8% aplicado</span>
                          Categoria:{
                            resultados.ResultadosFDU.sup_8.categoria
                          }{" "}
                          Valor:{" "}
                          {resultados.ResultadosFDU.sup_8.valorMxUt.toFixed(2)}
                          UTs Subtotal: $
                          {resultados.ResultadosFDU.sup_8.subtotal.toFixed(2)}
                        </li>
                        <li>
                          <strong>Sup 12:</strong> SUP:{" "}
                          {resultados.ResultadosFDU.sup_12.valor_m2.toFixed(2)}{" "}
                          m2 FDU:<span>12% aplicado</span>
                          Categoria:{
                            resultados.ResultadosFDU.sup_12.categoria
                          }{" "}
                          Valor:{" "}
                          {resultados.ResultadosFDU.sup_12.valorMxUt.toFixed(2)}
                          UTs Subtotal: $
                          {resultados.ResultadosFDU.sup_12.subtotal.toFixed(2)}
                        </li>
                      </ul>
                    )}
                  </section>
                  <li key={obra.id}>
                    <h3>Obra {obra.id}</h3>
                    <span>Superficie: {obra.superficie} m2</span>
                    <span>Categoria: {obra.categoria}</span>
                    <span>Estado: {obra.estado}</span>
                    <ul>
                      <li>
                        Valor m2 de la categoria:{" "}
                        {obra.DatosCategoria.valor_m2.toFixed(2)}
                      </li>
                      <li>UT 2026: {obra.DatosCategoria.UT.toFixed(2)}</li>
                      <li>
                        Monto (valor m2 x UT):{" "}
                        {obra.DatosCategoria.Monto.toFixed(2)}
                      </li>
                      <li>
                        Subtotal (monto x superficie ingresada):{" "}
                        {obra.DatosCategoria.Subtotal.toFixed(2)}
                      </li>
                      <li>
                        % aplicado por estado de obra:{" "}
                        {obra.DatosCategoria.PorcentajeAplicado.toFixed(2)}
                      </li>
                    </ul>
                  </li>
                </section>
              ))}
            </ul>
          </section>
        </>
      )}
    </>
  );
}

export default ResultadosDetalle;
