export const VALOR_UT = 1430; // Valor de la UT

export const categorias = [
    { nombre: "Obra Nueva", porcentaje: 0.5 },
    {
        nombre: "Acorde al codigo - exist. sin permiso en construccion",
        porcentaje: 1,
    },
    {
        nombre: "Acorde al codigo - exist. sin permiso en concluido",
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

// Factores de Visados
export const FACTORES_VISADOS = [
    {
        tipo: "electrica",
        unidad: "cantidad de bocas",
        factor: [
            { etiqueta: "0-50", valor: 10 },
            { etiqueta: "50-100", valor: 20 },
            { etiqueta: "100-200", valor: 25 },
            { etiqueta: "200-300", valor: 30 },
            { etiqueta: "300-500", valor: 45 },
            { etiqueta: "500-1000", valor: 55 },
            { etiqueta: "1000-2000", valor: 65 },
            { etiqueta: "2000-3500", valor: 75 },
        ],
    },
    {
        tipo: "salubridad",
        unidad: "bocas de artefactos",
        factor: [
            { etiqueta: "0-10", valor: 10 },
            { etiqueta: "10-20", valor: 20 },
            { etiqueta: "20-50", valor: 25 },
            { etiqueta: "50-100", valor: 30 },
            { etiqueta: "100-200", valor: 45 },
            { etiqueta: "200-300", valor: 55 },
            { etiqueta: "300-500", valor: 65 },
        ],
    },
    {
        tipo: "gas",
        unidad: "cantidad de bocas",
        factor: [
            { etiqueta: "0-5", valor: 10 },
            { etiqueta: "5-25", valor: 22 },
            { etiqueta: "25-50", valor: 32 },
            { etiqueta: "50", valor: 45 },
        ],
    },
    {
        tipo: "ascensores",
        unidad: "cantidad de equipos",
        factor: [
            { etiqueta: "0-2", valor: 10 },
            { etiqueta: "2-5", valor: 25 },
            { etiqueta: "5-10", valor: 55 },
            { etiqueta: "10", valor: 65 },
        ],
    },
] as const;
