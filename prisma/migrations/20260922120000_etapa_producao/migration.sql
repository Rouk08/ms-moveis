CREATE TABLE "EtapaProducao" (
    "id" TEXT NOT NULL,
    "contratoId" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "dataPrevista" TIMESTAMP(3) NOT NULL,
    "concluida" BOOLEAN NOT NULL DEFAULT false,
    "dataConclusao" TIMESTAMP(3),
    "observacao" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EtapaProducao_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "EtapaProducao_contratoId_idx" ON "EtapaProducao"("contratoId");

CREATE INDEX "EtapaProducao_dataPrevista_idx" ON "EtapaProducao"("dataPrevista");

ALTER TABLE "EtapaProducao" ADD CONSTRAINT "EtapaProducao_contratoId_fkey" FOREIGN KEY ("contratoId") REFERENCES "Contrato"("id") ON DELETE CASCADE ON UPDATE CASCADE;
