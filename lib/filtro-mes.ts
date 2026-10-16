// Filtro de mês nas listas de financeiro — "todos" desliga o filtro,
// qualquer outro valor ausente/ inválido cai no mês atual.
export function resolverMes(mesParam?: string) {
  if (mesParam === "todos") return null;

  const hoje = new Date();
  let ano = hoje.getFullYear();
  let mesIndex = hoje.getMonth();

  if (mesParam && /^\d{4}-\d{2}$/.test(mesParam)) {
    const [anoStr, mesStr] = mesParam.split("-");
    ano = Number(anoStr);
    mesIndex = Number(mesStr) - 1;
  }

  const start = new Date(ano, mesIndex, 1);
  const end = new Date(ano, mesIndex + 1, 0, 23, 59, 59, 999);

  const formatarChave = (data: Date) =>
    `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}`;

  const anteriorDate = new Date(ano, mesIndex - 1, 1);
  const proximoDate = new Date(ano, mesIndex + 1, 1);

  const label = start
    .toLocaleDateString("pt-BR", { month: "long", year: "numeric" })
    .replace(/^\w/, (c) => c.toUpperCase());

  return {
    start,
    end,
    atual: formatarChave(start),
    anterior: formatarChave(anteriorDate),
    proximo: formatarChave(proximoDate),
    label,
  };
}
