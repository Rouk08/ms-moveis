import type { OrcamentoStatus } from "@/lib/generated/prisma/enums";

const styles: Record<OrcamentoStatus, string> = {
  NOVO: "bg-blue-50 text-blue-700",
  EM_ANDAMENTO: "bg-amber-50 text-amber-700",
  APROVADO: "bg-moss-50 text-moss-700",
  RECUSADO: "bg-red-50 text-red-700",
};

const labels: Record<OrcamentoStatus, string> = {
  NOVO: "Novo",
  EM_ANDAMENTO: "Em andamento",
  APROVADO: "Aprovado",
  RECUSADO: "Recusado",
};

export default function StatusBadge({ status }: { status: OrcamentoStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}
