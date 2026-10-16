import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { resolverMes } from "@/lib/filtro-mes";

type FiltroMesNavProps = {
  basePath: string;
  mes: ReturnType<typeof resolverMes>;
  status?: string;
};

export default function FiltroMesNav({ basePath, mes, status }: FiltroMesNavProps) {
  const qs = (valor: string) => {
    const params = new URLSearchParams();
    params.set("mes", valor);
    if (status && status !== "TODOS") params.set("status", status);
    return `${basePath}?${params.toString()}`;
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      {mes ? (
        <>
          <Link
            href={qs(mes.anterior)}
            aria-label="Mês anterior"
            className="rounded-full border border-charcoal-200 bg-white p-2 text-charcoal-600 hover:bg-charcoal-50 transition-colors"
          >
            <ChevronLeft size={16} />
          </Link>
          <span className="min-w-[160px] text-center text-sm font-semibold text-charcoal-800">
            {mes.label}
          </span>
          <Link
            href={qs(mes.proximo)}
            aria-label="Próximo mês"
            className="rounded-full border border-charcoal-200 bg-white p-2 text-charcoal-600 hover:bg-charcoal-50 transition-colors"
          >
            <ChevronRight size={16} />
          </Link>
          <Link
            href={qs("todos")}
            className="ml-1 rounded-full px-3 py-1.5 text-xs font-medium text-charcoal-500 hover:bg-charcoal-50 transition-colors"
          >
            Ver todos os meses
          </Link>
        </>
      ) : (
        <>
          <span className="text-sm font-semibold text-charcoal-800">
            Todos os meses
          </span>
          <Link
            href={qs(
              `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`
            )}
            className="ml-1 rounded-full px-3 py-1.5 text-xs font-medium text-wood-600 hover:bg-wood-50 transition-colors"
          >
            Voltar para o mês atual
          </Link>
        </>
      )}
    </div>
  );
}
