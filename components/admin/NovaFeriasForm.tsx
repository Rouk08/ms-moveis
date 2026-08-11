"use client";

import { useState, type FormEvent } from "react";

type NovaFeriasFormProps = {
  colaboradores: { id: string; nome: string }[];
  colaboradorId?: string;
};

export default function NovaFeriasForm({
  colaboradores,
  colaboradorId,
}: NovaFeriasFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setPending(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      colaboradorId: String(formData.get("colaboradorId") ?? "").trim(),
      periodoAquisitivoInicio: String(
        formData.get("periodoAquisitivoInicio") ?? ""
      ).trim(),
      diasDireito: String(formData.get("diasDireito") ?? "30").trim(),
      notasInternas: String(formData.get("notasInternas") ?? "").trim(),
    };

    try {
      const res = await fetch("/api/rh/ferias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Não foi possível salvar as férias.");
        setPending(false);
        return;
      }

      window.location.href = `/admin/rh/ferias/${data.id}`;
    } catch {
      setError("Não foi possível salvar as férias. Tente novamente.");
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label
            htmlFor="periodoAquisitivoInicio"
            className="block text-sm font-medium text-charcoal-700 mb-1.5"
          >
            Início do período aquisitivo *
          </label>
          <input
            id="periodoAquisitivoInicio"
            name="periodoAquisitivoInicio"
            type="date"
            required
            className="w-full rounded-lg border border-charcoal-200 px-4 py-2.5 text-charcoal-800 focus:border-wood-500 focus:outline-none focus:ring-2 focus:ring-wood-200"
          />
        </div>
        <div>
          <label
            htmlFor="diasDireito"
            className="block text-sm font-medium text-charcoal-700 mb-1.5"
          >
            Dias de direito
          </label>
          <input
            id="diasDireito"
            name="diasDireito"
            type="number"
            min="1"
            max="30"
            defaultValue="30"
            className="w-full rounded-lg border border-charcoal-200 px-4 py-2.5 text-charcoal-800 focus:border-wood-500 focus:outline-none focus:ring-2 focus:ring-wood-200"
          />
        </div>
      </div>
      <p className="text-xs text-charcoal-400 -mt-3">
        O fim do período aquisitivo é calculado automaticamente (12 meses
        após o início).
      </p>

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
