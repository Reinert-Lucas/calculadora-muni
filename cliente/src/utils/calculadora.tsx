import { VALOR_UT, TRAMOS, FDU_TRAMOS, categorias } from "../constants/impuestos";
import type { Obra, FDU, Resultado } from "./types";

// Fórmula base: (m2 * coef * UT * %estado) / 100
// Fórmula FDU:  sup * %FDU * (coef * UT)

export class ErrorCalculo extends Error { }

const redondear = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

export function obtenerTramo(m2: number) {
  return TRAMOS.find((t) => t.contiene(m2)) ?? TRAMOS[TRAMOS.length - 1];
}

function validar(obras: Obra[], fdu: FDU, totalM2: number) {
  if (obras.length === 0) throw new ErrorCalculo("Cargá al menos una obra.");

  for (const [i, obra] of obras.entries()) {
    if (!Number.isFinite(obra.metros_cuadrados) || obra.metros_cuadrados <= 0)
      throw new ErrorCalculo(`Obra ${i + 1}: ingresá una superficie mayor a 0.`);
    if (!Number.isInteger(obra.estado) || !categorias[obra.estado])
      throw new ErrorCalculo(`Obra ${i + 1}: seleccioná un estado de obra.`);
  }

  const supFdu = Object.values(fdu);
  if (supFdu.some((s) => !Number.isFinite(s) || s < 0))
    throw new ErrorCalculo("Las superficies FDU deben ser números positivos.");
  if (supFdu.reduce((a, b) => a + b, 0) > totalM2)
    throw new ErrorCalculo(
      "La suma de las superficies FDU no puede exceder el total de metros cuadrados.",
    );
}

export function calcularTotal(obras: Obra[], fdu: FDU): Resultado {
  const totalM2 = obras.reduce((acc, o) => acc + o.metros_cuadrados, 0);
  validar(obras, fdu, totalM2);

  // El coeficiente de las obras depende del total de m2 de todas ellas
  const tramo = obtenerTramo(totalM2);
  const monto = tramo.coef * VALOR_UT;

  const EstadoObras = obras.map((obra) => {
    const { nombre, porcentaje } = categorias[obra.estado];
    const subtotal = obra.metros_cuadrados * monto;
    return {
      id: obra.id,
      superficie: obra.metros_cuadrados,
      categoria: tramo.etiqueta,
      estado: nombre,
      valorM2: tramo.coef,
      ut: VALOR_UT,
      monto,
      subtotal,
      porcentaje,
      importe: redondear((subtotal * porcentaje) / 100),
    };
  });

  // En FDU cada tramo calcula su coeficiente con su propia superficie
  const ResultadosFDU = FDU_TRAMOS.map(({ clave, porcentaje, etiqueta }) => {
    const superficie = fdu[clave];
    const t = obtenerTramo(superficie);
    const valorMxUt = superficie > 0 ? t.coef * VALOR_UT : 0;
    return {
      clave,
      superficie,
      fdu: etiqueta,
      categoria: t.etiqueta,
      valorMxUt,
      subtotal: redondear(superficie * porcentaje * valorMxUt),
    };
  });

  const TotalBase = redondear(EstadoObras.reduce((a, o) => a + o.importe, 0));
  const TotalFDU = redondear(ResultadosFDU.reduce((a, f) => a + f.subtotal, 0));

  return {
    TotalGeneral: redondear(TotalBase + TotalFDU),
    TotalBase,
    TotalFDU,
    TotalM2: totalM2,
    CategoriaDeterminada: tramo.etiqueta,
    EstadoObras,
    ResultadosFDU,
  };
}