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
    sup_4: "",
    sup_8: "",
    sup_12: "",
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
      <form onSubmit={handleSubmit} className="formulario-obras">
        {obras.map((obra, index) => (
          <div key={obra.id}>
            <h5>Estado de obra {index + 1}</h5>
            <label>Metros cuadrados (m²)</label>
            <input
              type="number"
              placeholder="Metros cuadrados"
              value={obra.metros_cuadrados}
              onChange={(e) =>
                handleChange(index, "metros_cuadrados", e.target.value)
              }
            />
            <label>Estado de obra</label>
            <select
              value={obra.estado}
              onChange={(e) => handleChange(index, "estado", e.target.value)}
            >
              <option value="" disabled>
                Seleccione un estado de obra
              </option>
              <option value="0">Obra Nueva (0.5%)</option>
              <option value="1">
                Acorde al codigo - exist. sin permiso en construccion (1%)
              </option>
              <option value="2">
                Acorde al codigo - exist. sin permiso en concluido (2%)
              </option>
              <option value="3">Antirreg. - concluida detectada (6%)</option>
              <option value="4">Antirreg. - pv de obra concluida (5%)</option>
              <option value="5">
                Cuerpo cerrado sobre linea municipal (9%)
              </option>
              <option value="6">Balcones (6%)</option>
              <option value="7">Marquesinas y/o aleros (4%)</option>
            </select>
            <hr />
          </div>
        ))}
        <section className="botones-section">
          <button type="submit">Calcular total</button>
          <button
            type="button"
            onClick={agregarSeccion}
            className="agregar-seccion-btn"
          >
            Cargar m2 con otro estado
          </button>
        </section>
        {isVisible && (
          <section className="fdu-section">
            <h5>FDU (Carga por Tramos)</h5>
            <table className="table fdu-table">
              <thead>
                <tr>
                  <th>Metros cuadrados (m²)</th>
                  <th>FDU</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <input
                      type="number"
                      value={fdu.sup_4}
                      onChange={(e) =>
                        setFdu({ ...fdu, sup_4: e.target.value })
                      }
                    />
                  </td>
                  <td>Sup. entre 9,01 y 18,00 - FDU: 4% </td>
                </tr>
                <tr>
                  <td>
                    <input
                      type="number"
                      value={fdu.sup_8}
                      onChange={(e) =>
                        setFdu({ ...fdu, sup_8: e.target.value })
                      }
                    />
                  </td>
                  <td>Sup. entre 18,01 y 30,00 - FDU: 8% </td>
                </tr>
                <tr>
                  <td>
                    <input
                      type="number"
                      value={fdu.sup_12}
                      onChange={(e) =>
                        setFdu({ ...fdu, sup_12: e.target.value })
                      }
                    />
                  </td>
                  <td>Sup. sobre 30,00 - FDU: 12% </td>
                </tr>
              </tbody>
            </table>
            <span className="text-muted fst-italic">
              Fórmula: <strong>SUP × (FDU%) × (valor m² categoría × UT)</strong>
              . Ej.: 1950 × 4% × 110000 = $ 8.580.000,00{" "}
            </span>
          </section>
        )}
        <section className="fdu-toggle-section">
          <article>
            <span className="fw-bold">
              ¿Tu obra supera los 9 m? Calculá el FDU
            </span>
            <span className="text-muted fst-italic">
              Podés sumarlo al Total General.
            </span>
          </article>
          <button
            type="button"
            onClick={() => setIsVisible(!isVisible)}
            className="fdu-toggle-btn"
          >
            Agregar FDU
          </button>
        </section>
      </form>
      {Resultados && <ResultadosDetalle resultados={Resultados} />}
    </>
  );
}

export default Form;
