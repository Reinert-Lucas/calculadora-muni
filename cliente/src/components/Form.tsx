import "../css/calculadora.css";
import { useState, type FormEvent } from "react";
import { Calculadora } from "../utils/calculadora";
import ResultadosDetalle from "./ResultadosDetalle";
import type { Resultado } from "../utils/types";

type Obra = {
  id: number;
  metros_cuadrados: string;
  estado: string;
};

function Form() {
  const calculadora = new Calculadora();
  // Array de obras
  const [count, SetCount] = useState(1);
  const [obras, setObras] = useState<Obra[]>([
    {
      id: count,
      metros_cuadrados: "",
      estado: "",
    },
  ]);
  const [Resultados, setResultados] = useState<Resultado | null>(null);
  const [fdu, setFdu] = useState({
    sup_4: 0,
    sup_8: 0,
    sup_12: 0,
  });
  const [isVisible, setIsVisible] = useState(false);
  // Añadir nueva obra al Array
  function handleChange(
    index: number,
    field: "metros_cuadrados" | "estado",
    value: string,
  ) {
    setObras((prev) =>
      prev.map((obra, i) =>
        i === index
          ? {
              ...obra,
              [field]: value,
            }
          : obra,
      ),
    );
  }
  function agregarSeccion() {
    setObras([
      ...obras,
      {
        id: count + 1,
        metros_cuadrados: "",
        estado: "",
      },
    ]);
    SetCount(count + 1);
  }
  // Calcular total
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const obrasParseadas = obras.map((obra) => ({
      id: obra.id,
      metros_cuadrados: Number(obra.metros_cuadrados),
      estado: Number(obra.estado),
    }));
    setResultados(
      calculadora.calcularTotal(obrasParseadas, {
        sup_4: Number(fdu.sup_4),
        sup_8: Number(fdu.sup_8),
        sup_12: Number(fdu.sup_12),
      }),
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        {obras.map((obra, index) => (
          <div key={obra.id}>
            <h3>Estado de obra {index + 1}</h3>
            <input
              type="number"
              placeholder="Metros cuadrados"
              value={obra.metros_cuadrados}
              onChange={(e) =>
                handleChange(index, "metros_cuadrados", e.target.value)
              }
            />
            <select
              value={obra.estado}
              onChange={(e) => handleChange(index, "estado", e.target.value)}
            >
              <option value="" disabled>
                Seleccione un estado
              </option>
              <option value="0.5">Estado 1 - 0.5%</option>
              <option value="1">Estado 2 - 1%</option>
            </select>
            <br />
            <br />
          </div>
        ))}
        <button type="submit">Calcular total</button>
        <br />
        <br />
        <button type="button" onClick={agregarSeccion}>
          Cargar m2 con otro estado
        </button>
        <br />
        <br />
        {isVisible && (
          <section className="fdu-section">
            <h3>FDU</h3>
            <input
              type="number"
              placeholder="Sup. entre 9,01 y 18,00 - FDU: 4%"
              value={fdu.sup_4}
              onChange={(e) =>
                setFdu({ ...fdu, sup_4: Number(e.target.value) })
              }
            />
            <input
              type="number"
              placeholder="Sup. entre 18,01 y 30,00 - FDU: 8%"
              value={fdu.sup_8}
              onChange={(e) =>
                setFdu({ ...fdu, sup_8: Number(e.target.value) })
              }
            />
            <input
              type="number"
              placeholder="Sup. sobre 30,00 - FDU: 12%"
              value={fdu.sup_12}
              onChange={(e) =>
                setFdu({ ...fdu, sup_12: Number(e.target.value) })
              }
            />
          </section>
        )}
        <button type="button" onClick={() => setIsVisible(!isVisible)}>
          Agregar FDU
        </button>
      </form>
      {Resultados && <ResultadosDetalle resultados={Resultados} />}
    </>
  );
}

export default Form;
