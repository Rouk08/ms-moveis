import Link from "next/link";
import { FileText, Clock, CheckCircle2, Inbox } from "lucide-react";
import { prisma } from "@/lib/prisma";
import StatCard from "@/components/admin/StatCard";

export default async function AdminDashboardPage() {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [novos, emAndamento, aprovadosMes, total] = await Promise.all([
    prisma.orcamento.count({ where: { status: "NOVO" } }),
    prisma.orcamento.count({ where: { status: "EM_ANDAMENTO" } }),
    prisma.orcamento.count({
      where: { status: "APROVADO", updatedAt: { gte: startOfMonth } },
    }),
    prisma.orcamento.count(),
  ]);

  const recentes = await prisma.orcamento.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-charcoal-800 mb-1">
        Dashboard
      </h1>
      <p className="text-sm text-charcoal-500 mb-8">
        Visão geral dos orçamentos.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <StatCard label="Novos" value={novos} icon={Inbox} />
        <StatCard label="Em andamento" value={emAndamento} icon={Clock} />
        <StatCard
          label="Aprovados este mês"
          value={aprovadosMes}
          icon={CheckCircle2}
        />
        <StatCard label="Total de orçamentos" value={total} icon={FileText} />
      </div>

      <div className="rounded-2xl border border-charcoal-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-charcoal-100 px-6 py-4">
          <h2 className="font-semibold text-charcoal-800">
            Orçamentos recentes
          </h2>
          <Link
            href="/admin/orcamentos"
            className="text-sm font-medium text-wood-600 hover:text-wood-700"
          >
            Ver todos
          </Link>
        </div>
        {recentes.length === 0 ? (
          <p className="px-6 py-8 text-sm text-charcoal-400 text-center">
            Nenhum orçamento ainda.
          </p>
        ) : (
          <ul className="divide-y divide-charcoal-100">
            {recentes.map((orcamento) => (
              <li key={orcamento.id}>
                <Link
                  href={`/admin/orcamentos/${orcamento.id}`}
                  className="flex items-center justify-between px-6 py-4 hover:bg-charcoal-50/60 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-charcoal-800">
                      {orcamento.nome}
                    </p>
                    <p className="text-xs text-charcoal-500">
                      {orcamento.tipoProjeto}
                    </p>
                  </div>
                  <span className="text-xs font-medium text-charcoal-400">
                    {orcamento.status.replace("_", " ")}
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
