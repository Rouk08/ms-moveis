import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Repeat, Tag, Truck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import StatusBadgePagamento from "@/components/admin/StatusBadgePagamento";
import EditContaPagarForm from "@/components/admin/EditContaPagarForm";
import ExcluirContaPagarButton from "@/components/admin/ExcluirContaPagarButton";

const categoriaLabels: Record<string, string> = {
  MATERIAL: "Material",
  FORNECEDOR: "Fornecedor",
  SALARIOS: "Salários",
  ALUGUEL: "Aluguel",
  IMPOSTOS: "Impostos",
  MARKETING: "Marketing",
  OUTROS: "Outros",
};

const frequenciaLabels: Record<string, string> = {
  SEMANAL: "semanal",
  MENSAL: "mensal",
  TRIMESTRAL: "trimestral",
  ANUAL: "anual",
};

export default async function ContaPagarDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const conta = await prisma.contaPagar.findUnique({ where: { id } });

  if (!conta) notFound();

  return (
    <div className="max-w-3xl">
      <Link
        href="/admin/financeiro/contas-a-pagar"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-charcoal-500 hover:text-charcoal-700 mb-6"
      >
        <ArrowLeft size={16} />
        Voltar para contas a pagar
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-charcoal-800">
            {conta.descricao}
          </h1>
          <p className="text-sm text-charcoal-500">
            {Number(conta.valor).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </p>
        </div>
        <StatusBadgePagamento status={conta.status} vencimento={conta.vencimento} />
      </div>

      <div className="rounded-2xl border border-charcoal-100 bg-white p-6 shadow-sm mb-6">
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="flex gap-2.5">
            <Truck size={16} className="text-wood-500 mt-0.5 shrink-0" />
            <div>
              <dt className="text-charcoal-400">Fornecedor</dt>
              <dd className="text-charcoal-700">{conta.fornecedor || "—"}</dd>
            </div>
          </div>
          <div className="flex gap-2.5">
            <Tag size={16} className="text-wood-500 mt-0.5 shrink-0" />
            <div>
              <dt className="text-charcoal-400">Categoria</dt>
              <dd className="text-charcoal-700">
                {categoriaLabels[conta.categoria]}
              </dd>
            </div>
          </div>
          <div className="flex gap-2.5">
            <Calendar size={16} className="text-wood-500 mt-0.5 shrink-0" />
            <div>
              <dt className="text-charcoal-400">Vencimento</dt>
              <dd className="text-charcoal-700">
                {conta.vencimento.toLocaleDateString("pt-BR")}
              </dd>
            </div>
          </div>
          {conta.dataPagamento && (
            <div className="flex gap-2.5">
              <Calendar size={16} className="text-wood-500 mt-0.5 shrink-0" />
              <div>
                <dt className="text-charcoal-400">Pago em</dt>
                <dd className="text-charcoal-700">
                  {conta.dataPagamento.toLocaleDateString("pt-BR")}
                </dd>
              </div>
            </div>
          )}
          {conta.grupoRecorrencia && conta.frequenciaRecorrencia && (
            <div className="flex gap-2.5">
              <Repeat size={16} className="text-wood-500 mt-0.5 shrink-0" />
              <div>
                <dt className="text-charcoal-400">Recorrência</dt>
                <dd className="text-charcoal-700">
                  {frequenciaLabels[conta.frequenciaRecorrencia]} — ocorrência{" "}
                  {conta.numeroOcorrencia} de {conta.totalOcorrencias}
                </dd>
              </div>
            </div>
          )}
        </dl>
      </div>

      <div className="mb-6">
        <ExcluirContaPagarButton
          id={conta.id}
          ehRecorrente={Boolean(conta.grupoRecorrencia)}
        />
      </div>

      <EditContaPagarForm
        id={conta.id}
        descricao={conta.descricao}
        fornecedor={conta.fornecedor ?? ""}
        categoria={conta.categoria}
        valor={conta.valor.toString()}
        vencimento={conta.vencimento.toISOString().slice(0, 10)}
        status={conta.status}
        notasInternas={conta.notasInternas ?? ""}
      />
    </div>
  );
}
