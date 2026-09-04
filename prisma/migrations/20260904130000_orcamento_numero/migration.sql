ALTER TABLE "Orcamento" ADD COLUMN "numero" SERIAL;

CREATE UNIQUE INDEX "Orcamento_numero_key" ON "Orcamento"("numero");
