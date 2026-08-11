import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import NovoContratoForm from "@/components/admin/NovoContratoForm";

export default async function NovoContratoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const orcamento = await prisma.orcamento.findUnique({
    where: { id },
    include: { contrato: true },
  });

  if (!orcamento) notFound();
  if (orcamento.contrato) redirect(`/admin/orcamentos/${id}/contrato`);

  return (
    <div className="max-w-2xl">
      <Link
        href={`/admin/orcamentos/${id}`}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-charcoal-500 hover:text-charcoal-700 mb-6"
      >
        <ArrowLeft size={16} />
        Voltar para o orçamento
      </Link>

      <h1 className="text-2xl font-semibold text-charcoal-800 mb-1">
        Novo contrato
      </h1>
      <p className="text-sm text-charcoal-500 mb-6">
        Referente ao orçamento de {orcamento.nome}.
      </p>

      <NovoContratoForm
        orcamentoId={orcamento.id}
        contratanteNome={orcamento.nome}
        valorTotal={orcamento.valorEstimado?.toString()}
      />
    </div>
  );
}
