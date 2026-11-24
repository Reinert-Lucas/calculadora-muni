import { CalculatorIcon, TrashIcon, XCircleIcon } from "lucide-react";
import { FDU_TRAMOS } from "../constants/impuestos";
import { aNumero, FDU_INICIAL, type CalculoFDUProps } from "../utils/types";

export default function CalculoFDU({
  mostrarFdu,
  fdu,
  obras,
  utMuni,
  costos,
  setFdu,
  setMostrarFdu,
  setResultados,
  onSoloFdu,
  onCalcularTotal,
  totalVisadosArquitectos,
}: CalculoFDUProps) {
  return (
    <>
      {mostrarFdu && (
        <section className="fdu-section">
          <h5>FDU (Carga por Tramos)</h5>
          <div className="table-responsive">
            <table className="table fdu-table">
              <thead>
                <tr>
                  <th>Metros cuadrados (m²)</th>
                  <th>FDU</th>
                </tr>
              </thead>
              <tbody>
                {FDU_TRAMOS.map(({ clave, etiqueta }) => (
                  <tr key={clave}>
                    <td>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        aria-label={etiqueta}
                        value={fdu[clave]}
                        onChange={(e) =>
                          setFdu({
                            ...fdu,
                            [clave]: e.target.value,
                          })
                        }
                      />
                    </td>
                    <td>{etiqueta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <span className="text-muted fst-italic">
            Fórmula: <strong>SUP × (FDU%) × (valor m² categoría × UT).</strong>{" "}
            Ej.: 1950 × 4% × 110000 = $ 8.580.000,00
          </span>
          <section className="fdu-btns">
            <button type="button" className="fdu-sbmt" onClick={onSoloFdu}>
              <CalculatorIcon size={18} className="btn-icon" />
              Calcular Solo FDU
            </button>
            <button
              type="button"
              className="limpiar-btn"
              onClick={() => setMostrarFdu((v) => !v)}
            >
              <XCircleIcon size={18} />
              Cancelar
            </button>
            <button
              type="button"
              className="limpiar-btn"
              onClick={() => {
                setFdu(FDU_INICIAL);
                setResultados((prev) => {
                  if (!prev) return null;
                  // Recalcular resultados sin FDU
                  const resultadoSinFdu = onCalcularTotal(
                    obras.map((o) => ({
                      id: o.id,
                      metros_cuadrados: aNumero(o.metros_cuadrados),
                      estado: aNumero(o.estado),
                    })),
                    { sup_4: 0, sup_8: 0, sup_12: 0 },
                    utMuni,
                    {
                      colegioArquitectos: totalVisadosArquitectos || 0,
                      honorarios: Number(costos.honorarios) || 0,
                      bomberos: Number(costos.bomberos) || 0,
                    },
                  );
                  setTimeout(() => {
                    const resultadosSection =
                      document.getElementById("resultado-general");
                    resultadosSection?.scrollIntoView({
                      behavior: "smooth",
                    });
                  }, 100);
                  return resultadoSinFdu;
                });
              }}
            >
              <TrashIcon size={18} />
              Limpiar FDU
            </button>
          </section>
        </section>
      )}

      <section className="fdu-toggle-section">
        <article>
          <span className="fw-bold">
            ¿Tu obra supera los 9 m²? Calculá el FDU
          </span>
          <span className="text-muted fst-italic">
            Lo podes sumar al Total General o verlo por separado
          </span>
        </article>
        <button
          type="button"
          onClick={() => setMostrarFdu((v) => !v)}
          className="fdu-toggle-btn"
          aria-expanded={mostrarFdu}
        >
          {mostrarFdu ? "Quitar FDU" : "Agregar FDU"}
        </button>
      </section>
    </>
  );
}
