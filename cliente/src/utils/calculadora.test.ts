import { describe, it, expect } from "vitest";
import { calcularTotal, ErrorCalculo } from "./calculadora";
import { calcularVisados } from "./calculadora";

const fduVacio = { sup_4: 0, sup_8: 0, sup_12: 0 };

describe("calcularTotal", () => {
    it("obra nueva de 100 m2: 100 * (100*1430) * 0,5%", () => {
        const r = calcularTotal(
            [{ id: 1, metros_cuadrados: 100, estado: 0 }],
            fduVacio,
        );
        expect(r.TotalGeneral).toBe(71500);
    });

    it("suma FDU 4%: 20 * 0,04 * (50*1430)", () => {
        const r = calcularTotal([{ id: 1, metros_cuadrados: 100, estado: 0 }], {
            ...fduVacio,
            sup_4: 20,
        });
        expect(r.TotalFDU).toBe(57200);
        expect(r.TotalGeneral).toBe(128700);
    });

    it("suma los costos de colegios y honorarios al total general", () => {
        const r = calcularTotal(
            [{ id: 1, metros_cuadrados: 100, estado: 0 }],
            fduVacio,
            {
                colegio1: 1000,
                colegio2: 2000,
                honorarios: 3000,
                bomberos: 4000,
            },
        );
        expect(r.TotalAdicionales).toBe(6000);
        expect(r.TotalGeneral).toBe(77500);
    });

    it("límites de tramo: 60 -> coef 50, 150 -> coef 150", () => {
        expect(
            calcularTotal(
                [{ id: 1, metros_cuadrados: 60, estado: 0 }],
                fduVacio,
            ).EstadoObras[0].valorM2,
        ).toBe(50);
        expect(
            calcularTotal(
                [{ id: 1, metros_cuadrados: 150, estado: 0 }],
                fduVacio,
            ).EstadoObras[0].valorM2,
        ).toBe(150);
    });

    it("rechaza estado inválido, m2 <= 0 y FDU mayor al total", () => {
        expect(() =>
            calcularTotal(
                [{ id: 1, metros_cuadrados: 10, estado: NaN }],
                fduVacio,
            ),
        ).toThrow(ErrorCalculo);
        expect(() =>
            calcularTotal(
                [{ id: 1, metros_cuadrados: 0, estado: 0 }],
                fduVacio,
            ),
        ).toThrow(ErrorCalculo);
        expect(() =>
            calcularTotal([{ id: 1, metros_cuadrados: 10, estado: 0 }], {
                ...fduVacio,
                sup_4: 20,
            }),
        ).toThrow(ErrorCalculo);
    });
});
describe("calcularVisados", () => {
    const vacio = { electrica: "", gas: "", salubridad: "", ascensores: "" };

    it("eléctrica 0-50 (factor 10) x UT x estado 1", () => {
        const r = calcularVisados({ ...vacio, electrica: "0" }, "0");
        expect(r.TotalVisados).toBe(10 * 1430);
    });

    it("suma varias instalaciones: gas 5-25 (22) + ascensores 10+ (65), estado 0,8", () => {
        const r = calcularVisados({ ...vacio, gas: "1", ascensores: "3" }, "1");
        expect(r.TotalVisados).toBeCloseTo((22 + 65) * 1430 * 0.8, 2);
    });

    it("rechaza sin selección, sin estado y tramo sin factor", () => {
        expect(() => calcularVisados(vacio, "0")).toThrow(ErrorCalculo);
        expect(() => calcularVisados({ ...vacio, gas: "0" }, "")).toThrow(
            ErrorCalculo,
        );
        expect(() =>
            calcularVisados({ ...vacio, electrica: "8" }, "0"),
        ).toThrow(ErrorCalculo);
    });
});
