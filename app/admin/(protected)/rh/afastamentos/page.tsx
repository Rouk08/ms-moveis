import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import StatusBadgeAfastamento from "@/components/admin/StatusBadgeAfastamento";

const tipoLabels: Record<string, string> = {
  ATESTADO: "Atestado",
  LICENCA_MEDICA: "Licença médica",
  INSS_AUXILIO_DOENCA: "INSS / Auxílio-doença",
  MATERNIDADE: "Maternidade",
  PATERNIDADE: "Paternidade",
  LUTO: "Luto",
  OUTROS: "Outros",
};

const filters = [
  { label: "Todos", value: "TODOS" },
  { label: "Ativos", value: "ATIVO" },
  { label: "Encerrados", value: "ENCERRADO" },
] as const;

export default async function AfastamentosPage({
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
    : "TODOS";

  const hoje = new Date();

  const todos = await prisma.afastamento.findMany({
    orderBy: { dataInicio: "desc" },
    include: { colaborador: { select: { nome: true } } },
  });

  const afastamentos = todos.filter((a) => {
    if (activeStatus === "TODOS") return true;
    const encerrado = a.dataFim !== null && a.dataFim < hoje;
    return activeStatus === "ENCERRADO" ? encerrado : !encerrado;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-charcoal-800">
            Afastamentos
          </h1>
          <p className="text-sm text-charcoal-500">
            {afastamentos.length}{" "}
            {afastamentos.length === 1 ? "registro" : "registros"}
          </p>
        </div>
        <Link
          href="/admin/rh/afastamentos/novo"
          className="inline-flex items-center gap-2 rounded-full bg-wood-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-wood-600 transition-colors"
        >
          <Plus size={16} />
          Novo
        </Link>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map((filter) => (
          <Link
            key={filter.value}
            href={
              filter.value === "TODOS"
                ? "/admin/rh/afastamentos"
                : `/admin/rh/afastamentos?status=${filter.value}`
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
        {afastamentos.length === 0 ? (
          <p className="px-6 py-10 text-sm text-charcoal-400 text-center">
            Nenhum registro encontrado.
          </p>
        ) : (
          <ul className="divide-y divide-charcoal-100">
            {afastamentos.map((item) => (
              <li key={item.id}>
                <Link
                  href={`/admin/rh/afastamentos/${item.id}`}
                  className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-charcoal-50/60 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-charcoal-800">
                      {item.colaborador.nome}
                    </p>
                    <p className="text-xs text-charcoal-500">
                      {tipoLabels[item.tipo]} ·{" "}
                      {item.dataInicio.toLocaleDateString("pt-BR")}
                      {item.dataFim
                        ? ` – ${item.dataFim.toLocaleDateString("pt-BR")}`
                        : " – em aberto"}
                    </p>
                  </div>
                  <StatusBadgeAfastamento dataFim={item.dataFim} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
