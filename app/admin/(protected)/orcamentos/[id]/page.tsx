import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Wallet, FileSignature, Download } from "lucide-react";
import { prisma } from "@/lib/prisma";
import StatusBadge from "@/components/admin/StatusBadge";
import StatusBadgeContrato from "@/components/admin/StatusBadgeContrato";
import EditOrcamentoForm from "@/components/admin/EditOrcamentoForm";
import ExcluirOrcamentoButton from "@/components/admin/ExcluirOrcamentoButton";
import OrcamentoFotos from "@/components/admin/OrcamentoFotos";

export default async function OrcamentoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const orcamento = await prisma.orcamento.findUnique({
    where: { id },
    include: {
      contrato: true,
      fotos: { orderBy: { createdAt: "desc" } },
      itens: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!orcamento) notFound();

  return (
    <div className="max-w-3xl">
      <Link
        href="/admin/orcamentos"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-charcoal-500 hover:text-charcoal-700 mb-6"
      >
        <ArrowLeft size={16} />
        Voltar para orçamentos
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-charcoal-800">
            {orcamento.nome}
          </h1>
          <p className="text-sm text-charcoal-500">
            {orcamento.origem === "SITE"
              ? "Recebido pelo site"
              : "Cadastrado manualmente"}{" "}
            em {orcamento.createdAt.toLocaleString("pt-BR")}
          </p>
        </div>
        <StatusBadge status={orcamento.status} />
      </div>

      <a
        href={`/api/orcamentos/${orcamento.id}/pdf`}
        className="mb-6 inline-flex items-center gap-2 rounded-full bg-wood-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-wood-600 transition-colors"
      >
        <Download size={16} />
        Baixar PDF do orçamento
      </a>

      {orcamento.status === "APROVADO" && (
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <Link
            href={`/admin/financeiro/contas-a-receber/novo?orcamentoId=${orcamento.id}`}
            className="inline-flex items-center gap-2 rounded-full bg-moss-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-moss-700 transition-colors"
          >
            <Wallet size={16} />
            Gerar conta a receber
          </Link>
          {orcamento.contrato ? (
            <Link
              href={`/admin/orcamentos/${orcamento.id}/contrato`}
              className="inline-flex items-center gap-2 rounded-full bg-white border border-charcoal-200 px-5 py-2.5 text-sm font-semibold text-charcoal-700 hover:bg-charcoal-50 transition-colors"
            >
              <FileSignature size={16} />
              Contrato
              <StatusBadgeContrato status={orcamento.contrato.status} />
            </Link>
          ) : (
            <Link
              href={`/admin/orcamentos/${orcamento.id}/contrato/novo`}
              className="inline-flex items-center gap-2 rounded-full bg-white border border-charcoal-200 px-5 py-2.5 text-sm font-semibold text-charcoal-700 hover:bg-charcoal-50 transition-colors"
            >
              <FileSignature size={16} />
              Criar contrato
            </Link>
          )}
        </div>
      )}

      <OrcamentoFotos
        orcamentoId={orcamento.id}
        fotosIniciais={orcamento.fotos.map((foto) => ({
          id: foto.id,
          nomeArquivo: foto.nomeArquivo,
        }))}
      />

      <EditOrcamentoForm
        id={orcamento.id}
        nome={orcamento.nome}
        telefone={orcamento.telefone}
        email={orcamento.email ?? ""}
        tipoProjeto={orcamento.tipoProjeto}
        mensagem={orcamento.mensagem}
        status={orcamento.status}
        valorEstimado={orcamento.valorEstimado?.toString() ?? ""}
        notasInternas={orcamento.notasInternas ?? ""}
        incluiProjeto={orcamento.incluiProjeto}
        itensIniciais={orcamento.itens.map((i) => ({
          categoria: i.categoria,
          item: i.item,
          valorUnitario: i.valorUnitario.toString(),
          observacao: i.observacao ?? "",
        }))}
      />

      <div className="mt-6">
        <ExcluirOrcamentoButton id={orcamento.id} />
      </div>
    </div>
  );
}
