-- CreateTable
CREATE TABLE "OrcamentoFoto" (
    "id" TEXT NOT NULL,
    "orcamentoId" TEXT NOT NULL,
    "nomeArquivo" TEXT NOT NULL,
    "caminho" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "tamanho" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrcamentoFoto_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OrcamentoFoto" ADD CONSTRAINT "OrcamentoFoto_orcamentoId_fkey" FOREIGN KEY ("orcamentoId") REFERENCES "Orcamento"("id") ON DELETE CASCADE ON UPDATE CASCADE;
