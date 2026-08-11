"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

type ExcluirContaPagarButtonProps = {
  id: string;
  ehRecorrente: boolean;
};

export default function ExcluirContaPagarButton({
  id,
  ehRecorrente,
}: ExcluirContaPagarButtonProps) {
  const [pending, setPending] = useState<"unica" | "futuras" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const excluir = async (scope: "unica" | "futuras") => {
    const mensagem =
      scope === "futuras"
        ? "Cancelar esta conta e todas as próximas ocorrências pendentes desta recorrência? Ocorrências já pagas não serão afetadas."
        : "Excluir esta conta a pagar? Essa ação não pode ser desfeita.";

    if (!window.confirm(mensagem)) return;

    setPending(scope);
    setError(null);

    try {
      const res = await fetch(
        `/api/contas-pagar/${id}?scope=${scope}`,
        { method: "DELETE" }
      );
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Não foi possível excluir.");
        setPending(null);
        return;
      }

      window.location.href = "/admin/financeiro/contas-a-pagar";
    } catch {
      setError("Não foi possível excluir. Tente novamente.");
      setPending(null);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={() => excluir("unica")}
        disabled={pending !== null}
        className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60 transition-colors"
      >
        <Trash2 size={14} />
        {pending === "unica" ? "Excluindo..." : "Excluir esta conta"}
      </button>

      {ehRecorrente && (
        <button
          type="button"
          onClick={() => excluir("futuras")}
          disabled={pending !== null}
          className="inline-flex items-center gap-2 rounded-full border border-charcoal-200 bg-white px-4 py-2 text-sm font-medium text-charcoal-700 hover:bg-charcoal-50 disabled:opacity-60 transition-colors"
        >
          <Trash2 size={14} />
          {pending === "futuras"
            ? "Cancelando..."
            : "Cancelar esta e as futuras"}
        </button>
      )}

      {error && (
        <p className="w-full text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
