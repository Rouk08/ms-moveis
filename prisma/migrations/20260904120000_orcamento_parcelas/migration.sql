CREATE TABLE "OrcamentoParcela" (
    "id" TEXT NOT NULL,
    "orcamentoId" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL,
    "descricao" TEXT NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "vencimento" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrcamentoParcela_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "OrcamentoParcela_orcamentoId_idx" ON "OrcamentoParcela"("orcamentoId");

ALTER TABLE "OrcamentoParcela" ADD CONSTRAINT "OrcamentoParcela_orcamentoId_fkey" FOREIGN KEY ("orcamentoId") REFERENCES "Orcamento"("id") ON DELETE CASCADE ON UPDATE CASCADE;
