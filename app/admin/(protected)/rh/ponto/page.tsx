import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import RegistroPontoManualForm from "@/components/admin/RegistroPontoManualForm";

function formatDateInput(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export default async function PontoPage({
  searchParams,
}: {
  searchParams: Promise<{ colaboradorId?: string; data?: string }>;
}) {
  const session = await auth();
  if (session?.user.role !== "ADMIN") {
    redirect("/admin");
  }

  const { colaboradorId, data } = await searchParams;

  const dataFiltro = data ? new Date(`${data}T00:00:00`) : new Date();
  const inicioDia = new Date(dataFiltro);
  inicioDia.setHours(0, 0, 0, 0);
  const fimDia = new Date(dataFiltro);
  fimDia.setHours(23, 59, 59, 999);

  const [todosColaboradores, colaboradoresAtivos, registros] =
    await Promise.all([
      prisma.colaborador.findMany({
        orderBy: { nome: "asc" },
        select: { id: true, nome: true },
      }),
      prisma.colaborador.findMany({
        where: { dataDemissao: null },
        orderBy: { nome: "asc" },
        select: { id: true, nome: true },
      }),
      prisma.ponto.findMany({
        where: {
          dataHora: { gte: inicioDia, lte: fimDia },
          ...(colaboradorId ? { colaboradorId } : {}),
        },
        orderBy: { dataHora: "desc" },
        include: { colaborador: { select: { nome: true } } },
      }),
    ]);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-charcoal-800 mb-1">Ponto</h1>
      <p className="text-sm text-charcoal-500 mb-6">
        Registros de entrada e saída. Colaboradores batem o próprio ponto em{" "}
        <span className="font-mono">/ponto</span>.
      </p>

      <form
        method="GET"
        className="flex flex-wrap items-end gap-4 mb-6 rounded-2xl border border-charcoal-100 bg-white p-4 shadow-sm"
      >
        <div>
          <label
            htmlFor="data"
            className="block text-xs font-medium text-charcoal-500 mb-1"
          >
            Data
          </label>
          <input
            id="data"
            name="data"
            type="date"
            defaultValue={formatDateInput(dataFiltro)}
            className="rounded-lg border border-charcoal-200 px-3 py-2 text-sm text-charcoal-800 focus:border-wood-500 focus:outline-none focus:ring-2 focus:ring-wood-200"
          />
        </div>
        <div>
          <label
            htmlFor="colaboradorId"
            className="block text-xs font-medium text-charcoal-500 mb-1"
          >
            Colaborador
          </label>
          <select
            id="colaboradorId"
            name="colaboradorId"
            defaultValue={colaboradorId ?? ""}
            className="rounded-lg border border-charcoal-200 px-3 py-2 text-sm text-charcoal-800 focus:border-wood-500 focus:outline-none focus:ring-2 focus:ring-wood-200"
          >
            <option value="">Todos</option>
            {todosColaboradores.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="rounded-full bg-charcoal-800 px-5 py-2 text-sm font-medium text-white hover:bg-charcoal-700 transition-colors"
        >
          Filtrar
        </button>
      </form>

      <div className="rounded-2xl border border-charcoal-100 bg-white shadow-sm overflow-hidden mb-8">
        {registros.length === 0 ? (
          <p className="px-6 py-10 text-sm text-charcoal-400 text-center">
            Nenhum registro nesse dia.
          </p>
        ) : (
          <ul className="divide-y divide-charcoal-100">
            {registros.map((registro) => (
              <li
                key={registro.id}
                className="flex items-center justify-between px-6 py-4"
              >
                <div>
                  <p className="text-sm font-medium text-charcoal-800">
                    {registro.colaborador.nome}
                  </p>
                  <p className="text-xs text-charcoal-500">
                    {registro.dataHora.toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {registro.notasInternas
                      ? ` · ${registro.notasInternas}`
                      : ""}
                  </p>
                </div>
                <span
                  className={`text-xs font-medium rounded-full px-2.5 py-1 ${
                    registro.tipo === "ENTRADA"
                      ? "bg-moss-50 text-moss-700"
                      : "bg-charcoal-100 text-charcoal-600"
                  }`}
                >
                  {registro.tipo === "ENTRADA" ? "Entrada" : "Saída"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <RegistroPontoManualForm colaboradores={colaboradoresAtivos} />
    </div>
  );
}
