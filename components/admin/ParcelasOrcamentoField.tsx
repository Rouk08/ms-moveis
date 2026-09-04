"use client";

import { Plus, Trash2 } from "lucide-react";

export type ParcelaOrcamento = {
  descricao: string;
  valor: string;
  vencimento: string;
};

type ParcelasOrcamentoFieldProps = {
  parcelas: ParcelaOrcamento[];
  onChange: (parcelas: ParcelaOrcamento[]) => void;
  valorReferencia: number;
};

export function totalParcelas(parcelas: ParcelaOrcamento[]): number {
  return parcelas.reduce(
    (soma, p) => soma + (parseFloat(p.valor.replace(",", ".")) || 0),
    0
  );
}

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const inputClass =
  "w-full rounded-lg border border-charcoal-200 px-3 py-2 text-sm text-charcoal-800 focus:border-wood-500 focus:outline-none focus:ring-2 focus:ring-wood-200";

export default function ParcelasOrcamentoField({
  parcelas,
  onChange,
  valorReferencia,
}: ParcelasOrcamentoFieldProps) {
  const adicionar = () => {
    onChange([...parcelas, { descricao: "", valor: "", vencimento: "" }]);
  };

  const remover = (index: number) => {
    onChange(parcelas.filter((_, i) => i !== index));
  };

  const atualizar = (
    index: number,
    campo: keyof ParcelaOrcamento,
    valor: string
  ) => {
    onChange(
      parcelas.map((p, i) => (i === index ? { ...p, [campo]: valor } : p))
    );
  };

  const total = totalParcelas(parcelas);
  const diferenca = valorReferencia - total;

  return (
    <div>
      <span className="block text-sm font-medium text-charcoal-700 mb-1.5">
        Condições de pagamento
      </span>
      <div className="space-y-2">
        {parcelas.map((parcela, index) => (
          <div
            key={index}
            className="grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr_auto] gap-2 items-start rounded-lg border border-charcoal-200 p-3"
          >
            <input
              type="text"
              placeholder="Descrição (ex: Sinal, Entrega...)"
              value={parcela.descricao}
              onChange={(e) => atualizar(index, "descricao", e.target.value)}
              className={inputClass}
            />
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="Valor (R$)"
              value={parcela.valor}
              onChange={(e) => atualizar(index, "valor", e.target.value)}
              className={inputClass}
            />
            <input
              type="text"
              placeholder="Vencimento (ex: Na assinatura)"
              value={parcela.vencimento}
              onChange={(e) => atualizar(index, "vencimento", e.target.value)}
              className={inputClass}
            />
            <button
              type="button"
              onClick={() => remover(index)}
              className="justify-self-end rounded-lg p-2 text-charcoal-400 hover:bg-red-50 hover:text-red-600 transition-colors"
              title="Remover parcela"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={adicionar}
        className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-charcoal-100 px-3 py-2 text-sm font-medium text-charcoal-700 hover:bg-charcoal-200 transition-colors"
      >
        <Plus size={15} />
        Adicionar parcela
      </button>

      {parcelas.length > 0 && (
        <div className="mt-3 flex items-center justify-between rounded-lg bg-wood-50 px-4 py-3">
          <span className="text-sm font-medium text-charcoal-700">
            Total das parcelas ({parcelas.length})
          </span>
          <span className="text-base font-semibold text-wood-700">
            {formatBRL(total)}
          </span>
        </div>
      )}
      {parcelas.length > 0 && Math.abs(diferenca) > 0.01 && (
        <p className="mt-1.5 text-xs text-red-600">
          {diferenca > 0
            ? `Faltam ${formatBRL(diferenca)} para bater com o valor do orçamento.`
            : `As parcelas somam ${formatBRL(-diferenca)} a mais que o valor do orçamento.`}
        </p>
      )}
    </div>
  );
}
