import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import StatusBadgeRecebimento from "@/components/admin/StatusBadgeRecebimento";

const filters = [
  { label: "Todos", value: "TODOS" },
  { label: "Pendentes", value: "PENDENTE" },
  { label: "Atrasados", value: "ATRASADO" },
  { label: "Recebidos", value: "RECEBIDO" },
] as const;

export default async function ContasAReceberPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const activeStatus = filters.some((f) => f.value === status)
    ? (status as (typeof filters)[number]["value"])
    : "TODOS";

  const where =
    activeStatus === "TODOS"
      ? {}
      : activeStatus === "PENDENTE"
        ? { status: "PENDENTE" as const }
        : activeStatus === "ATRASADO"
          ? { status: "PENDENTE" as const, vencimento: { lt: new Date() } }
          : { status: "RECEBIDO" as const };

  const contas = await prisma.contaReceber.findMany({
    where,
    orderBy: { vencimento: "asc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-charcoal-800">
            Contas a receber
          </h1>
          <p className="text-sm text-charcoal-500">
            {contas.length} {contas.length === 1 ? "conta" : "contas"}
          </p>
        </div>
        <Link
          href="/admin/financeiro/contas-a-receber/novo"
          className="inline-flex items-center gap-2 rounded-full bg-wood-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-wood-600 transition-colors"
        >
          <Plus size={16} />
          Nova conta
        </Link>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map((filter) => (
          <Link
            key={filter.value}
            href={
              filter.value === "TODOS"
                ? "/admin/financeiro/contas-a-receber"
                : `/admin/financeiro/contas-a-receber?status=${filter.value}`
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
        {contas.length === 0 ? (
          <p className="px-6 py-10 text-sm text-charcoal-400 text-center">
            Nenhuma conta encontrada.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-charcoal-100 text-left text-xs uppercase tracking-wide text-charcoal-400">
                  <th className="px-6 py-3 font-medium">Cliente</th>
                  <th className="px-6 py-3 font-medium">Parcela</th>
                  <th className="px-6 py-3 font-medium">Valor</th>
                  <th className="px-6 py-3 font-medium">Vencimento</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-100">
                {contas.map((conta) => (
                  <tr
                    key={conta.id}
                    className="hover:bg-charcoal-50/60 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/financeiro/contas-a-receber/${conta.id}`}
                        className="block"
                      >
                        <p className="font-medium text-charcoal-800">
                          {conta.cliente}
                        </p>
                        <p className="text-xs text-charcoal-500">
                          {conta.telefone || conta.email || "—"}
                        </p>
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-charcoal-500">
                      <Link href={`/admin/financeiro/contas-a-receber/${conta.id}`}>
                        {conta.totalParcelas > 1
                          ? `${conta.parcela}/${conta.totalParcelas}`
                          : "—"}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-charcoal-700 font-medium">
                      <Link href={`/admin/financeiro/contas-a-receber/${conta.id}`}>
                        {Number(conta.valor).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-charcoal-500">
                      <Link href={`/admin/financeiro/contas-a-receber/${conta.id}`}>
                        {conta.vencimento.toLocaleDateString("pt-BR")}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/admin/financeiro/contas-a-receber/${conta.id}`}>
                        <StatusBadgeRecebimento
                          status={conta.status}
                          vencimento={conta.vencimento}
                        />
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
