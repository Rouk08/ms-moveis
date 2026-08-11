import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, Calendar, Tag } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { updateOrcamento } from "@/lib/actions/orcamentos";
import StatusBadge from "@/components/admin/StatusBadge";

const statusOptions = [
  { value: "NOVO", label: "Novo" },
  { value: "EM_ANDAMENTO", label: "Em andamento" },
  { value: "APROVADO", label: "Aprovado" },
  { value: "RECUSADO", label: "Recusado" },
];

export default async function OrcamentoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const orcamento = await prisma.orcamento.findUnique({ where: { id } });

  if (!orcamento) notFound();

  const updateOrcamentoWithId = updateOrcamento.bind(null, orcamento.id);

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
                {orcamento.tipoProjeto || "—"}
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

      <form
        action={updateOrcamentoWithId}
        className="rounded-2xl border border-charcoal-100 bg-white p-6 shadow-sm space-y-5"
      >
        <h2 className="font-semibold text-charcoal-800">
          Acompanhamento interno
        </h2>

        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-charcoal-700 mb-1.5"
          >
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={orcamento.status}
            className="w-full rounded-lg border border-charcoal-200 px-4 py-2.5 text-charcoal-800 focus:border-wood-500 focus:outline-none focus:ring-2 focus:ring-wood-200"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="valorEstimado"
            className="block text-sm font-medium text-charcoal-700 mb-1.5"
          >
            Valor estimado (R$)
          </label>
          <input
            id="valorEstimado"
            name="valorEstimado"
            type="number"
            step="0.01"
            min="0"
            defaultValue={orcamento.valorEstimado?.toString() ?? ""}
            placeholder="0,00"
            className="w-full rounded-lg border border-charcoal-200 px-4 py-2.5 text-charcoal-800 focus:border-wood-500 focus:outline-none focus:ring-2 focus:ring-wood-200"
          />
        </div>

        <div>
          <label
            htmlFor="notasInternas"
            className="block text-sm font-medium text-charcoal-700 mb-1.5"
          >
            Notas internas
          </label>
          <textarea
            id="notasInternas"
            name="notasInternas"
            rows={4}
            defaultValue={orcamento.notasInternas ?? ""}
            placeholder="Observações visíveis só para a equipe..."
            className="w-full rounded-lg border border-charcoal-200 px-4 py-2.5 text-charcoal-800 focus:border-wood-500 focus:outline-none focus:ring-2 focus:ring-wood-200"
          />
        </div>

        <button
          type="submit"
          className="rounded-full bg-wood-500 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-wood-600 transition-colors"
        >
          Salvar alterações
        </button>
      </form>
    </div>
  );
}
