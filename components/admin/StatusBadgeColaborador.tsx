type StatusBadgeColaboradorProps = {
  dataDemissao: Date | null;
  afastamentoAtivo: boolean;
  feriasAtiva: boolean;
};

export default function StatusBadgeColaborador({
  dataDemissao,
  afastamentoAtivo,
  feriasAtiva,
}: StatusBadgeColaboradorProps) {
  if (dataDemissao) {
    return (
      <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium bg-charcoal-100 text-charcoal-500">
        Desligado
      </span>
    );
  }

  if (afastamentoAtivo) {
    return (
      <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium bg-red-50 text-red-700">
        Afastado
      </span>
    );
  }

  if (feriasAtiva) {
    return (
      <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium bg-amber-50 text-amber-700">
        Férias
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium bg-moss-50 text-moss-700">
      Ativo
    </span>
  );
}
