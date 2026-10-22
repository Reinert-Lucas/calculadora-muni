import { useEffect, useState } from "react";
import { VALOR_UT } from "../constants/impuestos";

const URL_VALOR_UT = "/api/valor-ut";

export async function obtenerValorUt(): Promise<number> {
  const res = await fetch(URL_VALOR_UT);
  if (!res.ok) throw new Error("No se pudo obtener el valor de la UT.");
  const { valor } = await res.json();
  return valor;
}

export async function guardarValorUt(valor: number): Promise<number> {
  // La sesión de Netlify Identity viaja en la cookie nf_jwt
  const res = await fetch(URL_VALOR_UT, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify({ valor }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? "No se pudo guardar el valor de la UT.");
  return data.valor;
}

// Valor vigente de la UT; si la API falla se usa el valor por defecto
export function useValorUt() {
  const [valor, setValor] = useState<number | null>(null);
  const [usandoDefecto, setUsandoDefecto] = useState(false);

  useEffect(() => {
    obtenerValorUt()
      .then(setValor)
      .catch(() => {
        setValor(VALOR_UT);
        setUsandoDefecto(true);
      });
  }, []);

  return { valor, usandoDefecto };
}
