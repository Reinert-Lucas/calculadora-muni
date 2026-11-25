import type { ClaveVisado, FDU_TRAMOS } from "../constants/impuestos";

export type Obra = { id: number; metros_cuadrados: number; estado: number };

export type FDU = Record<(typeof FDU_TRAMOS)[number]["clave"], number>;

// Costos extras (Visados CAPM)
export type CostosAdicionales = {
  colegioArquitectos: number;
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
  DetalleVisados: DetalleVisado[];
  TotalM2: number;
  CategoriaDeterminada: string;
  EstadoObras: DetalleObra[];
  ResultadosFDU: DetalleFDU[];
  Coeficiente: number;
};

// Resultado solo del FDU
export type ResultadoSoloFDU = {
  TotalFDU: number;
  ResultadosFDU: DetalleFDU[];
};

export type SeleccionVisados = Record<
  import("../constants/impuestos").ClaveVisado,
  string
>;

export type DetalleVisado = {
  clave: string;
  nombre: string;
  unidades: string; // tramo elegido
  factor: number;
  ut: number;
  subtotal: number; // factor × ut × estado
};

export type ResultadoVisados = {
  TotalVisados: number;
  DetalleVisados: DetalleVisado[];
};

// Estado del formulario: todo string porque viene de inputs
export type ObraForm = { id: number; metros_cuadrados: string; estado: string };

export interface CalculoSimpleProps {
  obras: ObraForm[];
  error: string | null;
  catMsg: string | null;
  setObras: React.Dispatch<React.SetStateAction<ObraForm[]>>;
  onLimpiar: () => void;
}

export interface CalculoFDUProps {
  mostrarFdu: boolean;
  fdu: { sup_4: string; sup_8: string; sup_12: string };
  obras: ObraForm[];
  utMuni: number;
  setFdu: React.Dispatch<
    React.SetStateAction<{
      sup_4: string;
      sup_8: string;
      sup_12: string;
    }>
  >;
  setMostrarFdu: React.Dispatch<React.SetStateAction<boolean>>;
  setResultados: React.Dispatch<React.SetStateAction<Resultado | null>>;
  onSoloFdu: () => void;
  onCalcularTotal: (
    obras: Obra[],
    fdu: FDU,
    utMuni: number,
    costosAdicionales?: CostosAdicionales,
    detalleVisados?: DetalleVisado[],
  ) => Resultado;
  totalVisadosArquitectos: number;
  detalleVisadosArquitectos: DetalleVisado[];
}

export interface CalculoAdicionalesProps {
  setMostrarColegios: React.Dispatch<React.SetStateAction<boolean>>;
  setVisados: React.Dispatch<React.SetStateAction<Record<ClaveVisado, string>>>;
  setResultadosVisados: React.Dispatch<
    React.SetStateAction<ResultadoVisados | null>
  >;
  onSoloVisados: () => void;
  mostrarColegios: boolean;
  utCapm: number;
  visados: Record<ClaveVisado, string>;
}

export const FDU_INICIAL = { sup_4: "", sup_8: "", sup_12: "" };
export const VISADOS_INICIAL: Record<ClaveVisado, string> = {
  electrica: "",
  gas: "",
  salubridad: "",
  ascensores: "",
};

// "" -> NaN (y no 0), para que la validación detecte campos vacíos
export const aNumero = (v: string) => (v.trim() === "" ? NaN : Number(v));
