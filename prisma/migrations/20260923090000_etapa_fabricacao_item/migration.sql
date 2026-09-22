CREATE TABLE "EtapaFabricacaoItem" (
    "id" TEXT NOT NULL,
    "contratoId" TEXT NOT NULL,
    "numero" INTEGER NOT NULL,
    "concluida" BOOLEAN NOT NULL DEFAULT false,
    "dataConclusao" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EtapaFabricacaoItem_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "EtapaFabricacaoItem_contratoId_idx" ON "EtapaFabricacaoItem"("contratoId");

CREATE UNIQUE INDEX "EtapaFabricacaoItem_contratoId_numero_key" ON "EtapaFabricacaoItem"("contratoId", "numero");

ALTER TABLE "EtapaFabricacaoItem" ADD CONSTRAINT "EtapaFabricacaoItem_contratoId_fkey" FOREIGN KEY ("contratoId") REFERENCES "Contrato"("id") ON DELETE CASCADE ON UPDATE CASCADE;
