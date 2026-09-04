CREATE TYPE "FormaPagamento" AS ENUM ('DINHEIRO', 'PIX', 'CARTAO_CREDITO', 'CARTAO_DEBITO', 'BOLETO', 'TRANSFERENCIA');

ALTER TABLE "Orcamento" ADD COLUMN "formaPagamento" "FormaPagamento";
ALTER TABLE "Orcamento" ADD COLUMN "parcelado" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Orcamento" ADD COLUMN "numeroParcelas" INTEGER;
