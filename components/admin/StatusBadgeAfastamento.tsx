type StatusBadgeAfastamentoProps = {
  dataFim: Date | null;
};

export default function StatusBadgeAfastamento({
  dataFim,
}: StatusBadgeAfastamentoProps) {
  const encerrado = dataFim !== null && dataFim < new Date();

  if (encerrado) {
    return (
      <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium bg-charcoal-100 text-charcoal-500">
        Encerrado
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium bg-red-50 text-red-700">
      Ativo
    </span>
  );
}
