-- AlterTable
ALTER TABLE "Orcamento" ALTER COLUMN "tipoProjeto" TYPE TEXT[] USING ARRAY["tipoProjeto"];
