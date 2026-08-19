export type OrcamentoItemInput = {
  categoria: string;
  item: string;
  valorUnitario: string;
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
      return { categoria, item, valorUnitario };
    })
    .filter((entry) => entry.categoria && entry.item);
}
