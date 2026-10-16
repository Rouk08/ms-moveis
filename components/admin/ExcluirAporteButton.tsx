"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

export default function ExcluirAporteButton({ id }: { id: string }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const excluir = async () => {
    if (!window.confirm("Excluir este aporte? Essa ação não pode ser desfeita.")) {
      return;
    }

    setPending(true);
    setError(null);

    try {
      const res = await fetch(`/api/aportes/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Não foi possível excluir.");
        setPending(false);
        return;
      }

      window.location.href = "/admin/financeiro/aportes";
    } catch {
      setError("Não foi possível excluir. Tente novamente.");
      setPending(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={excluir}
        disabled={pending}
        className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60 transition-colors"
      >
        <Trash2 size={14} />
        {pending ? "Excluindo..." : "Excluir aporte"}
      </button>

      {error && (
        <p className="w-full text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
