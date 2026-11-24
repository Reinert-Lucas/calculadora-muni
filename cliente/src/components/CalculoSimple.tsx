import type { CalculoSimpleProps } from "../utils/types";
import { categorias } from "../constants/impuestos";
import {
  EraserIcon,
  Info,
  Layers2Icon,
  PlusCircleIcon,
  TrashIcon,
} from "lucide-react";
import { useRef } from "react";

export default function CalculoSimple({
  obras,
  setObras,
  error,
  catMsg,
  onLimpiar,
}: CalculoSimpleProps) {
  const siguienteId = useRef(2);
  function handleChange(
    id: number,
    field: "metros_cuadrados" | "estado",
    value: string,
  ) {
    setObras((prev) =>
      prev.map((o) => (o.id === id ? { ...o, [field]: value } : o)),
    );
  }

  function agregarSeccion() {
    setObras((prev) => [
      ...prev,
      { id: siguienteId.current++, metros_cuadrados: "", estado: "" },
    ]);
  }

  function quitarSeccion(id: number) {
    setObras((prev) => prev.filter((o) => o.id !== id));
  }
  return (
    <>
      {obras.map((obra, index) => (
        <div key={obra.id}>
          <div className="formulario-obras-title">
            <h5>
              <Layers2Icon size={18} className="layer-icon" color="#4CAF50" />
              Estado de obra {index + 1}
            </h5>
            {obras.length > 1 && (
              <button
                type="button"
                className="quitar-seccion-btn"
                onClick={() => quitarSeccion(obra.id)}
              >
                <TrashIcon size={18} />
              </button>
            )}
          </div>
          <label htmlFor={`m2-${obra.id}`}>Metros cuadrados (m²)</label>
          <input
            id={`m2-${obra.id}`}
            type="number"
            min="0"
            step="any"
            inputMode="decimal"
            placeholder="Metros cuadrados"
            value={obra.metros_cuadrados}
            onChange={(e) =>
              handleChange(obra.id, "metros_cuadrados", e.target.value)
            }
          />
          <label htmlFor={`estado-${obra.id}`}>Estado de obra</label>
          <select
            id={`estado-${obra.id}`}
            value={obra.estado}
            onChange={(e) => handleChange(obra.id, "estado", e.target.value)}
          >
            <option value="" disabled>
              Seleccione un estado de obra
            </option>
            {categorias.map((c, i) => (
              <option key={c.nombre} value={i}>
                {c.nombre} ({c.porcentaje}%)
              </option>
            ))}
          </select>
          {catMsg && (
            <span className="text-info">
              {" "}
              <Info size={18} /> {catMsg}
            </span>
          )}
          <hr />
        </div>
      ))}

      {/* Mostrar Errores */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Botones principales */}
      <section className="botones-section">
        <button
          type="button"
          onClick={agregarSeccion}
          className="agregar-seccion-btn"
        >
          <PlusCircleIcon size={18} className="btn-icon" />
          Cargar m2 con otro estado
        </button>
        <button type="button" className="limpiar-btn" onClick={onLimpiar}>
          <EraserIcon size={18} />
          Limpiar Todo
        </button>
      </section>
    </>
  );
}
