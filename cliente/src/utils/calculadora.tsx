import {
  coef_unid_tributaria,
  valor_unid_tributaria,
  categorias,
} from "../constants/impuestos";
import type { Obra, FDU, Resultado } from "./types";

// Formula: (m2 * coeficiente * valor_unid_tributaria * estado) / 100
// Formula FDU: (sup * FDU * (coeficiente * valor_unid_tributaria)

export class Calculadora {
  private obtenerCoeficiente(total_m2: number): number {
    switch (true) {
      case total_m2 <= 60:
        return coef_unid_tributaria[0];
      case total_m2 > 60 && total_m2 < 150:
        return coef_unid_tributaria[1];
      case total_m2 >= 150 && total_m2 < 350:
        return coef_unid_tributaria[2];
      case total_m2 >= 350:
        return coef_unid_tributaria[3];
      default:
        return 0;
    }
  }
  private obtenerCoeficienteFDU(fdu: number): number {
    switch (true) {
      case fdu <= 60:
        return coef_unid_tributaria[0];
      case fdu > 60 && fdu < 150:
        return coef_unid_tributaria[1];
      case fdu >= 150 && fdu < 350:
        return coef_unid_tributaria[2];
      case fdu >= 350:
        return coef_unid_tributaria[3];
      default:
        return 0;
    }
  }

  calcularTotal(obras: Obra[], fdu: FDU): Resultado {
    const total_m2 = obras.reduce(
      (acc, obra) => acc + obra.metros_cuadrados,
      0,
    );
    const coeficiente = this.obtenerCoeficiente(total_m2);
    // IMPUESTO BASE
    const totalBase = obras.reduce((acc, obra) => {
      const subtotal =
        (obra.metros_cuadrados *
          coeficiente *
          valor_unid_tributaria *
          categorias[obra.estado].porcentaje) /
        100;
      return acc + subtotal;
    }, 0);
    // FDU
    let totalFDU = 0;
    // Calcular FDU
    totalFDU +=
      fdu.sup_4 *
      0.04 *
      (this.obtenerCoeficienteFDU(fdu.sup_4) * valor_unid_tributaria);
    totalFDU +=
      fdu.sup_8 *
      0.08 *
      (this.obtenerCoeficienteFDU(fdu.sup_8) * valor_unid_tributaria);
    totalFDU +=
      fdu.sup_12 *
      0.12 *
      (this.obtenerCoeficienteFDU(fdu.sup_12) * valor_unid_tributaria);
    if (fdu.sup_4 + fdu.sup_8 + fdu.sup_12 > total_m2) {
      throw new Error(
        "La suma de las superficies FDU no puede exceder el total de metros cuadrados de la Obra.",
      );
    }

    const Resultados: Resultado = {
      TotalGeneral: totalBase + totalFDU,
      TotalM2: total_m2,
      CategoriaDeterminada: `Entre ${total_m2 <= 60 ? "1 y 60" : total_m2 > 60 && total_m2 < 150 ? "60 y 150" : total_m2 >= 150 && total_m2 < 350 ? "150 y 350" : "350 y más"} m2`,
      EstadoObras: obras.map((obra) => ({
        id: obra.id,
        superficie: obra.metros_cuadrados,
        categoria: `Entre ${total_m2 <= 60 ? "1 y 60" : total_m2 > 60 && total_m2 < 150 ? "60 y 150" : total_m2 >= 150 && total_m2 < 350 ? "150 y 350" : "350 y más"} m2`,
        estado: categorias[obra.estado].nombre,
        DatosCategoria: {
          valor_m2: coeficiente,
          UT: valor_unid_tributaria,
          Monto: coeficiente * valor_unid_tributaria,
          Subtotal: obra.metros_cuadrados * coeficiente * valor_unid_tributaria,
          PorcentajeAplicado:
            (obra.metros_cuadrados *
              coeficiente *
              valor_unid_tributaria *
              categorias[obra.estado].porcentaje) /
            100,
        },
      })),
      ResultadosFDU: {
        sup_4: {
          valor_m2: fdu.sup_4,
          fdu: "Sup. entre 9,01 y 18,00 - (4%)",
          categoria: `Entre ${fdu.sup_4 <= 60 ? "1 y 60" : fdu.sup_4 > 60 && fdu.sup_4 < 150 ? "60 y 150" : fdu.sup_4 >= 150 && fdu.sup_4 < 350 ? "150 y 350" : "350 y más"} m2`,
          valorMxUt:
            fdu.sup_4 != 0
              ? this.obtenerCoeficienteFDU(fdu.sup_4) * valor_unid_tributaria
              : 0,
          subtotal:
            fdu.sup_4 *
            0.04 *
            (this.obtenerCoeficienteFDU(fdu.sup_4) * valor_unid_tributaria),
        },
        sup_8: {
          valor_m2: fdu.sup_8,
          fdu: "Sup. entre 18,01 y 30,00 - (8%) ",
          categoria: `Entre ${fdu.sup_8 <= 60 ? "1 y 60" : fdu.sup_8 > 60 && fdu.sup_8 < 150 ? "60 y 150" : fdu.sup_8 >= 150 && fdu.sup_8 < 350 ? "150 y 350" : "350 y más"} m2`,
          valorMxUt:
            fdu.sup_8 != 0
              ? this.obtenerCoeficienteFDU(fdu.sup_8) * valor_unid_tributaria
              : 0,
          subtotal:
            fdu.sup_8 *
            0.08 *
            (this.obtenerCoeficienteFDU(fdu.sup_8) * valor_unid_tributaria),
        },
        sup_12: {
          valor_m2: fdu.sup_12,
          fdu: "Sup. sobre 30,00 - (12%)",
          categoria: `Entre ${fdu.sup_12 <= 60 ? "1 y 60" : fdu.sup_12 > 60 && fdu.sup_12 < 150 ? "60 y 150" : fdu.sup_12 >= 150 && fdu.sup_12 < 350 ? "150 y 350" : "350 y más"} m2`,
          valorMxUt:
            fdu.sup_12 != 0
              ? this.obtenerCoeficienteFDU(fdu.sup_12) * valor_unid_tributaria
              : 0,
          subtotal:
            fdu &&
            fdu.sup_12 *
            0.12 *
            (this.obtenerCoeficienteFDU(fdu.sup_12) * valor_unid_tributaria),
        },
      },
    };
    return Resultados;
  }
}
