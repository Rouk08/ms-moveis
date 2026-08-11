"use client";

import { useState, type FormEvent } from "react";

type RegistroPontoManualFormProps = {
  colaboradores: { id: string; nome: string }[];
};

export default function RegistroPontoManualForm({
  colaboradores,
}: RegistroPontoManualFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setPending(true);

    const formData = new FormData(event.currentTarget);
    const dataHoraLocal = String(formData.get("dataHora") ?? "").trim();
    const payload = {
      colaboradorId: String(formData.get("colaboradorId") ?? "").trim(),
      tipo: String(formData.get("tipo") ?? ""),
      dataHora: dataHoraLocal ? new Date(dataHoraLocal).toISOString() : "",
      notasInternas: String(formData.get("notasInternas") ?? "").trim(),
    };

    try {
      const res = await fetch("/api/rh/ponto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Não foi possível registrar o ponto.");
        setPending(false);
        return;
      }

      window.location.reload();
    } catch {
      setError("Não foi possível registrar o ponto. Tente novamente.");
      setPending(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-charcoal-100 bg-white p-6 shadow-sm space-y-5"
    >
      <h2 className="font-semibold text-charcoal-800">
        Registro manual (correção)
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
            defaultValue=""
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
            Tipo *
          </label>
          <select
            id="tipo"
            name="tipo"
            required
            defaultValue="ENTRADA"
            className="w-full rounded-lg border border-charcoal-200 px-4 py-2.5 text-charcoal-800 focus:border-wood-500 focus:outline-none focus:ring-2 focus:ring-wood-200"
          >
            <option value="ENTRADA">Entrada</option>
            <option value="SAIDA">Saída</option>
          </select>
        </div>
      </div>

      <div>
        <label
          htmlFor="dataHora"
          className="block text-sm font-medium text-charcoal-700 mb-1.5"
        >
          Data e hora *
        </label>
        <input
          id="dataHora"
          name="dataHora"
          type="datetime-local"
          required
          className="w-full rounded-lg border border-charcoal-200 px-4 py-2.5 text-charcoal-800 focus:border-wood-500 focus:outline-none focus:ring-2 focus:ring-wood-200"
        />
      </div>

      <div>
        <label
          htmlFor="notasInternas"
          className="block text-sm font-medium text-charcoal-700 mb-1.5"
        >
          Justificativa
        </label>
        <input
          id="notasInternas"
          name="notasInternas"
          type="text"
          placeholder="Ex: esqueceu de bater o ponto"
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
        {pending ? "Salvando..." : "Registrar"}
      </button>
    </form>
  );
}
