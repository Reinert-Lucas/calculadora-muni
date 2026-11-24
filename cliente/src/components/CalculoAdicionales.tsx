import {
  CalculatorIcon,
  ClipboardCheckIcon,
  PlusCircleIcon,
  TrashIcon,
} from "lucide-react";
import { VISADOS_INICIAL, type CalculoAdicionalesProps } from "../utils/types";
import { etiquetaTramo, VISADOS } from "../constants/impuestos";
import { formatoMoneda } from "../utils/formato";

export default function CalculoAdicionales({
  setMostrarColegios,
  setVisados,
  setCostos,
  setResultadosVisados,
  setMostrarHonorarios,
  onSoloVisados,
  mostrarHonorarios,
  mostrarColegios,
  costos,
  utCapm,
  visados,
}: CalculoAdicionalesProps) {
  return (
    <>
      <section>
        <h4 className="adicionales-title">
          <ClipboardCheckIcon />
          Costos Adicionales
        </h4>
        <p className="text-muted fst-italic">
          Agregar costo de: Visados y Honorarios
        </p>
        <section className="adicionales-btns-section">
          <button
            type="button"
            onClick={() => {
              setMostrarColegios((visible) => {
                if (visible) {
                  setVisados(VISADOS_INICIAL);
                  setResultadosVisados(null);
                }
                return !visible;
              });
            }}
            className={`adicionales-toggle-btn-${mostrarColegios ? "ocultar" : "mostrar"}`}
            aria-expanded={mostrarColegios}
          >
            {mostrarColegios ? <TrashIcon /> : <PlusCircleIcon />}
            {mostrarColegios ? "Quitar Visados" : "Agregar Visados"}
          </button>
          <button
            type="button"
            onClick={() => {
              setMostrarHonorarios((visible) => {
                if (visible) {
                  setCostos((prev) => ({
                    ...prev,
                    honorarios: "",
                  }));
                }
                return !visible;
              });
            }}
            className={`adicionales-toggle-btn-${mostrarHonorarios ? "ocultar" : "mostrar"}`}
            aria-expanded={mostrarHonorarios}
          >
            {mostrarHonorarios ? <TrashIcon /> : <PlusCircleIcon />}
            {mostrarHonorarios ? "Quitar Honorarios" : "Agregar Honorarios"}
          </button>
        </section>
      </section>
      <hr />
      {mostrarColegios ? (
        <>
          <section className="colegios-section">
            <h4>Visados</h4>
            <h5>Colegio de Arquitectos de la Provincia de Misiones</h5>
            <p className="text-muted fst-italic">
              Fórmula:{" "}
              <strong>Factor × UT de Visados: {formatoMoneda(utCapm)}</strong>
            </p>

            {VISADOS.map((v) => (
              <div key={v.clave}>
                <label htmlFor={`visado-${v.clave}`}>
                  {v.nombre} (cantidad de {v.unidad})
                </label>
                <select
                  id={`visado-${v.clave}`}
                  value={visados[v.clave]}
                  onChange={(e) =>
                    setVisados({
                      ...visados,
                      [v.clave]: e.target.value,
                    })
                  }
                >
                  <option value="">Seleccionar...</option>
                  {v.tramos.map((t, i) => (
                    <option key={i} value={i} disabled={t.factor === null}>
                      {etiquetaTramo(t)}{" "}
                      {t.factor === null ? "— sin factor definido" : ""}
                    </option>
                  ))}
                </select>
              </div>
            ))}
            <span className="text-muted fst-italic d-block mt-2">
              Se suma al Total General al presionar "Calcular total", o podés
              verlo por separado.
            </span>
            <button
              type="button"
              className="fdu-sbmt mt-2"
              onClick={onSoloVisados}
            >
              <CalculatorIcon size={18} className="btn-icon" />
              Calcular Solo Visados
            </button>
          </section>
          <hr />
        </>
      ) : null}
      {mostrarHonorarios ? (
        <>
          <section className="honorarios-section">
            <h5>Honorarios del Profesional a Cargo</h5>
            <label htmlFor="honorarios">Honorarios</label>
            <input
              id="honorarios"
              type="number"
              min="0"
              step="any"
              inputMode="decimal"
              placeholder="$000,00"
              value={costos.honorarios}
              onChange={(e) =>
                setCostos({
                  ...costos,
                  honorarios: e.target.value,
                })
              }
            />
          </section>
          <hr />
        </>
      ) : null}
      <button type="submit" className="sbmt-btn fs-3">
        <CalculatorIcon size={28} className="btn-icon" />
        Calcular total
      </button>
    </>
  );
}
