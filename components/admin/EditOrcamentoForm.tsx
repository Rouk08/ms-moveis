"use client";

import { useActionState } from "react";
import {
  updateOrcamento,
  type UpdateOrcamentoState,
} from "@/lib/actions/orcamentos";
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
};

export default function EditOrcamentoForm({
  id,
  status,
  valorEstimado,
  notasInternas,
}: EditOrcamentoFormProps) {
  const updateOrcamentoWithId = updateOrcamento.bind(null, id);
  const [state, formAction, pending] = useActionState<
    UpdateOrcamentoState,
    FormData
  >(updateOrcamentoWithId, undefined);

  return (
    <form
      action={formAction}
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

      {state?.success && (
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
