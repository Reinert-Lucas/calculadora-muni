import { pgTable, text, doublePrecision, timestamp } from "drizzle-orm/pg-core";

// Parámetros configurables de la calculadora (ej. "valor-ut")
export const parametros = pgTable("parametros", {
  clave: text().primaryKey(),
  valor: doublePrecision().notNull(),
  actualizadoPor: text("actualizado_por"),
  actualizadoEn: timestamp("actualizado_en", { withTimezone: true }).defaultNow().notNull(),
});
