"use client";

import { useState } from "react";
import { Copy } from "lucide-react";

type DuplicarContaButtonProps = {
  id: string;
  tipo: "pagar" | "receber";
  variant?: "button" | "icon";
};

export default function DuplicarContaButton({
  id,
  tipo,
  variant = "button",
}: DuplicarContaButtonProps) {
  const [pending, setPending] = useState(false);

  const duplicar = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPending(true);

    try {
      const res = await fetch(`/api/contas-${tipo}/${id}/duplicar`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        window.alert(data.error ?? "Não foi possível duplicar.");
        setPending(false);
        return;
      }
      window.location.href = `/admin/financeiro/contas-a-${tipo}/${data.id}`;
    } catch {
      window.alert("Não foi possível duplicar. Tente novamente.");
      setPending(false);
    }
  };

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={duplicar}
        disabled={pending}
        title="Duplicar conta"
        aria-label="Duplicar conta"
        className="rounded-lg p-1.5 text-charcoal-400 hover:bg-wood-50 hover:text-wood-600 disabled:opacity-60 transition-colors"
      >
        <Copy size={15} />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={duplicar}
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-full border border-charcoal-200 bg-white px-4 py-2 text-sm font-medium text-charcoal-700 hover:bg-charcoal-50 disabled:opacity-60 transition-colors"
    >
      <Copy size={14} />
      {pending ? "Duplicando..." : "Duplicar conta"}
    </button>
  );
}
