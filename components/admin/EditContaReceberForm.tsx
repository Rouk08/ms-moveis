"use client";

import { useState, type FormEvent } from "react";
import type { StatusRecebimento } from "@/lib/generated/prisma/enums";

const statusOptions = [
  { value: "PENDENTE", label: "Pendente" },
  { value: "RECEBIDO", label: "Recebido" },
];

type EditContaReceberFormProps = {
  id: string;
  cliente: string;
  telefone: string;
  email: string;
  valor: string;
  vencimento: string;
  status: StatusRecebimento;
  notasInternas: string;
};

export default function EditContaReceberForm({
  id,
  cliente,
  telefone,
  email,
  valor,
  vencimento,
  status,
  notasInternas,
}: EditContaReceberFormProps) {
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
      cliente: String(formData.get("cliente") ?? "").trim(),
      telefone: String(formData.get("telefone") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      valor: String(formData.get("valor") ?? "").trim(),
      vencimento: String(formData.get("vencimento") ?? "").trim(),
      status: String(formData.get("status") ?? ""),
      notasInternas: String(formData.get("notasInternas") ?? "").trim(),
    };

    try {
      const res = await fetch(`/api/contas-receber/${id}`, {
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
      <div>
        <label
          htmlFor="cliente"
          className="block text-sm font-medium text-charcoal-700 mb-1.5"
        >
          Cliente *
        </label>
        <input
          id="cliente"
          name="cliente"
          type="text"
          required
          defaultValue={cliente}
          className="w-full rounded-lg border border-charcoal-200 px-4 py-2.5 text-charcoal-800 focus:border-wood-500 focus:outline-none focus:ring-2 focus:ring-wood-200"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label
            htmlFor="telefone"
            className="block text-sm font-medium text-charcoal-700 mb-1.5"
          >
            Telefone
          </label>
          <input
            id="telefone"
            name="telefone"
            type="text"
            defaultValue={telefone}
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
            defaultValue={vencimento}
            className="w-full rounded-lg border border-charcoal-200 px-4 py-2.5 text-charcoal-800 focus:border-wood-500 focus:outline-none focus:ring-2 focus:ring-wood-200"
          />
        </div>
      </div>

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
