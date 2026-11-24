import { describe, it, expect } from "vitest";
import { calcularTotal, calcularVisados, ErrorCalculo } from "./calculadora";

const fduVacio = { sup_4: 0, sup_8: 0, sup_12: 0 };
const UT_MUNI = 1430;
const UT_CAPM = 3748.5;

describe("calcularTotal", () => {
  it("usa la UT municipal recibida para calcular el total", () => {
    const r = calcularTotal(
      [{ id: 1, metros_cuadrados: 100, estado: 0 }],
      fduVacio,
      UT_MUNI,
    );
    expect(r.TotalGeneral).toBe(71500);
  });

  it("suma FDU 4%: 20 * 0,04 * (50*UT municipal)", () => {
    const r = calcularTotal(
      [{ id: 1, metros_cuadrados: 100, estado: 0 }],
      { ...fduVacio, sup_4: 20 },
      UT_MUNI,
    );
    expect(r.TotalFDU).toBe(57200);
    expect(r.TotalGeneral).toBe(128700);
  });

  it("suma los costos adicionales al total general", () => {
    const r = calcularTotal(
      [{ id: 1, metros_cuadrados: 100, estado: 0 }],
      fduVacio,
      UT_MUNI,
      {
        colegioArquitectos: 2000,
        honorarios: 3000,
        bomberos: 4000,
      },
    );
    expect(r.TotalAdicionales).toBe(9000);
    expect(r.TotalGeneral).toBe(80500);
  });

  it("mantiene los límites de los tramos", () => {
    expect(
      calcularTotal(
        [{ id: 1, metros_cuadrados: 60, estado: 0 }],
        fduVacio,
        UT_MUNI,
      ).EstadoObras[0].valorM2,
    ).toBe(50);
    expect(
      calcularTotal(
        [{ id: 1, metros_cuadrados: 150, estado: 0 }],
        fduVacio,
        UT_MUNI,
      ).EstadoObras[0].valorM2,
    ).toBe(150);
  });

  it("rechaza estado inválido, m2 <= 0 y superficies FDU negativas", () => {
    expect(() =>
      calcularTotal(
        [{ id: 1, metros_cuadrados: 10, estado: NaN }],
        fduVacio,
        UT_MUNI,
      ),
    ).toThrow(ErrorCalculo);
    expect(() =>
      calcularTotal(
        [{ id: 1, metros_cuadrados: 0, estado: 0 }],
        fduVacio,
        UT_MUNI,
      ),
    ).toThrow(ErrorCalculo);
    expect(() =>
      calcularTotal(
        [{ id: 1, metros_cuadrados: 10, estado: 0 }],
        { ...fduVacio, sup_4: -1 },
        UT_MUNI,
      ),
    ).toThrow(ErrorCalculo);
  });
});

describe("calcularVisados", () => {
  const vacio = { electrica: "", gas: "", salubridad: "", ascensores: "" };

  it("usa la UT CAPM recibida para calcular cada visado", () => {
    const r = calcularVisados({ ...vacio, electrica: "0" }, UT_CAPM);
    expect(r.TotalVisados).toBe(10 * UT_CAPM);
  });

  it("suma varias instalaciones con la UT CAPM", () => {
    const r = calcularVisados(
      { ...vacio, gas: "1", ascensores: "3" },
      UT_CAPM,
    );
    expect(r.TotalVisados).toBeCloseTo((22 + 65) * UT_CAPM, 2);
  });

  it("rechaza sin selección o tramos sin factor definido", () => {
    expect(() => calcularVisados(vacio, UT_CAPM)).toThrow(ErrorCalculo);
    expect(() =>
      calcularVisados({ ...vacio, electrica: "10" }, UT_CAPM),
    ).toThrow(ErrorCalculo);
  });
});
