"use client";

import { useState } from "react";
import { CheckCircle2, Circle } from "lucide-react";

export default function EtapaProducaoCheckbox({
  contratoId,
  etapaId,
}: {
  contratoId: string;
  etapaId: string;
}) {
  const [pending, setPending] = useState(false);

  const marcarConcluida = async () => {
    setPending(true);
    await fetch(`/api/contratos/${contratoId}/etapas/${etapaId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ concluida: true }),
    });
    window.location.reload();
  };

  return (
    <button
      type="button"
      onClick={marcarConcluida}
      disabled={pending}
      aria-label="Marcar como concluída"
      className="shrink-0 disabled:opacity-50"
    >
      {pending ? (
        <CheckCircle2 size={20} className="text-moss-400 animate-pulse" />
      ) : (
        <Circle size={20} className="text-charcoal-300 hover:text-moss-500 transition-colors" />
      )}
    </button>
  );
}
