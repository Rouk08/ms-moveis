import type { StatusRecebimento } from "@/lib/generated/prisma/enums";

type StatusBadgeRecebimentoProps = {
  status: StatusRecebimento;
  vencimento: Date;
};

export default function StatusBadgeRecebimento({
  status,
  vencimento,
}: StatusBadgeRecebimentoProps) {
  if (status === "RECEBIDO") {
    return (
      <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium bg-moss-50 text-moss-700">
        Recebido
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
