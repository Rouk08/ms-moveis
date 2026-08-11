import Link from "next/link";
import { TrendingDown, TrendingUp, Scale, AlertTriangle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import StatCard from "@/components/admin/StatCard";

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default async function FinanceiroPage() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  const [
    pagarMes,
    receberMes,
    atrasadosPagar,
    atrasadosReceber,
    proximosPagar,
    proximosReceber,
  ] = await Promise.all([
    prisma.contaPagar.aggregate({
      _sum: { valor: true },
      where: {
        status: "PENDENTE",
        vencimento: { gte: startOfMonth, lte: endOfMonth },
      },
    }),
    prisma.contaReceber.aggregate({
      _sum: { valor: true },
      where: {
        status: "PENDENTE",
        vencimento: { gte: startOfMonth, lte: endOfMonth },
      },
    }),
    prisma.contaPagar.count({
      where: { status: "PENDENTE", vencimento: { lt: now } },
    }),
    prisma.contaReceber.count({
      where: { status: "PENDENTE", vencimento: { lt: now } },
    }),
    prisma.contaPagar.findMany({
      where: { status: "PENDENTE" },
      orderBy: { vencimento: "asc" },
      take: 6,
    }),
    prisma.contaReceber.findMany({
      where: { status: "PENDENTE" },
      orderBy: { vencimento: "asc" },
      take: 6,
    }),
  ]);

  const totalPagarMes = Number(pagarMes._sum.valor ?? 0);
  const totalReceberMes = Number(receberMes._sum.valor ?? 0);
  const saldoPrevisto = totalReceberMes - totalPagarMes;
  const atrasados = atrasadosPagar + atrasadosReceber;

  const proximos = [
    ...proximosPagar.map((c) => ({
      id: c.id,
      tipo: "pagar" as const,
      titulo: c.descricao,
      valor: Number(c.valor),
      vencimento: c.vencimento,
      href: `/admin/financeiro/contas-a-pagar/${c.id}`,
    })),
    ...proximosReceber.map((c) => ({
      id: c.id,
      tipo: "receber" as const,
      titulo: c.cliente,
      valor: Number(c.valor),
      vencimento: c.vencimento,
      href: `/admin/financeiro/contas-a-receber/${c.id}`,
    })),
  ]
    .sort((a, b) => a.vencimento.getTime() - b.vencimento.getTime())
    .slice(0, 8);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-charcoal-800 mb-1">
        Financeiro
      </h1>
      <p className="text-sm text-charcoal-500 mb-8">
        Visão geral de contas a pagar e a receber.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <StatCard
          label="A pagar este mês"
          value={formatBRL(totalPagarMes)}
          icon={TrendingDown}
        />
        <StatCard
          label="A receber este mês"
          value={formatBRL(totalReceberMes)}
          icon={TrendingUp}
        />
        <StatCard
          label="Saldo previsto"
          value={formatBRL(saldoPrevisto)}
          icon={Scale}
        />
        <StatCard label="Contas atrasadas" value={atrasados} icon={AlertTriangle} />
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        <Link
          href="/admin/financeiro/contas-a-pagar"
          className="rounded-full bg-white border border-charcoal-200 px-5 py-2.5 text-sm font-medium text-charcoal-700 hover:bg-charcoal-50 transition-colors"
        >
          Ver contas a pagar
        </Link>
        <Link
          href="/admin/financeiro/contas-a-receber"
          className="rounded-full bg-white border border-charcoal-200 px-5 py-2.5 text-sm font-medium text-charcoal-700 hover:bg-charcoal-50 transition-colors"
        >
          Ver contas a receber
        </Link>
      </div>

      <div className="rounded-2xl border border-charcoal-100 bg-white shadow-sm">
        <div className="border-b border-charcoal-100 px-6 py-4">
          <h2 className="font-semibold text-charcoal-800">
            Próximos vencimentos
          </h2>
        </div>
        {proximos.length === 0 ? (
          <p className="px-6 py-8 text-sm text-charcoal-400 text-center">
            Nenhuma conta pendente.
          </p>
        ) : (
          <ul className="divide-y divide-charcoal-100">
            {proximos.map((item) => (
              <li key={`${item.tipo}-${item.id}`}>
                <Link
                  href={item.href}
                  className="flex items-center justify-between px-6 py-4 hover:bg-charcoal-50/60 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-charcoal-800">
                      {item.titulo}
                    </p>
                    <p className="text-xs text-charcoal-500">
                      {item.tipo === "pagar" ? "A pagar" : "A receber"} ·{" "}
                      {item.vencimento.toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <span
                    className={`text-sm font-semibold ${
                      item.tipo === "pagar" ? "text-red-600" : "text-moss-600"
                    }`}
                  >
                    {item.tipo === "pagar" ? "-" : "+"}
                    {formatBRL(item.valor)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
