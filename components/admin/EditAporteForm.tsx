"use client";

import { useState, type FormEvent } from "react";

type EditAporteFormProps = {
  id: string;
  socio: string;
  valor: string;
  data: string;
  observacao: string;
};

export default function EditAporteForm({
  id,
  socio,
  valor,
  data,
  observacao,
}: EditAporteFormProps) {
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
      socio: String(formData.get("socio") ?? "").trim(),
      valor: String(formData.get("valor") ?? "").trim(),
      data: String(formData.get("data") ?? "").trim(),
      observacao: String(formData.get("observacao") ?? "").trim(),
    };

    try {
      const res = await fetch(`/api/aportes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const resData = await res.json();

      if (!res.ok) {
        setError(resData.error ?? "Não foi possível salvar as alterações.");
        setPending(false);
        return;
      }

      setSuccess(true);
      setPending(false);
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
      <div>
        <label
          htmlFor="socio"
          className="block text-sm font-medium text-charcoal-700 mb-1.5"
        >
          Sócio *
        </label>
        <input
          id="socio"
          name="socio"
          type="text"
          required
          defaultValue={socio}
          className="w-full rounded-lg border border-charcoal-200 px-4 py-2.5 text-charcoal-800 focus:border-wood-500 focus:outline-none focus:ring-2 focus:ring-wood-200"
        />
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
            defaultValue={valor}
            className="w-full rounded-lg border border-charcoal-200 px-4 py-2.5 text-charcoal-800 focus:border-wood-500 focus:outline-none focus:ring-2 focus:ring-wood-200"
          />
        </div>
        <div>
          <label
            htmlFor="data"
            className="block text-sm font-medium text-charcoal-700 mb-1.5"
          >
            Data do aporte *
          </label>
          <input
            id="data"
            name="data"
            type="date"
            required
            defaultValue={data}
            className="w-full rounded-lg border border-charcoal-200 px-4 py-2.5 text-charcoal-800 focus:border-wood-500 focus:outline-none focus:ring-2 focus:ring-wood-200"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="observacao"
          className="block text-sm font-medium text-charcoal-700 mb-1.5"
        >
          Observação
        </label>
        <textarea
          id="observacao"
          name="observacao"
          rows={4}
          defaultValue={observacao}
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
