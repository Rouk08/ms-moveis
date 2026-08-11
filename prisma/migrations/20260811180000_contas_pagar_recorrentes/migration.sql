-- CreateEnum
CREATE TYPE "FrequenciaRecorrencia" AS ENUM ('SEMANAL', 'MENSAL', 'TRIMESTRAL', 'ANUAL');

-- AlterTable
ALTER TABLE "ContaPagar" ADD COLUMN "grupoRecorrencia" TEXT,
ADD COLUMN "frequenciaRecorrencia" "FrequenciaRecorrencia",
ADD COLUMN "numeroOcorrencia" INTEGER,
ADD COLUMN "totalOcorrencias" INTEGER;
