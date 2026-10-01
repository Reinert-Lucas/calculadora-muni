const moneda = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" });
const numero = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 2 });

export const formatoMoneda = (n: number) => moneda.format(n);
export const formatoNumero = (n: number) => numero.format(n);