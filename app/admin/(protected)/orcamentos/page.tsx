import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import StatusBadge from "@/components/admin/StatusBadge";
import type { OrcamentoStatus } from "@/lib/generated/prisma/enums";

const filters: { label: string; value: OrcamentoStatus | "TODOS" }[] = [
  { label: "Todos", value: "TODOS" },
  { label: "Novos", value: "NOVO" },
  { label: "Em andamento", value: "EM_ANDAMENTO" },
  { label: "Aprovados", value: "APROVADO" },
  { label: "Recusados", value: "RECUSADO" },
];

export default async function OrcamentosPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const activeStatus = filters.some((f) => f.value === status)
    ? (status as OrcamentoStatus)
    : "TODOS";

  const orcamentos = await prisma.orcamento.findMany({
    where: activeStatus === "TODOS" ? {} : { status: activeStatus },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-charcoal-800">
            Orçamentos
          </h1>
          <p className="text-sm text-charcoal-500">
            {orcamentos.length}{" "}
            {orcamentos.length === 1 ? "orçamento" : "orçamentos"}
          </p>
        </div>
        <Link
          href="/admin/orcamentos/novo"
          className="inline-flex items-center gap-2 rounded-full bg-wood-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-wood-600 transition-colors"
        >
          <Plus size={16} />
          Novo orçamento
        </Link>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map((filter) => (
          <Link
            key={filter.value}
            href={
              filter.value === "TODOS"
                ? "/admin/orcamentos"
                : `/admin/orcamentos?status=${filter.value}`
            }
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              activeStatus === filter.value
                ? "bg-charcoal-800 text-white"
                : "bg-white text-charcoal-600 border border-charcoal-200 hover:bg-charcoal-50"
            }`}
          >
            {filter.label}
          </Link>
        ))}
      </div>

      <div className="rounded-2xl border border-charcoal-100 bg-white shadow-sm overflow-hidden">
        {orcamentos.length === 0 ? (
          <p className="px-6 py-10 text-sm text-charcoal-400 text-center">
            Nenhum orçamento encontrado.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-charcoal-100 text-left text-xs uppercase tracking-wide text-charcoal-400">
                  <th className="px-6 py-3 font-medium">Cliente</th>
                  <th className="px-6 py-3 font-medium">Tipo de projeto</th>
                  <th className="px-6 py-3 font-medium">Origem</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Recebido em</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-100">
                {orcamentos.map((orcamento) => (
                  <tr
                    key={orcamento.id}
                    className="hover:bg-charcoal-50/60 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/orcamentos/${orcamento.id}`}
                        className="block"
                      >
                        <p className="font-medium text-charcoal-800">
                          {orcamento.nome}
                        </p>
                        <p className="text-xs text-charcoal-500">
                          {orcamento.telefone}
                        </p>
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-charcoal-600">
                      <Link href={`/admin/orcamentos/${orcamento.id}`}>
                        {orcamento.tipoProjeto || "—"}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-charcoal-500">
                      <Link href={`/admin/orcamentos/${orcamento.id}`}>
                        {orcamento.origem === "SITE" ? "Site" : "Manual"}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/admin/orcamentos/${orcamento.id}`}>
                        <StatusBadge status={orcamento.status} />
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-charcoal-500">
                      <Link href={`/admin/orcamentos/${orcamento.id}`}>
                        {orcamento.createdAt.toLocaleDateString("pt-BR")}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
