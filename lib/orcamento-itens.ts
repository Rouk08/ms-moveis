export type OrcamentoItemInput = {
  categoria: string;
  item: string;
  valorUnitario: string;
  observacao: string;
};

export function parseItensFromBody(body: unknown): OrcamentoItemInput[] {
  const raw = (body as { itens?: unknown })?.itens;
  if (!Array.isArray(raw)) return [];

  return raw
    .map((entry) => {
      const categoria = String((entry as { categoria?: unknown })?.categoria ?? "").trim();
      const item = String((entry as { item?: unknown })?.item ?? "").trim();
      const valorUnitario = String(
        (entry as { valorUnitario?: unknown })?.valorUnitario ?? "0"
      ).trim();
      const observacao = String(
        (entry as { observacao?: unknown })?.observacao ?? ""
      ).trim();
      return { categoria, item, valorUnitario, observacao };
    })
    .filter((entry) => entry.categoria && entry.item);
}
