import "../css/calculadora.css";
import { useState, type FormEvent } from "react";
import ResultadosDetalle from "./ResultadosDetalle";
import ResultadosFDUDetalle from "./ResultadosFDUDetalle";
import {
  calcularTotal,
  ErrorCalculo,
  calcularSoloFDU,
  calcularVisados,
} from "../utils/calculadora";
import {
  type ResultadoSoloFDU,
  type Resultado,
  type ResultadoVisados,
  type ObraForm,
  FDU_INICIAL,
  aNumero,
  VISADOS_INICIAL,
} from "../utils/types";
import ResultadosVisadosDetalle from "./ResultadosVisadosDetalle";
import CalculoSimple from "./CalculoSimple";
import CalculoFDU from "./CalculoFDU";
import CalculoAdicionales from "./CalculoAdicionales";

const COSTOS_INICIALES = {
  honorarios: "",
};

function Form({ utMuni, utCapm }: { utMuni: number; utCapm: number }) {
  const [obras, setObras] = useState<ObraForm[]>([
    { id: 1, metros_cuadrados: "", estado: "" },
  ]);
  const [fdu, setFdu] = useState(FDU_INICIAL);
  const [costos, setCostos] = useState(COSTOS_INICIALES);
  const [mostrarFdu, setMostrarFdu] = useState(false);
  const [mostrarColegios, setMostrarColegios] = useState(false);
  const [mostrarHonorarios, setMostrarHonorarios] = useState(false);
  const [resultados, setResultados] = useState<Resultado | null>(null);
  const [resultadosFDU, setResultadosFDU] = useState<ResultadoSoloFDU | null>(
    null,
  );
  const [visados, setVisados] = useState(VISADOS_INICIAL);
  const [resultadosVisados, setResultadosVisados] =
    useState<ResultadoVisados | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [catMsg, setCatMsg] = useState<string | null>(null);

  // Limpiar datos de todos los campos del formulario (Incluidos los del FDU)
  function limpiarTodo() {
    setObras([{ id: 1, metros_cuadrados: "", estado: "" }]);
    setFdu(FDU_INICIAL);
    setCostos(COSTOS_INICIALES);
    setVisados(VISADOS_INICIAL);
    setMostrarFdu(false);
    setMostrarColegios(false);
    setMostrarHonorarios(false);
    setResultadosVisados(null);
    setResultados(null);
    setResultadosFDU(null);
    setError(null);
    setCatMsg(null);
  }

  // Si no se eligió ningún visado, vale 0.
  function totalVisadosArquitectos() {
    if (!mostrarColegios) return 0;
    const hayAlguno = Object.values(visados).some((v) => v !== "");
    return hayAlguno ? calcularVisados(visados, utCapm).TotalVisados : 0;
  }

  // Calcular SOLO visados (se ve por separado, como el FDU)
  function soloVisados() {
    try {
      setResultados(null);
      setResultadosFDU(null);
      setResultadosVisados(calcularVisados(visados, utCapm));
      setError(null);
    } catch (err) {
      setResultadosVisados(null);
      setError(
        err instanceof ErrorCalculo
          ? err.message
          : "Ocurrió un error inesperado.",
      );
    }
    setTimeout(() => {
      document
        .getElementById("resultado-general")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setResultadosFDU(null);
      setResultadosVisados(null);
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
        utMuni,
        {
          // Costos extra, si estan ocultos, no se suman
          colegioArquitectos: mostrarColegios ? totalVisadosArquitectos() : 0,
          honorarios: mostrarHonorarios ? Number(costos.honorarios) || 0 : 0,
        },
      );
      setResultados(resultado);
      setCatMsg(
        `Categoría general detectada: ${resultado.CategoriaDeterminada} — Valor m²: ${resultado.Coeficiente},00 — Total m²: ${resultado.TotalM2}`,
      );
      setError(null);
    } catch (err) {
      setResultados(null);
      setError(
        err instanceof ErrorCalculo
          ? err.message
          : "Ocurrió un error inesperado.",
      );
    }
    // Scrollear automáticamente a los resultados
    setTimeout(() => {
      const resultadosSection = document.getElementById("resultado-general");
      resultadosSection?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }

  // Calcular SOLO Fdu, sin ninguna obra cargada
  function soloFDU() {
    try {
      setResultados(null);
      setResultadosVisados(null);
      const resultadosFDU = calcularSoloFDU(
        {
          // Si el panel FDU está oculto, no se suma
          sup_4: mostrarFdu ? Number(fdu.sup_4) || 0 : 0,
          sup_8: mostrarFdu ? Number(fdu.sup_8) || 0 : 0,
          sup_12: mostrarFdu ? Number(fdu.sup_12) || 0 : 0,
        },
        utMuni,
      );

      setResultadosFDU(resultadosFDU);
    } catch (err) {
      setError(
        err instanceof ErrorCalculo
          ? err.message
          : "Ocurrió un error inesperado.",
      );
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
        <CalculoSimple
          obras={obras}
          setObras={setObras}
          error={error}
          catMsg={catMsg}
          onLimpiar={limpiarTodo}
        />
        <CalculoFDU
          fdu={fdu}
          setFdu={setFdu}
          utMuni={utMuni}
          mostrarFdu={mostrarFdu}
          onSoloFdu={soloFDU}
          setMostrarFdu={setMostrarFdu}
          setResultados={setResultados}
          onCalcularTotal={calcularTotal}
          costos={costos}
          obras={obras}
          totalVisadosArquitectos={totalVisadosArquitectos()}
        />
        <hr />
        <CalculoAdicionales
          costos={costos}
          mostrarColegios={mostrarColegios}
          mostrarHonorarios={mostrarHonorarios}
          onSoloVisados={soloVisados}
          setCostos={setCostos}
          setMostrarColegios={setMostrarColegios}
          setMostrarHonorarios={setMostrarHonorarios}
          setResultadosVisados={setResultadosVisados}
          setVisados={setVisados}
          utCapm={utCapm}
          visados={visados}
        />
        <hr />
      </form>
      {resultados && (
        <ResultadosDetalle resultados={resultados} utMuni={utMuni} />
      )}
      {resultadosFDU && (
        <ResultadosFDUDetalle resultados={resultadosFDU} utMuni={utMuni} />
      )}
      {resultadosVisados && (
        <ResultadosVisadosDetalle resultados={resultadosVisados} />
      )}
    </>
  );
}

export default Form;
