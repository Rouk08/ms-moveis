"use client";

import { useState, type FormEvent } from "react";
import { projectTypes } from "@/lib/data";

export default function NovoOrcamentoForm() {
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
    };

    try {
      const res = await fetch("/api/orcamentos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Não foi possível salvar o orçamento.");
        setPending(false);
        return;
      }

      window.location.href = `/admin/orcamentos/${data.id}`;
    } catch {
      setError("Não foi possível salvar o orçamento. Tente novamente.");
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
                defaultChecked={type === "Cozinha Planejada"}
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
        {pending ? "Salvando..." : "Salvar orçamento"}
      </button>
    </form>
  );
}
