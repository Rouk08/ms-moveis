"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

export default function ExcluirOrcamentoButton({ id }: { id: string }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    if (
      !window.confirm(
        "Excluir este orçamento? Essa ação não pode ser desfeita."
      )
    ) {
      return;
    }

    setPending(true);
    setError(null);

    try {
      const res = await fetch(`/api/orcamentos/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Não foi possível excluir.");
        setPending(false);
        return;
      }

      window.location.href = "/admin/orcamentos";
    } catch {
      setError("Não foi possível excluir. Tente novamente.");
      setPending(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60 transition-colors"
      >
        <Trash2 size={14} />
        {pending ? "Excluindo..." : "Excluir orçamento"}
      </button>
      {error && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
