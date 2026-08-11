"use client";

import { useActionState } from "react";
import {
  createOrcamentoManual,
  type CreateOrcamentoState,
} from "@/lib/actions/criar-orcamento";

export default function NovoOrcamentoForm() {
  const [state, formAction, pending] = useActionState<
    CreateOrcamentoState,
    FormData
  >(createOrcamentoManual, undefined);

  return (
    <form
      action={formAction}
      className="rounded-2xl border border-charcoal-100 bg-white p-6 shadow-sm space-y-5"
    >
      <div>
        <label
          htmlFor="nome"
          className="block text-sm font-medium text-charcoal-700 mb-1.5"
        >
          Nome do cliente *
        </label>
        <input
          id="nome"
          name="nome"
          type="text"
          required
          className="w-full rounded-lg border border-charcoal-200 px-4 py-2.5 text-charcoal-800 focus:border-wood-500 focus:outline-none focus:ring-2 focus:ring-wood-200"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label
            htmlFor="telefone"
            className="block text-sm font-medium text-charcoal-700 mb-1.5"
          >
            Telefone *
          </label>
          <input
            id="telefone"
            name="telefone"
            type="text"
            required
            placeholder="(47) 99999-8888"
            className="w-full rounded-lg border border-charcoal-200 px-4 py-2.5 text-charcoal-800 focus:border-wood-500 focus:outline-none focus:ring-2 focus:ring-wood-200"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-charcoal-700 mb-1.5"
          >
            E-mail *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-lg border border-charcoal-200 px-4 py-2.5 text-charcoal-800 focus:border-wood-500 focus:outline-none focus:ring-2 focus:ring-wood-200"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="tipoProjeto"
          className="block text-sm font-medium text-charcoal-700 mb-1.5"
        >
          Tipo de projeto
        </label>
        <select
          id="tipoProjeto"
          name="tipoProjeto"
          defaultValue="Cozinha Planejada"
          className="w-full rounded-lg border border-charcoal-200 px-4 py-2.5 text-charcoal-800 focus:border-wood-500 focus:outline-none focus:ring-2 focus:ring-wood-200"
        >
          <option>Cozinha Planejada</option>
          <option>Quarto Planejado</option>
          <option>Sala de Estar</option>
          <option>Banheiro</option>
          <option>Home Office</option>
          <option>Projeto Comercial</option>
          <option>Outro</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="mensagem"
          className="block text-sm font-medium text-charcoal-700 mb-1.5"
        >
          Mensagem *
        </label>
        <textarea
          id="mensagem"
          name="mensagem"
          rows={4}
          required
          className="w-full rounded-lg border border-charcoal-200 px-4 py-2.5 text-charcoal-800 focus:border-wood-500 focus:outline-none focus:ring-2 focus:ring-wood-200"
        />
      </div>

      {state?.error && (
        <p className="text-sm text-red-600" role="alert">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-wood-500 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-wood-600 disabled:opacity-60 transition-colors"
      >
        {pending ? "Salvando..." : "Salvar orçamento"}
      </button>
    </form>
  );
}
