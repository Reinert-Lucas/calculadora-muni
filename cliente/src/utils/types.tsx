import type { FDU_TRAMOS } from "../constants/impuestos";

export type Obra = { id: number; metros_cuadrados: number; estado: number };

export type FDU = Record<(typeof FDU_TRAMOS)[number]["clave"], number>;

// Costos extras (Colegio, Consejo, Bomberos, Honorarios)
export type CostosAdicionales = {
  colegio1: number;
  colegio2: number;
  honorarios: number;
  bomberos: number;
};

export type DetalleObra = {
  id: number;
  superficie: number;
  categoria: string; // tramo de superficie
  estado: string;
  valorM2: number; // coeficiente de UT
  ut: number;
  monto: number; // valorM2 x UT
  subtotal: number; // monto x superficie
  porcentaje: number; // % del estado de obra
  importe: number; // subtotal x porcentaje
};

// Detalles de precios del FDU
export type DetalleFDU = {
  clave: string;
  superficie: number;
  fdu: string;
  categoria: string;
  valorMxUt: number;
  subtotal: number;
};

// Resultado genernal (Obras + ?FDU)
export type Resultado = {
  TotalGeneral: number;
  TotalBase: number;
  TotalFDU: number;
  TotalAdicionales: number;
  CostosAdicionales: CostosAdicionales;
  TotalM2: number;
  CategoriaDeterminada: string;
  EstadoObras: DetalleObra[];
  ResultadosFDU: DetalleFDU[];
  Coeficiente: number
};

// Resultado solo del FDU
export type ResultadoSoloFDU = {
  TotalFDU: number;
  ResultadosFDU: DetalleFDU[]
}