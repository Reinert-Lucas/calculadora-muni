CREATE TABLE "parametros" (
	"clave" text PRIMARY KEY,
	"valor" double precision NOT NULL,
	"actualizado_por" text,
	"actualizado_en" timestamp with time zone DEFAULT now() NOT NULL
);
