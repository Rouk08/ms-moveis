import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import StatusBadgeFerias, {
  computeStatusFerias,
  type StatusFerias,
} from "@/components/admin/StatusBadgeFerias";

const filters: { label: string; value: StatusFerias | "TODAS" }[] = [
  { label: "Todas", value: "TODAS" },
  { label: "A vencer", value: "A_VENCER" },
  { label: "Em gozo", value: "EM_GOZO" },
  { label: "Vencidas", value: "VENCIDAS" },
  { label: "Gozadas", value: "GOZADAS" },
];

export default async function FeriasPage({
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
    : "TODAS";

  const todasFerias = await prisma.ferias.findMany({
    orderBy: { periodoAquisitivoInicio: "desc" },
    include: { colaborador: { select: { nome: true } } },
  });

  const ferias =
    activeStatus === "TODAS"
      ? todasFerias
      : todasFerias.filter((f) => computeStatusFerias(f) === activeStatus);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-charcoal-800">
            Férias
          </h1>
          <p className="text-sm text-charcoal-500">
            {ferias.length} {ferias.length === 1 ? "registro" : "registros"}
          </p>
        </div>
        <Link
          href="/admin/rh/ferias/novo"
          className="inline-flex items-center gap-2 rounded-full bg-wood-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-wood-600 transition-colors"
        >
          <Plus size={16} />
          Nova
        </Link>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map((filter) => (
          <Link
            key={filter.value}
            href={
              filter.value === "TODAS"
                ? "/admin/rh/ferias"
                : `/admin/rh/ferias?status=${filter.value}`
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
        {ferias.length === 0 ? (
          <p className="px-6 py-10 text-sm text-charcoal-400 text-center">
            Nenhum registro encontrado.
          </p>
        ) : (
          <ul className="divide-y divide-charcoal-100">
            {ferias.map((item) => (
              <li key={item.id}>
                <Link
                  href={`/admin/rh/ferias/${item.id}`}
                  className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-charcoal-50/60 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-charcoal-800">
                      {item.colaborador.nome}
                    </p>
                    <p className="text-xs text-charcoal-500">
                      {item.periodoAquisitivoInicio.toLocaleDateString(
                        "pt-BR"
                      )}{" "}
                      – {item.periodoAquisitivoFim.toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <StatusBadgeFerias
                    periodoAquisitivoFim={item.periodoAquisitivoFim}
                    diasDireito={item.diasDireito}
                    diasGozados={item.diasGozados}
                    dataGozoInicio={item.dataGozoInicio}
                    dataGozoFim={item.dataGozoFim}
                  />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
