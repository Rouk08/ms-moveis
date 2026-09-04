export type OrcamentoParcelaInput = {
  descricao: string;
  valor: string;
  vencimento: string;
};

export function parseParcelasFromBody(body: unknown): OrcamentoParcelaInput[] {
  const raw = (body as { parcelas?: unknown })?.parcelas;
  if (!Array.isArray(raw)) return [];

  return raw
    .map((entry) => {
      const descricao = String(
        (entry as { descricao?: unknown })?.descricao ?? ""
      ).trim();
      const valor = String((entry as { valor?: unknown })?.valor ?? "0").trim();
      const vencimento = String(
        (entry as { vencimento?: unknown })?.vencimento ?? ""
      ).trim();
      return { descricao, valor, vencimento };
    })
    .filter((entry) => entry.descricao);
}
