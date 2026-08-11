"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function NovoColaboradorForm() {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [criado, setCriado] = useState<{ id: string; pin: string } | null>(
    null
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setPending(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      nome: String(formData.get("nome") ?? "").trim(),
      cpf: String(formData.get("cpf") ?? "").trim(),
      cargo: String(formData.get("cargo") ?? "").trim(),
      telefone: String(formData.get("telefone") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      dataAdmissao: String(formData.get("dataAdmissao") ?? "").trim(),
      salario: String(formData.get("salario") ?? "").trim(),
      notasInternas: String(formData.get("notasInternas") ?? "").trim(),
    };

    try {
      const res = await fetch("/api/rh/colaboradores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Não foi possível salvar o colaborador.");
        setPending(false);
        return;
      }

      setCriado({ id: data.id, pin: data.pin });
      setPending(false);
    } catch {
      setError("Não foi possível salvar o colaborador. Tente novamente.");
      setPending(false);
    }
  };

  if (criado) {
    return (
      <div className="rounded-2xl border border-moss-200 bg-moss-50 p-6 space-y-4">
        <div className="flex items-center gap-2 text-moss-700">
          <CheckCircle2 size={20} />
          <p className="font-semibold">Colaborador cadastrado.</p>
        </div>
        <div>
          <p className="text-sm text-charcoal-600 mb-1.5">
            PIN de acesso ao ponto (anote e entregue ao colaborador — não
            será mostrado de novo):
          </p>
          <p className="text-3xl font-bold tracking-widest text-charcoal-800 bg-white rounded-lg border border-charcoal-200 px-4 py-3 inline-block">
            {criado.pin}
          </p>
        </div>
        <Link
          href={`/admin/rh/colaboradores/${criado.id}`}
          className="inline-flex items-center gap-2 rounded-full bg-wood-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-wood-600 transition-colors"
        >
          Ver colaborador
        </Link>
      </div>
    );
  }

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
          Nome *
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
            htmlFor="cpf"
            className="block text-sm font-medium text-charcoal-700 mb-1.5"
          >
            CPF *
          </label>
          <input
            id="cpf"
            name="cpf"
            type="text"
            required
            placeholder="000.000.000-00"
            className="w-full rounded-lg border border-charcoal-200 px-4 py-2.5 text-charcoal-800 focus:border-wood-500 focus:outline-none focus:ring-2 focus:ring-wood-200"
          />
        </div>
        <div>
          <label
            htmlFor="cargo"
            className="block text-sm font-medium text-charcoal-700 mb-1.5"
          >
            Cargo *
          </label>
          <input
            id="cargo"
            name="cargo"
            type="text"
            required
            placeholder="Marceneiro, Vendedor..."
            className="w-full rounded-lg border border-charcoal-200 px-4 py-2.5 text-charcoal-800 focus:border-wood-500 focus:outline-none focus:ring-2 focus:ring-wood-200"
          />
        </div>
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
            className="w-full rounded-lg border border-charcoal-200 px-4 py-2.5 text-charcoal-800 focus:border-wood-500 focus:outline-none focus:ring-2 focus:ring-wood-200"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label
            htmlFor="dataAdmissao"
            className="block text-sm font-medium text-charcoal-700 mb-1.5"
          >
            Data de admissão *
          </label>
          <input
            id="dataAdmissao"
            name="dataAdmissao"
            type="date"
            required
            className="w-full rounded-lg border border-charcoal-200 px-4 py-2.5 text-charcoal-800 focus:border-wood-500 focus:outline-none focus:ring-2 focus:ring-wood-200"
          />
        </div>
        <div>
          <label
            htmlFor="salario"
            className="block text-sm font-medium text-charcoal-700 mb-1.5"
          >
            Salário (R$)
          </label>
          <input
            id="salario"
            name="salario"
            type="number"
            step="0.01"
            min="0"
            placeholder="0,00"
            className="w-full rounded-lg border border-charcoal-200 px-4 py-2.5 text-charcoal-800 focus:border-wood-500 focus:outline-none focus:ring-2 focus:ring-wood-200"
          />
        </div>
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
        {pending ? "Salvando..." : "Salvar colaborador"}
      </button>
    </form>
  );
}
