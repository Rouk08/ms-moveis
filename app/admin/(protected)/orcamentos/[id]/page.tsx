import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Tag,
  Wallet,
  FileSignature,
  Download,
} from "lucide-react";
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
              : "Cadastrado manualmente"}
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

      <div className="rounded-2xl border border-charcoal-100 bg-white p-6 shadow-sm mb-6">
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="flex gap-2.5">
            <Phone size={16} className="text-wood-500 mt-0.5 shrink-0" />
            <div>
              <dt className="text-charcoal-400">Telefone</dt>
              <dd className="text-charcoal-700">{orcamento.telefone}</dd>
            </div>
          </div>
          <div className="flex gap-2.5">
            <Mail size={16} className="text-wood-500 mt-0.5 shrink-0" />
            <div>
              <dt className="text-charcoal-400">E-mail</dt>
              <dd className="text-charcoal-700">{orcamento.email}</dd>
            </div>
          </div>
          <div className="flex gap-2.5">
            <Tag size={16} className="text-wood-500 mt-0.5 shrink-0" />
            <div>
              <dt className="text-charcoal-400">Tipo de projeto</dt>
              <dd className="text-charcoal-700">
                {orcamento.tipoProjeto.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 mt-0.5">
                    {orcamento.tipoProjeto.map((tipo) => (
                      <span
                        key={tipo}
                        className="inline-flex items-center rounded-full bg-wood-50 px-2.5 py-1 text-xs font-medium text-wood-700"
                      >
                        {tipo}
                      </span>
                    ))}
                  </div>
                ) : (
                  "—"
                )}
              </dd>
            </div>
          </div>
          <div className="flex gap-2.5">
            <Calendar size={16} className="text-wood-500 mt-0.5 shrink-0" />
            <div>
              <dt className="text-charcoal-400">Recebido em</dt>
              <dd className="text-charcoal-700">
                {orcamento.createdAt.toLocaleString("pt-BR")}
              </dd>
            </div>
          </div>
        </dl>
        <div className="mt-5 pt-5 border-t border-charcoal-100">
          <p className="text-charcoal-400 text-sm mb-1.5">Mensagem</p>
          <p className="text-charcoal-700 text-sm leading-relaxed whitespace-pre-wrap">
            {orcamento.mensagem}
          </p>
        </div>
      </div>

      <OrcamentoFotos
        orcamentoId={orcamento.id}
        fotosIniciais={orcamento.fotos.map((foto) => ({
          id: foto.id,
          nomeArquivo: foto.nomeArquivo,
        }))}
      />

      <EditOrcamentoForm
        id={orcamento.id}
        status={orcamento.status}
        valorEstimado={orcamento.valorEstimado?.toString() ?? ""}
        notasInternas={orcamento.notasInternas ?? ""}
        incluiProjeto={orcamento.incluiProjeto}
      />

      <div className="mt-6">
        <ExcluirOrcamentoButton id={orcamento.id} />
      </div>
    </div>
  );
}
