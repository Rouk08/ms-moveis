"use client";

export type DescontoTipo = "valor" | "percentual";

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function calcDescontoValor(
  tipo: DescontoTipo,
  input: string,
  base: number
): number {
  const num = parseFloat(input.replace(",", ".")) || 0;
  if (tipo === "percentual") {
    return Math.max(0, (base * num) / 100);
  }
  return Math.max(0, num);
}

type DescontoFieldProps = {
  tipo: DescontoTipo;
  onTipoChange: (tipo: DescontoTipo) => void;
  valor: string;
  onValorChange: (valor: string) => void;
  base: number;
};

export default function DescontoField({
  tipo,
  onTipoChange,
  valor,
  onValorChange,
  base,
}: DescontoFieldProps) {
  const descontoCalculado = calcDescontoValor(tipo, valor, base);

  return (
    <div>
      <label
        htmlFor="desconto"
        className="block text-sm font-medium text-charcoal-700 mb-1.5"
      >
        Desconto
      </label>
      <div className="flex gap-2">
        <select
          value={tipo}
          onChange={(e) => onTipoChange(e.target.value as DescontoTipo)}
          className="rounded-lg border border-charcoal-200 px-3 py-2.5 text-sm text-charcoal-800 focus:border-wood-500 focus:outline-none focus:ring-2 focus:ring-wood-200"
        >
          <option value="percentual">%</option>
          <option value="valor">R$</option>
        </select>
        <input
          id="desconto"
          type="number"
          step="0.01"
          min="0"
          value={valor}
          onChange={(e) => onValorChange(e.target.value)}
          placeholder={tipo === "percentual" ? "0" : "0,00"}
          className="flex-1 rounded-lg border border-charcoal-200 px-4 py-2.5 text-charcoal-800 focus:border-wood-500 focus:outline-none focus:ring-2 focus:ring-wood-200"
        />
      </div>
      <p className="mt-1.5 text-xs text-charcoal-400">
        {tipo === "percentual" && descontoCalculado > 0
          ? `Equivale a ${formatBRL(descontoCalculado)} de desconto.`
          : "Opcional. Subtraído do valor para calcular o total final."}
      </p>
    </div>
  );
}
