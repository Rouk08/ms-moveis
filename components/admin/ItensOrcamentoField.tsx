"use client";

import { itensPorCategoria } from "@/lib/data";

export type ItemOrcamento = {
  categoria: string;
  item: string;
  valorUnitario: string;
};

type ItensOrcamentoFieldProps = {
  tipoProjeto: string[];
  itens: ItemOrcamento[];
  onChange: (itens: ItemOrcamento[]) => void;
};

export function totalItens(itens: ItemOrcamento[]): number {
  return itens.reduce(
    (soma, i) => soma + (parseFloat(i.valorUnitario.replace(",", ".")) || 0),
    0
  );
}

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function ItensOrcamentoField({
  tipoProjeto,
  itens,
  onChange,
}: ItensOrcamentoFieldProps) {
  const categoriasComItens = tipoProjeto.filter(
    (tipo) => itensPorCategoria[tipo]
  );

  if (categoriasComItens.length === 0) return null;

  const toggleItem = (categoria: string, item: string) => {
    const existe = itens.some(
      (i) => i.categoria === categoria && i.item === item
    );
    if (existe) {
      onChange(
        itens.filter((i) => !(i.categoria === categoria && i.item === item))
      );
    } else {
      onChange([...itens, { categoria, item, valorUnitario: "" }]);
    }
  };

  const updateValor = (categoria: string, item: string, valor: string) => {
    onChange(
      itens.map((i) =>
        i.categoria === categoria && i.item === item
          ? { ...i, valorUnitario: valor }
          : i
      )
    );
  };

  const total = totalItens(itens);

  return (
    <div className="space-y-5">
      {categoriasComItens.map((categoria) => (
        <div key={categoria}>
          <span className="block text-sm font-medium text-charcoal-700 mb-1.5">
            Itens de {categoria.toLowerCase()}
          </span>
          <div className="space-y-2">
            {itensPorCategoria[categoria].map((item) => {
              const selecionado = itens.find(
                (i) => i.categoria === categoria && i.item === item
              );
              return (
                <div
                  key={item}
                  className={`flex flex-wrap items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors ${
                    selecionado
                      ? "border-wood-500 bg-wood-50"
                      : "border-charcoal-200"
                  }`}
                >
                  <label className="flex flex-1 min-w-[200px] items-center gap-2 text-sm text-charcoal-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!selecionado}
                      onChange={() => toggleItem(categoria, item)}
                      className="h-4 w-4 rounded border-charcoal-300 text-wood-500 focus:ring-wood-200"
                    />
                    {item}
                  </label>
                  {selecionado && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-charcoal-400">R$</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="Valor unitário"
                        value={selecionado.valorUnitario}
                        onChange={(e) =>
                          updateValor(categoria, item, e.target.value)
                        }
                        className="w-32 rounded-lg border border-charcoal-200 px-3 py-1.5 text-sm text-charcoal-800 focus:border-wood-500 focus:outline-none focus:ring-2 focus:ring-wood-200"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {itens.length > 0 && (
        <div className="flex items-center justify-between rounded-lg bg-wood-50 px-4 py-3">
          <span className="text-sm font-medium text-charcoal-700">
            Total dos itens ({itens.length})
          </span>
          <span className="text-base font-semibold text-wood-700">
            {formatBRL(total)}
          </span>
        </div>
      )}
    </div>
  );
}
