import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import FiltroMesNav from "@/components/admin/FiltroMesNav";
import { resolverMes } from "@/lib/filtro-mes";

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default async function AportesPage({
  searchParams,
}: {
  searchParams: Promise<{ mes?: string }>;
}) {
  const { mes: mesParam } = await searchParams;
  const mes = resolverMes(mesParam);

  const aportes = await prisma.aporte.findMany({
    where: mes ? { data: { gte: mes.start, lte: mes.end } } : {},
    orderBy: { data: "desc" },
  });

  const total = aportes.reduce((soma, a) => soma + Number(a.valor), 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-charcoal-800">
            Aportes dos sócios
          </h1>
          <p className="text-sm text-charcoal-500">
            {aportes.length} {aportes.length === 1 ? "aporte" : "aportes"} ·{" "}
            {formatBRL(total)}
          </p>
        </div>
        <Link
          href="/admin/financeiro/aportes/novo"
          className="inline-flex items-center gap-2 rounded-full bg-wood-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-wood-600 transition-colors"
        >
          <Plus size={16} />
          Novo aporte
        </Link>
      </div>

      <FiltroMesNav basePath="/admin/financeiro/aportes" mes={mes} />

      <div className="rounded-2xl border border-charcoal-100 bg-white shadow-sm overflow-hidden">
        {aportes.length === 0 ? (
          <p className="px-6 py-10 text-sm text-charcoal-400 text-center">
            Nenhum aporte encontrado.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-charcoal-100 text-left text-xs uppercase tracking-wide text-charcoal-400">
                  <th className="px-6 py-3 font-medium">Sócio</th>
                  <th className="px-6 py-3 font-medium">Observação</th>
                  <th className="px-6 py-3 font-medium">Valor</th>
                  <th className="px-6 py-3 font-medium">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-100">
                {aportes.map((aporte) => (
                  <tr
                    key={aporte.id}
                    className="hover:bg-charcoal-50/60 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/financeiro/aportes/${aporte.id}`}
                        className="font-medium text-charcoal-800"
                      >
                        {aporte.socio}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-charcoal-500">
                      <Link href={`/admin/financeiro/aportes/${aporte.id}`}>
                        {aporte.observacao || "—"}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-moss-600 font-medium">
                      <Link href={`/admin/financeiro/aportes/${aporte.id}`}>
                        {formatBRL(Number(aporte.valor))}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-charcoal-500">
                      <Link href={`/admin/financeiro/aportes/${aporte.id}`}>
                        {aporte.data.toLocaleDateString("pt-BR")}
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
