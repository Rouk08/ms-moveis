import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Mail, Phone, Layers, FileText } from "lucide-react";
import { prisma } from "@/lib/prisma";
import StatusBadgeRecebimento from "@/components/admin/StatusBadgeRecebimento";
import EditContaReceberForm from "@/components/admin/EditContaReceberForm";

export default async function ContaReceberDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const conta = await prisma.contaReceber.findUnique({
    where: { id },
    include: { orcamento: true },
  });

  if (!conta) notFound();

  return (
    <div className="max-w-3xl">
      <Link
        href="/admin/financeiro/contas-a-receber"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-charcoal-500 hover:text-charcoal-700 mb-6"
      >
        <ArrowLeft size={16} />
        Voltar para contas a receber
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-charcoal-800">
            {conta.cliente}
          </h1>
          <p className="text-sm text-charcoal-500">
            {Number(conta.valor).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
            {conta.totalParcelas > 1 &&
              ` · Parcela ${conta.parcela}/${conta.totalParcelas}`}
          </p>
        </div>
        <StatusBadgeRecebimento
          status={conta.status}
          vencimento={conta.vencimento}
        />
      </div>

      <div className="rounded-2xl border border-charcoal-100 bg-white p-6 shadow-sm mb-6">
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="flex gap-2.5">
            <Phone size={16} className="text-wood-500 mt-0.5 shrink-0" />
            <div>
              <dt className="text-charcoal-400">Telefone</dt>
              <dd className="text-charcoal-700">{conta.telefone || "—"}</dd>
            </div>
          </div>
          <div className="flex gap-2.5">
            <Mail size={16} className="text-wood-500 mt-0.5 shrink-0" />
            <div>
              <dt className="text-charcoal-400">E-mail</dt>
              <dd className="text-charcoal-700">{conta.email || "—"}</dd>
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
          {conta.dataRecebimento && (
            <div className="flex gap-2.5">
              <Calendar size={16} className="text-wood-500 mt-0.5 shrink-0" />
              <div>
                <dt className="text-charcoal-400">Recebido em</dt>
                <dd className="text-charcoal-700">
                  {conta.dataRecebimento.toLocaleDateString("pt-BR")}
                </dd>
              </div>
            </div>
          )}
          {conta.totalParcelas > 1 && (
            <div className="flex gap-2.5">
              <Layers size={16} className="text-wood-500 mt-0.5 shrink-0" />
              <div>
                <dt className="text-charcoal-400">Parcelamento</dt>
                <dd className="text-charcoal-700">
                  Parcela {conta.parcela} de {conta.totalParcelas}
                </dd>
              </div>
            </div>
          )}
          {conta.orcamento && (
            <div className="flex gap-2.5">
              <FileText size={16} className="text-wood-500 mt-0.5 shrink-0" />
              <div>
                <dt className="text-charcoal-400">Orçamento vinculado</dt>
                <dd className="text-charcoal-700">
                  <Link
                    href={`/admin/orcamentos/${conta.orcamento.id}`}
                    className="text-wood-600 hover:text-wood-700 font-medium"
                  >
                    {conta.orcamento.nome}
                  </Link>
                </dd>
              </div>
            </div>
          )}
        </dl>
      </div>

      <EditContaReceberForm
        id={conta.id}
        cliente={conta.cliente}
        telefone={conta.telefone ?? ""}
        email={conta.email ?? ""}
        valor={conta.valor.toString()}
        vencimento={conta.vencimento.toISOString().slice(0, 10)}
        status={conta.status}
        notasInternas={conta.notasInternas ?? ""}
      />
    </div>
  );
}
