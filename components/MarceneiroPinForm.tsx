"use client";

import { useState, type FormEvent } from "react";

export default function MarceneiroPinForm() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setPending(true);

    try {
      const res = await fetch("/api/producao/marceneiro/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });
      if (!res.ok) {
        setError("Código incorreto.");
        setPending(false);
        return;
      }
      window.location.reload();
    } catch {
      setError("Não foi possível entrar. Tente novamente.");
      setPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-charcoal-700 mb-1.5">
          Código de acesso
        </label>
        <input
          type="password"
          inputMode="numeric"
          autoFocus
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          required
          className="w-full rounded-lg border border-charcoal-200 px-4 py-3 text-center text-lg tracking-[0.5em] text-charcoal-800 focus:border-wood-500 focus:outline-none focus:ring-2 focus:ring-wood-200"
          placeholder="••••••"
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
        className="w-full rounded-full bg-wood-500 px-6 py-3 text-sm font-semibold text-white hover:bg-wood-600 disabled:opacity-60 transition-colors"
      >
        {pending ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
