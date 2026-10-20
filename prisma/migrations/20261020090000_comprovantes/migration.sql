CREATE TABLE "ContaPagarComprovante" (
    "id" TEXT NOT NULL,
    "contaPagarId" TEXT NOT NULL,
    "nomeArquivo" TEXT NOT NULL,
    "caminho" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "tamanho" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContaPagarComprovante_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AporteComprovante" (
    "id" TEXT NOT NULL,
    "aporteId" TEXT NOT NULL,
    "nomeArquivo" TEXT NOT NULL,
    "caminho" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "tamanho" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AporteComprovante_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ContaPagarComprovante_contaPagarId_idx" ON "ContaPagarComprovante"("contaPagarId");

CREATE INDEX "AporteComprovante_aporteId_idx" ON "AporteComprovante"("aporteId");

ALTER TABLE "ContaPagarComprovante" ADD CONSTRAINT "ContaPagarComprovante_contaPagarId_fkey" FOREIGN KEY ("contaPagarId") REFERENCES "ContaPagar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "AporteComprovante" ADD CONSTRAINT "AporteComprovante_aporteId_fkey" FOREIGN KEY ("aporteId") REFERENCES "Aporte"("id") ON DELETE CASCADE ON UPDATE CASCADE;
