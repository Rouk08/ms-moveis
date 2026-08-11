import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import StatusBadgeColaborador from "@/components/admin/StatusBadgeColaborador";

const filters = [
  { label: "Ativos", value: "ATIVOS" },
  { label: "Desligados", value: "DESLIGADOS" },
  { label: "Todos", value: "TODOS" },
] as const;

export default async function ColaboradoresPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const session = await auth();
  if (session?.user.role !== "ADMIN") {
    redirect("/admin");
  }

  const { status } = await searchParams;
  const activeStatus = filters.some((f) => f.value === status)
    ? (status as (typeof filters)[number]["value"])
    : "ATIVOS";

  const where =
    activeStatus === "ATIVOS"
      ? { dataDemissao: null }
      : activeStatus === "DESLIGADOS"
        ? { dataDemissao: { not: null } }
        : {};

  const hoje = new Date();

  const colaboradores = await prisma.colaborador.findMany({
    where,
    orderBy: { nome: "asc" },
    include: {
      afastamentos: {
        where: {
          dataInicio: { lte: hoje },
          OR: [{ dataFim: null }, { dataFim: { gte: hoje } }],
        },
        take: 1,
      },
      ferias: {
        where: { dataGozoInicio: { lte: hoje }, dataGozoFim: { gte: hoje } },
        take: 1,
      },
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-charcoal-800">
            Colaboradores
          </h1>
          <p className="text-sm text-charcoal-500">
            {colaboradores.length}{" "}
            {colaboradores.length === 1 ? "colaborador" : "colaboradores"}
          </p>
        </div>
        <Link
          href="/admin/rh/colaboradores/novo"
          className="inline-flex items-center gap-2 rounded-full bg-wood-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-wood-600 transition-colors"
        >
          <Plus size={16} />
          Novo colaborador
        </Link>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map((filter) => (
          <Link
            key={filter.value}
            href={
              filter.value === "ATIVOS"
                ? "/admin/rh/colaboradores"
                : `/admin/rh/colaboradores?status=${filter.value}`
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
        {colaboradores.length === 0 ? (
          <p className="px-6 py-10 text-sm text-charcoal-400 text-center">
            Nenhum colaborador encontrado.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-charcoal-100 text-left text-xs uppercase tracking-wide text-charcoal-400">
                  <th className="px-6 py-3 font-medium">Nome</th>
                  <th className="px-6 py-3 font-medium">Cargo</th>
                  <th className="px-6 py-3 font-medium">Telefone</th>
                  <th className="px-6 py-3 font-medium">Admissão</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-100">
                {colaboradores.map((colaborador) => (
                  <tr
                    key={colaborador.id}
                    className="hover:bg-charcoal-50/60 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/rh/colaboradores/${colaborador.id}`}
                        className="block font-medium text-charcoal-800"
                      >
                        {colaborador.nome}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-charcoal-600">
                      <Link href={`/admin/rh/colaboradores/${colaborador.id}`}>
                        {colaborador.cargo}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-charcoal-500">
                      <Link href={`/admin/rh/colaboradores/${colaborador.id}`}>
                        {colaborador.telefone || "—"}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-charcoal-500">
                      <Link href={`/admin/rh/colaboradores/${colaborador.id}`}>
                        {colaborador.dataAdmissao.toLocaleDateString("pt-BR")}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/admin/rh/colaboradores/${colaborador.id}`}>
                        <StatusBadgeColaborador
                          dataDemissao={colaborador.dataDemissao}
                          afastamentoAtivo={colaborador.afastamentos.length > 0}
                          feriasAtiva={colaborador.ferias.length > 0}
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
