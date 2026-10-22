-- Valor inicial de la UT (el que estaba fijo en el código)
INSERT INTO "parametros" ("clave", "valor") VALUES ('valor-ut', 1430) ON CONFLICT ("clave") DO NOTHING;
