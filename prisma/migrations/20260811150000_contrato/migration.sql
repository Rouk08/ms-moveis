-- CreateEnum
CREATE TYPE "TipoContratante" AS ENUM ('PESSOA_FISICA', 'PESSOA_JURIDICA');

-- CreateEnum
CREATE TYPE "StatusContrato" AS ENUM ('RASCUNHO', 'GERADO', 'ASSINADO');

-- CreateTable
CREATE TABLE "Contrato" (
    "id" TEXT NOT NULL,
    "orcamentoId" TEXT NOT NULL,
    "tipoContratante" "TipoContratante" NOT NULL DEFAULT 'PESSOA_FISICA',
    "contratanteNome" TEXT NOT NULL,
    "contratanteDocumento" TEXT NOT NULL,
    "contratanteEndereco" TEXT NOT NULL,
    "contratanteCep" TEXT NOT NULL,
    "contratanteBairro" TEXT NOT NULL,
    "contratanteCidade" TEXT NOT NULL,
    "contratanteUf" TEXT NOT NULL,
    "contratanteRepNome" TEXT,
    "contratanteRepCpf" TEXT,
    "contratanteRepRg" TEXT,
    "contratanteRepCargo" TEXT,
    "enderecoInstalacao" TEXT NOT NULL,
    "prazoExecucaoDias" INTEGER NOT NULL,
    "valorTotal" DECIMAL(10,2) NOT NULL,
    "valorSinal" DECIMAL(10,2) NOT NULL,
    "valorFabricacao" DECIMAL(10,2) NOT NULL,
    "valorEntrega" DECIMAL(10,2) NOT NULL,
    "foroCidade" TEXT NOT NULL,
    "foroUf" TEXT NOT NULL,
    "dataContrato" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "StatusContrato" NOT NULL DEFAULT 'RASCUNHO',
    "notasInternas" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contrato_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Contrato_orcamentoId_key" ON "Contrato"("orcamentoId");

-- AddForeignKey
ALTER TABLE "Contrato" ADD CONSTRAINT "Contrato_orcamentoId_fkey" FOREIGN KEY ("orcamentoId") REFERENCES "Orcamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
