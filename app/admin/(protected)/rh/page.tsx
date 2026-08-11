import Link from "next/link";
import { redirect } from "next/navigation";
import { Users, Umbrella, UserX, AlertTriangle } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import StatCard from "@/components/admin/StatCard";

export default async function RhPage() {
  const session = await auth();
  if (session?.user.role !== "ADMIN") {
    redirect("/admin");
  }

  const hoje = new Date();
  const em30Dias = new Date();
  em30Dias.setDate(em30Dias.getDate() + 30);

  const [ativos, deFeriasHoje, afastadosHoje, feriasVencendo] =
    await Promise.all([
      prisma.colaborador.count({ where: { dataDemissao: null } }),
      prisma.ferias.count({
        where: { dataGozoInicio: { lte: hoje }, dataGozoFim: { gte: hoje } },
      }),
      prisma.afastamento.count({
        where: {
          dataInicio: { lte: hoje },
          OR: [{ dataFim: null }, { dataFim: { gte: hoje } }],
        },
      }),
      prisma.ferias.count({
        where: { periodoAquisitivoFim: { gte: hoje, lte: em30Dias } },
      }),
    ]);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-charcoal-800 mb-1">RH</h1>
      <p className="text-sm text-charcoal-500 mb-8">
        Colaboradores, férias, afastamentos e ponto.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard label="Colaboradores ativos" value={ativos} icon={Users} />
        <StatCard label="De férias hoje" value={deFeriasHoje} icon={Umbrella} />
        <StatCard label="Afastados hoje" value={afastadosHoje} icon={UserX} />
        <StatCard
          label="Férias vencendo em 30 dias"
          value={feriasVencendo}
          icon={AlertTriangle}
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/admin/rh/colaboradores"
          className="rounded-full bg-white border border-charcoal-200 px-5 py-2.5 text-sm font-medium text-charcoal-700 hover:bg-charcoal-50 transition-colors"
        >
          Colaboradores
        </Link>
        <Link
          href="/admin/rh/ferias"
          className="rounded-full bg-white border border-charcoal-200 px-5 py-2.5 text-sm font-medium text-charcoal-700 hover:bg-charcoal-50 transition-colors"
        >
          Férias
        </Link>
        <Link
          href="/admin/rh/afastamentos"
          className="rounded-full bg-white border border-charcoal-200 px-5 py-2.5 text-sm font-medium text-charcoal-700 hover:bg-charcoal-50 transition-colors"
        >
          Afastamentos
        </Link>
        <Link
          href="/admin/rh/ponto"
          className="rounded-full bg-white border border-charcoal-200 px-5 py-2.5 text-sm font-medium text-charcoal-700 hover:bg-charcoal-50 transition-colors"
        >
          Ponto
        </Link>
      </div>
    </div>
  );
}
