"use client";

import { useState } from "react";
import { KeyRound } from "lucide-react";

export default function ResetarPinButton({ id }: { id: string }) {
  const [pending, setPending] = useState(false);
  const [pin, setPin] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    if (
      pin === null &&
      !window.confirm(
        "Gerar um novo PIN? O PIN atual deixará de funcionar imediatamente."
      )
    ) {
      return;
    }

    setPending(true);
    setError(null);

    try {
      const res = await fetch(`/api/rh/colaboradores/${id}/resetar-pin`, {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Não foi possível resetar o PIN.");
        setPending(false);
        return;
      }

      setPin(data.pin);
      setPending(false);
    } catch {
      setError("Não foi possível resetar o PIN. Tente novamente.");
      setPending(false);
    }
  };

  if (pin) {
    return (
      <div className="rounded-2xl border border-moss-200 bg-moss-50 p-4">
        <p className="text-sm text-charcoal-600 mb-1.5">
          Novo PIN (anote agora — não será mostrado de novo):
        </p>
        <p className="text-2xl font-bold tracking-widest text-charcoal-800">
          {pin}
        </p>
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        className="inline-flex items-center gap-2 rounded-full border border-charcoal-200 bg-white px-4 py-2 text-sm font-medium text-charcoal-700 hover:bg-charcoal-50 disabled:opacity-60 transition-colors"
      >
        <KeyRound size={14} />
        {pending ? "Gerando..." : "Resetar PIN"}
      </button>
      {error && (
        <p className="text-sm text-red-600 mt-2" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
