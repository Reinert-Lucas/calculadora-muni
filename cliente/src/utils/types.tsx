export type Resultado = {
  TotalGeneral: number;
  TotalM2: number;
  CategoriaDeterminada: string;
  EstadoObras: {
    id: number;
    superficie: number;
    categoria: string;
    estado: number | string;
    DatosCategoria: {
      valor_m2: number;
      UT: number;
      Monto: number;
      Subtotal: number;
      PorcentajeAplicado: number;
    };
  }[];
  ResultadosFDU: {
    sup_4: {
      valor_m2: number;
      fdu: string;
      categoria: string;
      valorMxUt: number;
      subtotal: number;
    };
    sup_8: {
      valor_m2: number;
      fdu: string;
      categoria: string;
      valorMxUt: number;
      subtotal: number;
    };
    sup_12: {
      valor_m2: number;
      fdu: string;
      categoria: string;
      valorMxUt: number;
      subtotal: number;
    };
  };
};
export type Obra = {
  id: number;
  metros_cuadrados: number;
  estado: number;
};
export type FDU = {
  sup_4: number;
  sup_8: number;
  sup_12: number;
};
