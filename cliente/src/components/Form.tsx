import "../css/calculadora.css";
import { useRef, useState, type FormEvent } from "react";
import { calcularTotal, ErrorCalculo, calcularSoloFDU } from "../utils/calculadora";
import { categorias, FDU_TRAMOS } from "../constants/impuestos";
import { Layers2Icon, CalculatorIcon, PlusCircleIcon, EraserIcon, TrashIcon, XCircleIcon, Info } from "lucide-react";
import ResultadosDetalle from "./ResultadosDetalle";
import ResultadosFDUDetalle from "./ResultadosFDUDetalle";
import type { ResultadoSoloFDU, Resultado } from "../utils/types";

// Estado del formulario: todo string porque viene de inputs
type ObraForm = { id: number; metros_cuadrados: string; estado: string };

const FDU_INICIAL = { sup_4: "", sup_8: "", sup_12: "" };
const COSTOS_INICIALES = { colegio1: "", colegio2: "", honorarios: "", bomberos: "" };

// "" -> NaN (y no 0), para que la validación detecte campos vacíos
const aNumero = (v: string) => (v.trim() === "" ? NaN : Number(v));

function Form() {
  const siguienteId = useRef(2);
  const [obras, setObras] = useState<ObraForm[]>([
    { id: 1, metros_cuadrados: "", estado: "" },
  ]);
  const [fdu, setFdu] = useState(FDU_INICIAL);
  const [costos, setCostos] = useState(COSTOS_INICIALES);
  const [mostrarFdu, setMostrarFdu] = useState(false);
  const [resultados, setResultados] = useState<Resultado | null>(null);
  const [resultadosFDU, setResultadosFDU] = useState<ResultadoSoloFDU | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [catMsg, setCatMsg] = useState<string | null>(null);

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
    setCostos(COSTOS_INICIALES);
    setMostrarFdu(false);
    setResultados(null);
    setResultadosFDU(null)
    setError(null);
    setCatMsg(null)
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setResultadosFDU(null)
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
        {
          colegio1: Number(costos.colegio1) || 0,
          colegio2: Number(costos.colegio2) || 0,
          honorarios: Number(costos.honorarios) || 0,
          bomberos: Number(costos.bomberos) || 0,
        },
      );
      setResultados(resultado);
      setCatMsg(`Categoría general detectada: ${resultado.CategoriaDeterminada} — Valor m²: ${resultado.Coeficiente},00 — Total m²: ${resultado.TotalM2}`);
      setError(null);
    } catch (err) {
      setResultados(null);
      setError(err instanceof ErrorCalculo ? err.message : "Ocurrió un error inesperado.");
    }
    // Scrollear automáticamente a los resultados
    setTimeout(() => {
      const resultadosSection = document.getElementById("resultado-general");
      resultadosSection?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }

  function soloFDU() {
    try {
      setResultados(null)
      const resultadosFDU = calcularSoloFDU({
        // Si el panel FDU está oculto, no se suma
        sup_4: mostrarFdu ? Number(fdu.sup_4) || 0 : 0,
        sup_8: mostrarFdu ? Number(fdu.sup_8) || 0 : 0,
        sup_12: mostrarFdu ? Number(fdu.sup_12) || 0 : 0,
      });

      setResultadosFDU(resultadosFDU);
    } catch (err) {
      setError(err instanceof ErrorCalculo ? err.message : "Ocurrió un error inesperado.");
    }
    // Scrollear automáticamente a los resultados
    setTimeout(() => {
      const resultadosSection = document.getElementById("resultado-general");
      resultadosSection?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="formulario-obras" noValidate>
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
            {catMsg && (
              <span className="text-info"> <Info size={18} /> {catMsg}</span>
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
            <CalculatorIcon size={18} className="btn-icon" />
            Calcular total
          </button>
          <button type="button" onClick={agregarSeccion} className="agregar-seccion-btn">
            <PlusCircleIcon size={18} className="btn-icon" />
            Cargar m2 con otro estado
          </button>
          <button type="button" className="limpiar-btn" onClick={limpiarTodo}>
            <EraserIcon size={18} />
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
              Fórmula: <strong>SUP × (FDU%) × (valor m² categoría × UT).</strong> Ej.: 1950 × 4% × 110000 = $ 8.580.000,00
            </span>
            <section className="fdu-btns">
              <button type="button" className="fdu-sbmt" onClick={soloFDU}>
                <CalculatorIcon size={18} className="btn-icon" />
                Calcular Solo FDU
              </button>
              <button type="button" className="limpiar-btn" onClick={() => setMostrarFdu((v) => !v)}>
                <XCircleIcon size={18} />
                Cancelar
              </button>
              <button type="button" className="limpiar-btn" onClick={() => {
                setFdu(FDU_INICIAL)
                setResultados((prev) => {
                  if (!prev) return null;
                  // Recalcular resultados sin FDU
                  const resultadoSinFdu = calcularTotal(
                    obras.map((o) => ({
                      id: o.id,
                      metros_cuadrados: aNumero(o.metros_cuadrados),
                      estado: aNumero(o.estado),
                    })),
                    { sup_4: 0, sup_8: 0, sup_12: 0 },
                    {
                      colegio1: Number(costos.colegio1) || 0,
                      colegio2: Number(costos.colegio2) || 0,
                      honorarios: Number(costos.honorarios) || 0,
                      bomberos: Number(costos.bomberos) || 0,
                    },
                  );
                  setTimeout(() => {
                    const resultadosSection = document.getElementById("resultado-general");
                    resultadosSection?.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                  return resultadoSinFdu;
                });
              }}>
                <TrashIcon size={18} />
                Limpiar FDU
              </button>
            </section>
          </section>
        )}

        <section className="fdu-toggle-section">
          <article>
            <span className="fw-bold">¿Tu obra supera los 9 m²? Calculá el FDU</span>
            <span className="text-muted fst-italic">Lo podes sumar al Total General o verlo por separado</span>
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
        <hr />
        <section className="colegios-section">
          <h5>
            Visado de Instalaciones Complementarias
          </h5>
          <label htmlFor="colegio-1-prc">Consejo de Ingeniería</label>
          <input
            id="colegio-1-prc"
            type="number"
            min="0"
            step="any"
            inputMode="decimal"
            placeholder="$000,00"
            value={costos.colegio1}
            onChange={(e) => setCostos({ ...costos, colegio1: e.target.value })}
          />
          <label htmlFor="colegio-2-prc">Colegio de Arquitectos de la Provincia de Misiones</label>
          <input
            id="colegio-2-prc"
            type="number"
            min="0"
            step="any"
            inputMode="decimal"
            placeholder="$000,00"
            value={costos.colegio2}
            onChange={(e) => setCostos({ ...costos, colegio2: e.target.value })}
          />
        </section>
        <hr />
        <section className="bomberos-section">
          <h5>
            Bomberos
          </h5>
          <label htmlFor="bomberos">Costo del Tramite</label>
          <input
            id="bomberos"
            type="number"
            min="0"
            step="any"
            inputMode="decimal"
            placeholder="$000,00"
            value={costos.bomberos}
            onChange={(e) => setCostos({ ...costos, bomberos: e.target.value })}
          />
        </section>
        <hr />
        <section className="honorarios-section">
          <h5>
            Honorarios del Profesional a Cargo
          </h5>
          <label htmlFor="honorarios">Honorarios</label>
          <input
            id="honorarios"
            type="number"
            min="0"
            step="any"
            inputMode="decimal"
            placeholder="$000,00"
            value={costos.honorarios}
            onChange={(e) => setCostos({ ...costos, honorarios: e.target.value })}
          />
        </section>
      </form>
      {resultados && <ResultadosDetalle resultados={resultados} />}
      {resultadosFDU && <ResultadosFDUDetalle resultados={resultadosFDU} />}
    </>
  );
}

export default Form;