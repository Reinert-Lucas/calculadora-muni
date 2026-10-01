import "../css/calculadora.css";
import { useRef, useState, type FormEvent } from "react";
import { calcularTotal, ErrorCalculo } from "../utils/calculadora";
import { categorias, FDU_TRAMOS } from "../constants/impuestos";
import ResultadosDetalle from "./ResultadosDetalle";
import type { Resultado } from "../utils/types";
import LayerIcon from "../imgs/layer-icon.png";
import CalculadoraIcon from "../imgs/calculadora-icon.png";
import AddIcon from "../imgs/add-icon.png";
import BorrarIcon from "../imgs/borrar-icon.png";

// Estado del formulario: todo string porque viene de inputs
type ObraForm = { id: number; metros_cuadrados: string; estado: string };

const FDU_INICIAL = { sup_4: "", sup_8: "", sup_12: "" };

// "" -> NaN (y no 0), para que la validación detecte campos vacíos
const aNumero = (v: string) => (v.trim() === "" ? NaN : Number(v));

function Form() {
  const siguienteId = useRef(2);
  const [obras, setObras] = useState<ObraForm[]>([
    { id: 1, metros_cuadrados: "", estado: "" },
  ]);
  const [fdu, setFdu] = useState(FDU_INICIAL);
  const [mostrarFdu, setMostrarFdu] = useState(false);
  const [resultados, setResultados] = useState<Resultado | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleChange(id: number, field: "metros_cuadrados" | "estado", value: string) {
    setObras((prev) => prev.map((o) => (o.id === id ? { ...o, [field]: value } : o)));
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

  function limpiarTodo() {
    // Limpiar / Resetear datos de todos los campos del formulario (Incluidos los del FDU)
    setObras([
      { id: 1, metros_cuadrados: "", estado: "" },
    ]);
    setFdu(FDU_INICIAL);
    setMostrarFdu(false);
    setResultados(null);
    setError(null);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const resultado = calcularTotal(
        obras.map((o) => ({
          id: o.id,
          metros_cuadrados: aNumero(o.metros_cuadrados),
          estado: aNumero(o.estado),
        })),
        {
          // Si el panel FDU está oculto, no se suma
          sup_4: mostrarFdu ? Number(fdu.sup_4) || 0 : 0,
          sup_8: mostrarFdu ? Number(fdu.sup_8) || 0 : 0,
          sup_12: mostrarFdu ? Number(fdu.sup_12) || 0 : 0,
        },
      );
      setResultados(resultado);
      setError(null);
    } catch (err) {
      setResultados(null);
      setError(err instanceof ErrorCalculo ? err.message : "Ocurrió un error inesperado.");
    }
    // Scrollear automáticamente a los resultados si se calculó correctamente
    if (resultados) {
      setTimeout(() => {
        const resultadosSection = document.getElementById("resultado-general");
        resultadosSection?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
    // Scroll en celulares: si el teclado virtual tapa los resultados, se hace scroll para que queden visibles
    setTimeout(() => {
      const resultadosSection = document.getElementById("resultado-general");
      resultadosSection?.scrollIntoView({ behavior: "smooth" });
    }, 500);
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="formulario-obras" noValidate>
        {obras.map((obra, index) => (
          <div key={obra.id}>
            <h5>
              <img src={LayerIcon} alt="Estado de Obra" className="layer-icon" />
              Estado de obra {index + 1}
            </h5>
            <label htmlFor={`m2-${obra.id}`}>Metros cuadrados (m²)</label>
            <input
              id={`m2-${obra.id}`}
              type="number"
              min="0"
              step="any"
              inputMode="decimal"
              placeholder="Metros cuadrados"
              value={obra.metros_cuadrados}
              onChange={(e) => handleChange(obra.id, "metros_cuadrados", e.target.value)}
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
            {obras.length > 1 && (
              <button
                type="button"
                className="quitar-seccion-btn"
                onClick={() => quitarSeccion(obra.id)}
              >
                Quitar
              </button>
            )}
            <hr />
          </div>
        ))}

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <section className="botones-section">
          <button type="submit">
            <img src={CalculadoraIcon} alt="Calcular" />
            Calcular total
          </button>
          <button type="button" onClick={agregarSeccion} className="agregar-seccion-btn">
            <img src={AddIcon} alt="Añadir m2" />
            Cargar m2 con otro estado
          </button>
          <button type="button" className="limpiar-btn" onClick={limpiarTodo}>
            <img src={BorrarIcon} alt="Borrar" />
            Limpiar Todo
          </button>
        </section>

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
                          onChange={(e) => setFdu({ ...fdu, [clave]: e.target.value })}
                        />
                      </td>
                      <td>{etiqueta}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <span className="text-muted fst-italic">
              Fórmula: <strong>SUP × (FDU%) × (valor m² categoría × UT)</strong>
            </span>
          </section>
        )}

        <section className="fdu-toggle-section">
          <article>
            <span className="fw-bold">¿Tu obra supera los 9 m²? Calculá el FDU</span>
            <span className="text-muted fst-italic">Podés sumarlo al Total General.</span>
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
      </form>

      {resultados && <ResultadosDetalle resultados={resultados} />}
    </>
  );
}

export default Form;