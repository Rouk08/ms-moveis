"use client";

import { useState, type FormEvent } from "react";
import type { OrcamentoStatus } from "@/lib/generated/prisma/enums";

const statusOptions = [
  { value: "NOVO", label: "Novo" },
  { value: "EM_ANDAMENTO", label: "Em andamento" },
  { value: "APROVADO", label: "Aprovado" },
  { value: "RECUSADO", label: "Recusado" },
];

type EditOrcamentoFormProps = {
  id: string;
  status: OrcamentoStatus;
  valorEstimado: string;
  notasInternas: string;
  incluiProjeto: boolean;
};

export default function EditOrcamentoForm({
  id,
  status,
  valorEstimado,
  notasInternas,
  incluiProjeto,
}: EditOrcamentoFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(false);
    setPending(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      status: String(formData.get("status") ?? ""),
      valorEstimado: String(formData.get("valorEstimado") ?? "").trim(),
      notasInternas: String(formData.get("notasInternas") ?? "").trim(),
      incluiProjeto: formData.get("incluiProjeto") === "on",
    };

    try {
      const res = await fetch(`/api/orcamentos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Não foi possível salvar as alterações.");
        setPending(false);
        return;
      }

      setSuccess(true);
      setPending(false);
    } catch {
      setError("Não foi possível salvar as alterações. Tente novamente.");
      setPending(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-charcoal-100 bg-white p-6 shadow-sm space-y-5"
    >
      <h2 className="font-semibold text-charcoal-800">
        Acompanhamento interno
      </h2>

      <div>
        <label
          htmlFor="status"
          className="block text-sm font-medium text-charcoal-700 mb-1.5"
        >
          Status
        </label>
        <select
          id="status"
          name="status"
          defaultValue={status}
          className="w-full rounded-lg border border-charcoal-200 px-4 py-2.5 text-charcoal-800 focus:border-wood-500 focus:outline-none focus:ring-2 focus:ring-wood-200"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="valorEstimado"
          className="block text-sm font-medium text-charcoal-700 mb-1.5"
        >
          Valor estimado (R$)
        </label>
        <input
          id="valorEstimado"
          name="valorEstimado"
          type="number"
          step="0.01"
          min="0"
          defaultValue={valorEstimado}
          placeholder="0,00"
          className="w-full rounded-lg border border-charcoal-200 px-4 py-2.5 text-charcoal-800 focus:border-wood-500 focus:outline-none focus:ring-2 focus:ring-wood-200"
        />
      </div>

      <div>
        <label className="flex items-center gap-2.5 text-sm font-medium text-charcoal-700">
          <input
            type="checkbox"
            name="incluiProjeto"
            defaultChecked={incluiProjeto}
            className="h-4 w-4 rounded border-charcoal-300 text-wood-500 focus:ring-wood-200"
          />
          Incluir projeto (elaboração de projeto)
        </label>
        <p className="mt-1.5 text-xs text-charcoal-400">
          Controla se &ldquo;Projeto&rdquo; aparece no PDF do orçamento
          enviado ao cliente.
        </p>
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
          defaultValue={notasInternas}
          placeholder="Observações visíveis só para a equipe..."
          className="w-full rounded-lg border border-charcoal-200 px-4 py-2.5 text-charcoal-800 focus:border-wood-500 focus:outline-none focus:ring-2 focus:ring-wood-200"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      {success && (
        <p className="text-sm text-moss-600" role="status">
          Alterações salvas.
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-wood-500 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-wood-600 disabled:opacity-60 transition-colors"
      >
        {pending ? "Salvando..." : "Salvar alterações"}
      </button>
    </form>
  );
}
