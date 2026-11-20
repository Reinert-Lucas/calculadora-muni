export const categorias = [
  { nombre: "Obra Nueva", porcentaje: 0.5 },
  {
    nombre: "Acorde al codigo - exist. sin permiso en construccion",
    porcentaje: 1,
  },
  {
    nombre: "Acorde al codigo - exist. sin permiso concluido",
    porcentaje: 2,
  },
  { nombre: "Antirreg. - concluida detectada", porcentaje: 6 },
  { nombre: "Antirreg. - pv de obra concluida", porcentaje: 5 },
  { nombre: "Cuerpo cerrado sobre linea municipal", porcentaje: 9 },
  { nombre: "Balcones", porcentaje: 6 },
  { nombre: "Marquesinas y/o aleros", porcentaje: 4 },
] as const;

// Tramos de superficie -> coeficiente de UT
export const TRAMOS = [
  {
    coef: 50,
    etiqueta: "Entre 1 y 60 m2",
    contiene: (m2: number) => m2 <= 60,
  },
  {
    coef: 100,
    etiqueta: "Entre 60 y 150 m2",
    contiene: (m2: number) => m2 < 150,
  },
  {
    coef: 150,
    etiqueta: "Entre 150 y 350 m2",
    contiene: (m2: number) => m2 < 350,
  },
  { coef: 250, etiqueta: "350 y más m2", contiene: () => true },
] as const;

// Tramos de FDU
export const FDU_TRAMOS = [
  {
    clave: "sup_4",
    porcentaje: 0.04,
    etiqueta: "Sup. entre 9,01 y 18,00 - (4%)",
  },
  {
    clave: "sup_8",
    porcentaje: 0.08,
    etiqueta: "Sup. entre 18,01 y 30,00 - (8%)",
  },
  { clave: "sup_12", porcentaje: 0.12, etiqueta: "Sup. sobre 30,00 - (12%)" },
] as const;

export type ClaveVisado = "electrica" | "gas" | "salubridad" | "ascensores";

export type TramoVisado = {
  desde: number;
  hasta: number | null; // null = "en adelante"
  factor: number | null; // null = sin factor definido ("-" en la tabla)
};

export const VISADOS: readonly {
  clave: ClaveVisado;
  nombre: string;
  unidad: string;
  tramos: readonly TramoVisado[];
}[] = [
  {
    clave: "electrica",
    nombre: "Instalación Eléctrica",
    unidad: "bocas",
    tramos: [
      { desde: 0, hasta: 50, factor: 10 },
      { desde: 50, hasta: 100, factor: 20 },
      { desde: 100, hasta: 150, factor: 25 },
      { desde: 150, hasta: 250, factor: 30 },
      { desde: 250, hasta: 350, factor: 45 },
      { desde: 350, hasta: 500, factor: 55 },
      { desde: 500, hasta: 750, factor: 65 },
      { desde: 750, hasta: 1000, factor: 75 },
      { desde: 1000, hasta: 2000, factor: 85 },
      { desde: 2000, hasta: 3500, factor: 95 },
      { desde: 3500, hasta: null, factor: null },
    ],
  },
  {
    clave: "salubridad",
    nombre: "Instalaciones de Salubridad",
    unidad: "artefactos",
    tramos: [
      { desde: 0, hasta: 10, factor: 10 },
      { desde: 10, hasta: 20, factor: 20 },
      { desde: 20, hasta: 50, factor: 25 },
      { desde: 50, hasta: 100, factor: 30 },
      { desde: 100, hasta: 200, factor: 45 },
      { desde: 200, hasta: 300, factor: 55 },
      { desde: 300, hasta: 500, factor: 65 },
      { desde: 500, hasta: 750, factor: 75 },
      { desde: 750, hasta: 1000, factor: 85 },
      { desde: 1000, hasta: null, factor: null },
    ],
  },
  {
    clave: "gas",
    nombre: "Instalación de Gas",
    unidad: "bocas",
    tramos: [
      { desde: 0, hasta: 5, factor: 10 },
      { desde: 5, hasta: 25, factor: 22 },
      { desde: 25, hasta: 50, factor: 32 },
      { desde: 50, hasta: 75, factor: 45 },
      { desde: 75, hasta: 100, factor: 55 },
      { desde: 100, hasta: 200, factor: 65 },
      { desde: 100, hasta: 200, factor: 65 },
      { desde: 200, hasta: null, factor: 65 },
    ],
  },
  {
    clave: "ascensores",
    nombre: "Instalación de Ascensores",
    unidad: "unidades",
    tramos: [
      { desde: 0, hasta: 2, factor: 10 },
      { desde: 2, hasta: 5, factor: 25 },
      { desde: 5, hasta: 10, factor: 55 },
      { desde: 10, hasta: 15, factor: 65 },
      { desde: 15, hasta: null, factor: null },
    ],
  },
];

export const etiquetaTramo = (t: { desde: number; hasta: number | null }) =>
  t.hasta === null ? `${t.desde} o más` : `${t.desde} a ${t.hasta}`;
