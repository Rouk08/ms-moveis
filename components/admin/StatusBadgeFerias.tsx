export type StatusFerias = "GOZADAS" | "EM_GOZO" | "VENCIDAS" | "A_VENCER";

type FeriasDatas = {
  periodoAquisitivoFim: Date;
  diasDireito: number;
  diasGozados: number;
  dataGozoInicio: Date | null;
  dataGozoFim: Date | null;
};

export function computeStatusFerias({
  periodoAquisitivoFim,
  diasDireito,
  diasGozados,
  dataGozoInicio,
  dataGozoFim,
}: FeriasDatas): StatusFerias {
  const hoje = new Date();

  if (diasGozados >= diasDireito) return "GOZADAS";

  if (
    dataGozoInicio &&
    dataGozoFim &&
    dataGozoInicio <= hoje &&
    hoje <= dataGozoFim
  ) {
    return "EM_GOZO";
  }

  if (periodoAquisitivoFim < hoje) return "VENCIDAS";

  return "A_VENCER";
}

const labels: Record<StatusFerias, string> = {
  GOZADAS: "Gozadas",
  EM_GOZO: "Em gozo",
  VENCIDAS: "Vencidas",
  A_VENCER: "A vencer",
};

const styles: Record<StatusFerias, string> = {
  GOZADAS: "bg-moss-50 text-moss-700",
  EM_GOZO: "bg-amber-50 text-amber-700",
  VENCIDAS: "bg-red-50 text-red-700",
  A_VENCER: "bg-blue-50 text-blue-700",
};

export default function StatusBadgeFerias(props: FeriasDatas) {
  const status = computeStatusFerias(props);
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}
