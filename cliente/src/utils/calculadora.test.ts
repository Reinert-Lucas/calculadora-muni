import { describe, it, expect } from "vitest";
import { calcularTotal, ErrorCalculo } from "./calculadora";

const fduVacio = { sup_4: 0, sup_8: 0, sup_12: 0 };

describe("calcularTotal", () => {
    it("obra nueva de 100 m2: 100 * (100*1430) * 0,5%", () => {
        const r = calcularTotal([{ id: 1, metros_cuadrados: 100, estado: 0 }], fduVacio);
        expect(r.TotalGeneral).toBe(71500);
    });

    it("suma FDU 4%: 20 * 0,04 * (50*1430)", () => {
        const r = calcularTotal(
            [{ id: 1, metros_cuadrados: 100, estado: 0 }],
            { ...fduVacio, sup_4: 20 },
        );
        expect(r.TotalFDU).toBe(57200);
        expect(r.TotalGeneral).toBe(128700);
    });

    it("límites de tramo: 60 -> coef 50, 150 -> coef 150", () => {
        expect(calcularTotal([{ id: 1, metros_cuadrados: 60, estado: 0 }], fduVacio).EstadoObras[0].valorM2).toBe(50);
        expect(calcularTotal([{ id: 1, metros_cuadrados: 150, estado: 0 }], fduVacio).EstadoObras[0].valorM2).toBe(150);
    });

    it("rechaza estado inválido, m2 <= 0 y FDU mayor al total", () => {
        expect(() => calcularTotal([{ id: 1, metros_cuadrados: 10, estado: NaN }], fduVacio)).toThrow(ErrorCalculo);
        expect(() => calcularTotal([{ id: 1, metros_cuadrados: 0, estado: 0 }], fduVacio)).toThrow(ErrorCalculo);
        expect(() => calcularTotal([{ id: 1, metros_cuadrados: 10, estado: 0 }], { ...fduVacio, sup_4: 20 })).toThrow(ErrorCalculo);
    });
});