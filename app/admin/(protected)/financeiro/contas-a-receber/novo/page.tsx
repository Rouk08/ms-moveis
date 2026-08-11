import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import NovaContaReceberForm from "@/components/admin/NovaContaReceberForm";

export default async function NovaContaReceberPage({
  searchParams,
}: {
  searchParams: Promise<{ orcamentoId?: string }>;
}) {
  const { orcamentoId } = await searchParams;

  const orcamento = orcamentoId
    ? await prisma.orcamento.findUnique({ where: { id: orcamentoId } })
    : null;

  return (
    <div className="max-w-xl">
      <Link
        href="/admin/financeiro/contas-a-receber"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-charcoal-500 hover:text-charcoal-700 mb-6"
      >
        <ArrowLeft size={16} />
        Voltar para contas a receber
      </Link>

      <h1 className="text-2xl font-semibold text-charcoal-800 mb-1">
        Nova conta a receber
      </h1>
      <p className="text-sm text-charcoal-500 mb-6">
        Cadastre um valor a receber, com ou sem parcelamento.
      </p>

      <NovaContaReceberForm
        orcamentoId={orcamento?.id}
        cliente={orcamento?.nome}
        telefone={orcamento?.telefone}
        email={orcamento?.email}
        valor={orcamento?.valorEstimado?.toString()}
      />
    </div>
  );
}
