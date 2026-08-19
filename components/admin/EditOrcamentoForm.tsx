"use client";

import { useState, type FormEvent } from "react";
import { projectTypes } from "@/lib/data";
import type { OrcamentoStatus } from "@/lib/generated/prisma/enums";

const statusOptions = [
  { value: "NOVO", label: "Novo" },
  { value: "EM_ANDAMENTO", label: "Em andamento" },
  { value: "APROVADO", label: "Aprovado" },
  { value: "RECUSADO", label: "Recusado" },
];

type EditOrcamentoFormProps = {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  tipoProjeto: string[];
  mensagem: string;
  status: OrcamentoStatus;
  valorEstimado: string;
  notasInternas: string;
  incluiProjeto: boolean;
};

export default function EditOrcamentoForm({
  id,
  nome,
  telefone,
  email,
  tipoProjeto,
  mensagem,
  status,
  valorEstimado,
  notasInternas,
  incluiProjeto,
}: EditOrcamentoFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setPending(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      nome: String(formData.get("nome") ?? "").trim(),
      telefone: String(formData.get("telefone") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      tipoProjeto: formData.getAll("tipoProjeto").map(String),
      mensagem: String(formData.get("mensagem") ?? "").trim(),
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

      window.location.reload();
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
      <h2 className="font-semibold text-charcoal-800">Dados do cliente</h2>

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
          defaultValue={nome}
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
            defaultValue={telefone}
            placeholder="(47) 99999-8888"
            className="w-full rounded-lg border border-charcoal-200 px-4 py-2.5 text-charcoal-800 focus:border-wood-500 focus:outline-none focus:ring-2 focus:ring-wood-200"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-charcoal-700 mb-1.5"
          >
            E-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            defaultValue={email}
            className="w-full rounded-lg border border-charcoal-200 px-4 py-2.5 text-charcoal-800 focus:border-wood-500 focus:outline-none focus:ring-2 focus:ring-wood-200"
          />
        </div>
      </div>

      <div>
        <span className="block text-sm font-medium text-charcoal-700 mb-1.5">
          Tipo de projeto (selecione um ou mais)
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {projectTypes.map((type) => (
            <label
              key={type}
              className="flex items-center gap-2 rounded-lg border border-charcoal-200 px-3 py-2.5 text-sm text-charcoal-600 cursor-pointer transition-colors hover:bg-charcoal-50 has-[:checked]:border-wood-500 has-[:checked]:bg-wood-50 has-[:checked]:text-wood-700"
            >
              <input
                type="checkbox"
                name="tipoProjeto"
                value={type}
                defaultChecked={tipoProjeto.includes(type)}
                className="h-4 w-4 rounded border-charcoal-300 text-wood-500 focus:ring-wood-200"
              />
              {type}
            </label>
          ))}
        </div>
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
          defaultValue={mensagem}
          className="w-full rounded-lg border border-charcoal-200 px-4 py-2.5 text-charcoal-800 focus:border-wood-500 focus:outline-none focus:ring-2 focus:ring-wood-200"
        />
      </div>

      <div className="pt-2 border-t border-charcoal-100" />

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
