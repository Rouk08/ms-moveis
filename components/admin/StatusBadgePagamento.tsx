import type { StatusPagamento } from "@/lib/generated/prisma/enums";

type StatusBadgePagamentoProps = {
  status: StatusPagamento;
  vencimento: Date;
};

export default function StatusBadgePagamento({
  status,
  vencimento,
}: StatusBadgePagamentoProps) {
  if (status === "PAGO") {
    return (
      <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium bg-moss-50 text-moss-700">
        Pago
      </span>
    );
  }

  const atrasado = vencimento < new Date();

  if (atrasado) {
    return (
      <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium bg-red-50 text-red-700">
        Atrasado
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium bg-amber-50 text-amber-700">
      Pendente
    </span>
  );
}
