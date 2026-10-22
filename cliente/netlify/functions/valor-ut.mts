import type { Config } from "@netlify/functions";
import { getUser } from "@netlify/identity";
import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { parametros } from "../../db/schema.js";

const CLAVE = "valor-ut";

export default async (req: Request) => {
  // Lectura pública: la calculadora necesita el valor vigente
  if (req.method === "GET") {
    const [fila] = await db.select().from(parametros).where(eq(parametros.clave, CLAVE));
    if (!fila) return Response.json({ error: "Valor de la UT no configurado." }, { status: 404 });
    return Response.json(
      { valor: fila.valor, actualizadoEn: fila.actualizadoEn },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  // Modificación: solo usuarios con rol "admin"
  if (req.method === "PUT") {
    const user = await getUser();
    if (!user) return Response.json({ error: "No autenticado." }, { status: 401 });
    if (!user.roles?.includes("admin"))
      return Response.json({ error: "No tenés permisos para modificar el valor." }, { status: 403 });

    const body = await req.json().catch(() => null);
    const valor = Number(body?.valor);
    if (!Number.isFinite(valor) || valor <= 0)
      return Response.json({ error: "Ingresá un valor numérico mayor a 0." }, { status: 400 });

    const actualizado = { valor, actualizadoPor: user.email ?? user.id, actualizadoEn: new Date() };
    const [fila] = await db
      .insert(parametros)
      .values({ clave: CLAVE, ...actualizado })
      .onConflictDoUpdate({ target: parametros.clave, set: actualizado })
      .returning();

    return Response.json({ valor: fila.valor, actualizadoEn: fila.actualizadoEn });
  }

  return new Response("Method not allowed", { status: 405, headers: { Allow: "GET, PUT" } });
};

export const config: Config = {
  path: "/api/valor-ut",
};
