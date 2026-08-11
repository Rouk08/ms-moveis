"use client";

import { useState, type FormEvent } from "react";

type NovaContaReceberFormProps = {
  orcamentoId?: string;
  cliente?: string;
  telefone?: string;
  email?: string;
  valor?: string;
};

export default function NovaContaReceberForm({
  orcamentoId,
  cliente,
  telefone,
  email,
  valor,
}: NovaContaReceberFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setPending(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      cliente: String(formData.get("cliente") ?? "").trim(),
      telefone: String(formData.get("telefone") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      valor: String(formData.get("valor") ?? "").trim(),
      vencimento: String(formData.get("vencimento") ?? "").trim(),
      totalParcelas: String(formData.get("totalParcelas") ?? "1").trim(),
      notasInternas: String(formData.get("notasInternas") ?? "").trim(),
      orcamentoId: orcamentoId ?? "",
    };

    try {
      const res = await fetch("/api/contas-receber", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Não foi possível salvar a conta.");
        setPending(false);
        return;
      }

      window.location.href =
        data.count > 1
          ? "/admin/financeiro/contas-a-receber"
          : `/admin/financeiro/contas-a-receber/${data.id}`;
    } catch {
      setError("Não foi possível salvar a conta. Tente novamente.");
      setPending(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-charcoal-100 bg-white p-6 shadow-sm space-y-5"
    >
      {orcamentoId && (
        <p className="text-sm text-moss-700 bg-moss-50 rounded-lg px-4 py-2.5">
          Vinculada ao orçamento aprovado.
        </p>
      )}

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
            placeholder="(47) 99999-8888"
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
            Valor total (R$) *
          </label>
          <input
            id="valor"
            name="valor"
            type="number"
            step="0.01"
            min="0"
            required
            defaultValue={valor}
            placeholder="0,00"
            className="w-full rounded-lg border border-charcoal-200 px-4 py-2.5 text-charcoal-800 focus:border-wood-500 focus:outline-none focus:ring-2 focus:ring-wood-200"
          />
        </div>
        <div>
          <label
            htmlFor="vencimento"
            className="block text-sm font-medium text-charcoal-700 mb-1.5"
          >
            1º vencimento *
          </label>
          <input
            id="vencimento"
            name="vencimento"
            type="date"
            required
            className="w-full rounded-lg border border-charcoal-200 px-4 py-2.5 text-charcoal-800 focus:border-wood-500 focus:outline-none focus:ring-2 focus:ring-wood-200"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="totalParcelas"
          className="block text-sm font-medium text-charcoal-700 mb-1.5"
        >
          Número de parcelas
        </label>
        <input
          id="totalParcelas"
          name="totalParcelas"
          type="number"
          min="1"
          max="24"
          defaultValue="1"
          className="w-full rounded-lg border border-charcoal-200 px-4 py-2.5 text-charcoal-800 focus:border-wood-500 focus:outline-none focus:ring-2 focus:ring-wood-200"
        />
        <p className="mt-1.5 text-xs text-charcoal-400">
          O valor total é dividido igualmente entre as parcelas, com
          vencimentos mensais a partir da data informada.
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
        {pending ? "Salvando..." : "Salvar conta"}
      </button>
    </form>
  );
}
