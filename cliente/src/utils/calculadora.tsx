import {
  TRAMOS,
  FDU_TRAMOS,
  categorias,
  VISADOS,
  etiquetaTramo,
} from "../constants/impuestos";
import type {
  Obra,
  FDU,
  Resultado,
  CostosAdicionales,
  SeleccionVisados,
  ResultadoVisados,
} from "./types";

// Fórmula base: (m2 * coef * UT * %estado) / 100
// Fórmula FDU:  sup * %FDU * (coef * UT)

export class ErrorCalculo extends Error {}

const redondear = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

export function obtenerTramo(m2: number) {
  return TRAMOS.find((t) => t.contiene(m2)) ?? TRAMOS[TRAMOS.length - 1];
}

function validar(obras: Obra[], fdu: FDU) {
  if (obras.length === 0)
    throw new ErrorCalculo("Cargá al menos una obra o tramo de FDU.");

  for (const [i, obra] of obras.entries()) {
    if (!Number.isFinite(obra.metros_cuadrados) || obra.metros_cuadrados <= 0)
      throw new ErrorCalculo(
        `Obra ${i + 1}: ingresá una superficie mayor a 0.`,
      );
    if (!Number.isInteger(obra.estado) || !categorias[obra.estado])
      throw new ErrorCalculo(`Obra ${i + 1}: seleccioná un estado de obra.`);
  }

  const supFdu = Object.values(fdu);
  if (supFdu.some((s) => !Number.isFinite(s) || s < 0))
    throw new ErrorCalculo("Las superficies FDU deben ser números positivos.");
}

export function calcularTotal(
  obras: Obra[],
  fdu: FDU,
  utMuni: number,
  costosAdicionales: CostosAdicionales = {
    colegioArquitectos: 0,
    honorarios: 0,
  },
): Resultado {
  const totalM2 = obras.reduce((acc, o) => acc + o.metros_cuadrados, 0);
  validar(obras, fdu);

  if (
    Object.values(costosAdicionales).some(
      (costo) => !Number.isFinite(costo) || costo < 0,
    )
  )
    throw new ErrorCalculo(
      "Los costos adicionales deben ser números positivos o cero.",
    );

  // El coeficiente de las obras depende del total de m2 de todas ellas
  const tramo = obtenerTramo(totalM2);
  const monto = tramo.coef * utMuni;

  const EstadoObras = obras.map((obra) => {
    const { nombre, porcentaje } = categorias[obra.estado];
    const subtotal = obra.metros_cuadrados * monto;
    return {
      id: obra.id,
      superficie: obra.metros_cuadrados,
      categoria: tramo.etiqueta,
      estado: nombre,
      valorM2: tramo.coef,
      ut: utMuni,
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
    const valorMxUt = superficie > 0 ? t.coef * utMuni : 0;
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
  const TotalAdicionales = redondear(
    Object.values(costosAdicionales).reduce((a, costo) => a + costo, 0),
  );

  return {
    TotalGeneral: redondear(TotalBase + TotalFDU + TotalAdicionales),
    TotalBase,
    TotalFDU,
    TotalAdicionales,
    CostosAdicionales: costosAdicionales,
    TotalM2: totalM2,
    CategoriaDeterminada: tramo.etiqueta,
    EstadoObras,
    ResultadosFDU,
    Coeficiente: tramo.coef,
  };
}

// Calcular FDU sin ningun estado de obra
export function calcularSoloFDU(fdu: FDU, utMuni: number) {
  const supFdu = Object.values(fdu);
  if (supFdu.some((s) => !Number.isFinite(s) || s < 0))
    throw new ErrorCalculo("Las superficies FDU deben ser números positivos.");

  // En FDU cada tramo calcula su coeficiente con su propia superficie
  const ResultadosFDU = FDU_TRAMOS.map(({ clave, porcentaje, etiqueta }) => {
    const superficie = fdu[clave];
    const t = obtenerTramo(superficie);
    const valorMxUt = superficie > 0 ? t.coef * utMuni : 0;
    return {
      clave,
      superficie,
      fdu: etiqueta,
      categoria: t.etiqueta,
      valorMxUt,
      subtotal: redondear(superficie * porcentaje * valorMxUt),
    };
  });

  const TotalFDU = redondear(ResultadosFDU.reduce((a, f) => a + f.subtotal, 0));

  return {
    TotalFDU,
    ResultadosFDU,
  };
}

// Visados del Colegio de Arquitectos: Factor × UT_VISADO × Estado
export function calcularVisados(
  seleccion: SeleccionVisados,
  utCapm: number,
): ResultadoVisados {
  const elegidos = VISADOS.filter((v) => seleccion[v.clave] !== "");
  if (elegidos.length === 0)
    throw new ErrorCalculo(
      "Seleccioná las unidades de al menos un tipo de visado.",
    );

  const DetalleVisados = elegidos.map((v) => {
    const tramo = v.tramos[Number(seleccion[v.clave])];
    if (!tramo || tramo.factor === null)
      throw new ErrorCalculo(
        `${v.nombre}: el tramo elegido no tiene un factor definido.`,
      );
    return {
      clave: v.clave,
      nombre: v.nombre,
      unidades: etiquetaTramo(tramo),
      factor: tramo.factor,
      ut: utCapm,
      subtotal: redondear(tramo.factor * utCapm),
    };
  });

  return {
    TotalVisados: redondear(DetalleVisados.reduce((a, d) => a + d.subtotal, 0)),
    DetalleVisados,
  };
}
