import type { StatusContrato } from "@/lib/generated/prisma/enums";

const styles: Record<StatusContrato, string> = {
  RASCUNHO: "bg-charcoal-100 text-charcoal-600",
  GERADO: "bg-blue-50 text-blue-700",
  ASSINADO: "bg-moss-50 text-moss-700",
};

const labels: Record<StatusContrato, string> = {
  RASCUNHO: "Rascunho",
  GERADO: "Gerado",
  ASSINADO: "Assinado",
};

export default function StatusBadgeContrato({
  status,
}: {
  status: StatusContrato;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}
