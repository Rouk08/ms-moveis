"use client";

import { useState, type FormEvent } from "react";

const tipoOptions = [
  { value: "ATESTADO", label: "Atestado" },
  { value: "LICENCA_MEDICA", label: "Licença médica" },
  { value: "INSS_AUXILIO_DOENCA", label: "INSS / Auxílio-doença" },
  { value: "MATERNIDADE", label: "Maternidade" },
  { value: "PATERNIDADE", label: "Paternidade" },
  { value: "LUTO", label: "Luto" },
  { value: "OUTROS", label: "Outros" },
];

type NovoAfastamentoFormProps = {
  colaboradores: { id: string; nome: string }[];
  colaboradorId?: string;
};

export default function NovoAfastamentoForm({
  colaboradores,
  colaboradorId,
}: NovoAfastamentoFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setPending(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      colaboradorId: String(formData.get("colaboradorId") ?? "").trim(),
      tipo: String(formData.get("tipo") ?? "OUTROS"),
      dataInicio: String(formData.get("dataInicio") ?? "").trim(),
      dataFim: String(formData.get("dataFim") ?? "").trim(),
      motivo: String(formData.get("motivo") ?? "").trim(),
      notasInternas: String(formData.get("notasInternas") ?? "").trim(),
    };

    try {
      const res = await fetch("/api/rh/afastamentos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Não foi possível salvar o afastamento.");
        setPending(false);
        return;
      }

      window.location.href = `/admin/rh/afastamentos/${data.id}`;
    } catch {
      setError("Não foi possível salvar o afastamento. Tente novamente.");
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
          htmlFor="colaboradorId"
          className="block text-sm font-medium text-charcoal-700 mb-1.5"
        >
          Colaborador *
        </label>
        <select
          id="colaboradorId"
          name="colaboradorId"
          required
          defaultValue={colaboradorId ?? ""}
          className="w-full rounded-lg border border-charcoal-200 px-4 py-2.5 text-charcoal-800 focus:border-wood-500 focus:outline-none focus:ring-2 focus:ring-wood-200"
        >
          <option value="" disabled>
            Selecione...
          </option>
          {colaboradores.map((colaborador) => (
            <option key={colaborador.id} value={colaborador.id}>
              {colaborador.nome}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="tipo"
          className="block text-sm font-medium text-charcoal-700 mb-1.5"
        >
          Tipo
        </label>
        <select
          id="tipo"
          name="tipo"
          defaultValue="OUTROS"
          className="w-full rounded-lg border border-charcoal-200 px-4 py-2.5 text-charcoal-800 focus:border-wood-500 focus:outline-none focus:ring-2 focus:ring-wood-200"
        >
          {tipoOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label
            htmlFor="dataInicio"
            className="block text-sm font-medium text-charcoal-700 mb-1.5"
          >
            Data de início *
          </label>
          <input
            id="dataInicio"
            name="dataInicio"
            type="date"
            required
            className="w-full rounded-lg border border-charcoal-200 px-4 py-2.5 text-charcoal-800 focus:border-wood-500 focus:outline-none focus:ring-2 focus:ring-wood-200"
          />
        </div>
        <div>
          <label
            htmlFor="dataFim"
            className="block text-sm font-medium text-charcoal-700 mb-1.5"
          >
            Data de fim
          </label>
          <input
            id="dataFim"
            name="dataFim"
            type="date"
            className="w-full rounded-lg border border-charcoal-200 px-4 py-2.5 text-charcoal-800 focus:border-wood-500 focus:outline-none focus:ring-2 focus:ring-wood-200"
          />
        </div>
      </div>
      <p className="text-xs text-charcoal-400 -mt-3">
        Deixe a data de fim em branco se o afastamento ainda está em curso.
      </p>

      <div>
        <label
          htmlFor="motivo"
          className="block text-sm font-medium text-charcoal-700 mb-1.5"
        >
          Motivo
        </label>
        <input
          id="motivo"
          name="motivo"
          type="text"
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
          rows={3}
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
        {pending ? "Salvando..." : "Salvar"}
      </button>
    </form>
  );
}
