"use client";

import { useState, type FormEvent } from "react";

type EditFeriasFormProps = {
  id: string;
  diasGozados: number;
  dataGozoInicio: string;
  dataGozoFim: string;
  notasInternas: string;
};

export default function EditFeriasForm({
  id,
  diasGozados,
  dataGozoInicio,
  dataGozoFim,
  notasInternas,
}: EditFeriasFormProps) {
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
      diasGozados: String(formData.get("diasGozados") ?? "").trim(),
      dataGozoInicio: String(formData.get("dataGozoInicio") ?? "").trim(),
      dataGozoFim: String(formData.get("dataGozoFim") ?? "").trim(),
      notasInternas: String(formData.get("notasInternas") ?? "").trim(),
    };

    try {
      const res = await fetch(`/api/rh/ferias/${id}`, {
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
      <h2 className="font-semibold text-charcoal-800">Gozo das férias</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label
            htmlFor="dataGozoInicio"
            className="block text-sm font-medium text-charcoal-700 mb-1.5"
          >
            Início do gozo
          </label>
          <input
            id="dataGozoInicio"
            name="dataGozoInicio"
            type="date"
            defaultValue={dataGozoInicio}
            className="w-full rounded-lg border border-charcoal-200 px-4 py-2.5 text-charcoal-800 focus:border-wood-500 focus:outline-none focus:ring-2 focus:ring-wood-200"
          />
        </div>
        <div>
          <label
            htmlFor="dataGozoFim"
            className="block text-sm font-medium text-charcoal-700 mb-1.5"
          >
            Fim do gozo
          </label>
          <input
            id="dataGozoFim"
            name="dataGozoFim"
            type="date"
            defaultValue={dataGozoFim}
            className="w-full rounded-lg border border-charcoal-200 px-4 py-2.5 text-charcoal-800 focus:border-wood-500 focus:outline-none focus:ring-2 focus:ring-wood-200"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="diasGozados"
          className="block text-sm font-medium text-charcoal-700 mb-1.5"
        >
          Dias gozados
        </label>
        <input
          id="diasGozados"
          name="diasGozados"
          type="number"
          min="0"
          max="30"
          defaultValue={diasGozados}
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
          defaultValue={notasInternas}
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
