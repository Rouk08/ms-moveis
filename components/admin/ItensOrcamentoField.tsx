"use client";

import { useState } from "react";
import { MessageSquarePlus } from "lucide-react";
import { itensPorCategoria } from "@/lib/data";

export type ItemOrcamento = {
  categoria: string;
  item: string;
  valorUnitario: string;
  observacao: string;
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

function chaveItem(categoria: string, item: string) {
  return `${categoria}::${item}`;
}

export default function ItensOrcamentoField({
  tipoProjeto,
  itens,
  onChange,
}: ItensOrcamentoFieldProps) {
  const [notasAbertas, setNotasAbertas] = useState<Set<string>>(
    () =>
      new Set(
        itens
          .filter((i) => i.observacao.trim())
          .map((i) => chaveItem(i.categoria, i.item))
      )
  );

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
      onChange([
        ...itens,
        { categoria, item, valorUnitario: "", observacao: "" },
      ]);
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

  const updateObservacao = (
    categoria: string,
    item: string,
    observacao: string
  ) => {
    onChange(
      itens.map((i) =>
        i.categoria === categoria && i.item === item
          ? { ...i, observacao }
          : i
      )
    );
  };

  const abrirNota = (categoria: string, item: string) => {
    setNotasAbertas((prev) => new Set(prev).add(chaveItem(categoria, item)));
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
              const notaAberta = notasAbertas.has(chaveItem(categoria, item));

              return (
                <div
                  key={item}
                  className={`rounded-lg border px-3 py-2.5 transition-colors ${
                    selecionado
                      ? "border-wood-500 bg-wood-50"
                      : "border-charcoal-200"
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-3">
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

                  {selecionado && (
                    <div className="mt-2 pl-6">
                      {notaAberta ? (
                        <input
                          type="text"
                          placeholder="Observação (opcional) — cor, medida, detalhe combinado..."
                          value={selecionado.observacao}
                          onChange={(e) =>
                            updateObservacao(categoria, item, e.target.value)
                          }
                          className="w-full rounded-lg border border-charcoal-200 px-3 py-1.5 text-sm text-charcoal-800 focus:border-wood-500 focus:outline-none focus:ring-2 focus:ring-wood-200"
                        />
                      ) : (
                        <button
                          type="button"
                          onClick={() => abrirNota(categoria, item)}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-charcoal-400 hover:text-wood-600 transition-colors"
                        >
                          <MessageSquarePlus size={13} />
                          Adicionar observação
                        </button>
                      )}
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
