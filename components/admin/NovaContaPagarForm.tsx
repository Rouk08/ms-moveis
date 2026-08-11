"use client";

import { useState, type FormEvent } from "react";

const categoriaOptions = [
  { value: "MATERIAL", label: "Material" },
  { value: "FORNECEDOR", label: "Fornecedor" },
  { value: "SALARIOS", label: "Salários" },
  { value: "ALUGUEL", label: "Aluguel" },
  { value: "IMPOSTOS", label: "Impostos" },
  { value: "MARKETING", label: "Marketing" },
  { value: "OUTROS", label: "Outros" },
];

const frequenciaOptions = [
  { value: "SEMANAL", label: "Semanal" },
  { value: "MENSAL", label: "Mensal" },
  { value: "TRIMESTRAL", label: "Trimestral" },
  { value: "ANUAL", label: "Anual" },
];

export default function NovaContaPagarForm() {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [recorrente, setRecorrente] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setPending(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      descricao: String(formData.get("descricao") ?? "").trim(),
      fornecedor: String(formData.get("fornecedor") ?? "").trim(),
      categoria: String(formData.get("categoria") ?? "OUTROS"),
      valor: String(formData.get("valor") ?? "").trim(),
      vencimento: String(formData.get("vencimento") ?? "").trim(),
      notasInternas: String(formData.get("notasInternas") ?? "").trim(),
      recorrente,
      frequenciaRecorrencia: String(
        formData.get("frequenciaRecorrencia") ?? "MENSAL"
      ),
      totalOcorrencias: String(formData.get("totalOcorrencias") ?? "12"),
    };

    try {
      const res = await fetch("/api/contas-pagar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Não foi possível salvar a conta.");
        setPending(false);
        return;
      }

      window.location.href =
        data.count > 1
          ? "/admin/financeiro/contas-a-pagar"
          : `/admin/financeiro/contas-a-pagar/${data.id}`;
    } catch {
      setError("Não foi possível salvar a conta. Tente novamente.");
      setPending(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-charcoal-100 bg-white p-6 shadow-sm space-y-5"
    >
      <div>
        <label
          htmlFor="descricao"
          className="block text-sm font-medium text-charcoal-700 mb-1.5"
        >
          Descrição *
        </label>
        <input
          id="descricao"
          name="descricao"
          type="text"
          required
          className="w-full rounded-lg border border-charcoal-200 px-4 py-2.5 text-charcoal-800 focus:border-wood-500 focus:outline-none focus:ring-2 focus:ring-wood-200"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label
            htmlFor="fornecedor"
            className="block text-sm font-medium text-charcoal-700 mb-1.5"
          >
            Fornecedor
          </label>
          <input
            id="fornecedor"
            name="fornecedor"
            type="text"
            className="w-full rounded-lg border border-charcoal-200 px-4 py-2.5 text-charcoal-800 focus:border-wood-500 focus:outline-none focus:ring-2 focus:ring-wood-200"
          />
        </div>
        <div>
          <label
            htmlFor="categoria"
            className="block text-sm font-medium text-charcoal-700 mb-1.5"
          >
            Categoria
          </label>
          <select
            id="categoria"
            name="categoria"
            defaultValue="OUTROS"
            className="w-full rounded-lg border border-charcoal-200 px-4 py-2.5 text-charcoal-800 focus:border-wood-500 focus:outline-none focus:ring-2 focus:ring-wood-200"
          >
            {categoriaOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label
            htmlFor="valor"
            className="block text-sm font-medium text-charcoal-700 mb-1.5"
          >
            Valor (R$) *
          </label>
          <input
            id="valor"
            name="valor"
            type="number"
            step="0.01"
            min="0"
            required
            placeholder="0,00"
            className="w-full rounded-lg border border-charcoal-200 px-4 py-2.5 text-charcoal-800 focus:border-wood-500 focus:outline-none focus:ring-2 focus:ring-wood-200"
          />
        </div>
        <div>
          <label
            htmlFor="vencimento"
            className="block text-sm font-medium text-charcoal-700 mb-1.5"
          >
            Vencimento *
          </label>
          <input
            id="vencimento"
            name="vencimento"
            type="date"
            required
            className="w-full rounded-lg border border-charcoal-200 px-4 py-2.5 text-charcoal-800 focus:border-wood-500 focus:outline-none focus:ring-2 focus:ring-wood-200"
          />
        </div>
      </div>

      <div className="rounded-lg border border-charcoal-100 p-4">
        <label className="flex items-center gap-2.5 text-sm font-medium text-charcoal-700">
          <input
            type="checkbox"
            checked={recorrente}
            onChange={(e) => setRecorrente(e.target.checked)}
            className="h-4 w-4 rounded border-charcoal-300 text-wood-500 focus:ring-wood-200"
          />
          Conta recorrente
        </label>

        {recorrente && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="frequenciaRecorrencia"
                className="block text-sm font-medium text-charcoal-700 mb-1.5"
              >
                Frequência
              </label>
              <select
                id="frequenciaRecorrencia"
                name="frequenciaRecorrencia"
                defaultValue="MENSAL"
                className="w-full rounded-lg border border-charcoal-200 px-4 py-2.5 text-charcoal-800 focus:border-wood-500 focus:outline-none focus:ring-2 focus:ring-wood-200"
              >
                {frequenciaOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="totalOcorrencias"
                className="block text-sm font-medium text-charcoal-700 mb-1.5"
              >
                Repetir quantas vezes
              </label>
              <input
                id="totalOcorrencias"
                name="totalOcorrencias"
                type="number"
                min="2"
                max="60"
                defaultValue="12"
                className="w-full rounded-lg border border-charcoal-200 px-4 py-2.5 text-charcoal-800 focus:border-wood-500 focus:outline-none focus:ring-2 focus:ring-wood-200"
              />
            </div>
            <p className="sm:col-span-2 text-xs text-charcoal-400">
              Cria uma conta para cada ocorrência, com o mesmo valor e
              descrição, a partir do vencimento informado acima.
            </p>
          </div>
        )}
      </div>

      <div>
        <label
          htmlFor="notasInternas"
          className="block text-sm font-medium text-charcoal-700 mb-1.5"
        >
          Notas internas
        </label>
        <textarea
          id="notasInternas"
          name="notasInternas"
          rows={4}
          className="w-full rounded-lg border border-charcoal-200 px-4 py-2.5 text-charcoal-800 focus:border-wood-500 focus:outline-none focus:ring-2 focus:ring-wood-200"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-wood-500 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-wood-600 disabled:opacity-60 transition-colors"
      >
        {pending ? "Salvando..." : "Salvar conta"}
      </button>
    </form>
  );
}
