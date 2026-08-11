"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Clock, CheckCircle2, XCircle } from "lucide-react";

type Resultado = {
  nome: string;
  tipo: "ENTRADA" | "SAIDA";
  hora: string;
};

export default function PontoKioskForm() {
  const [cpf, setCpf] = useState("");
  const [pin, setPin] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const cpfRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!resultado && !error) cpfRef.current?.focus();
  }, [resultado, error]);

  useEffect(() => {
    if (!resultado) return;
    const timer = setTimeout(() => {
      setResultado(null);
      setCpf("");
      setPin("");
    }, 6000);
    return () => clearTimeout(timer);
  }, [resultado]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setPending(true);

    try {
      const res = await fetch("/api/ponto/registrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cpf, pin }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Não foi possível registrar o ponto.");
        setPin("");
        setPending(false);
        return;
      }

      setResultado(data);
      setPending(false);
    } catch {
      setError("Não foi possível registrar o ponto. Tente novamente.");
      setPin("");
      setPending(false);
    }
  };

  if (resultado) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <CheckCircle2 size={64} className="text-moss-500" />
        <div>
          <p className="text-2xl font-semibold text-charcoal-800">
            Bem-vindo(a), {resultado.nome}!
          </p>
          <p className="text-lg text-charcoal-600 mt-1">
            {resultado.tipo === "ENTRADA" ? "Entrada" : "Saída"} registrada
            às{" "}
            {new Date(resultado.hora).toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="cpf"
          className="block text-lg font-medium text-charcoal-700 mb-2"
        >
          CPF
        </label>
        <input
          ref={cpfRef}
          id="cpf"
          name="cpf"
          type="text"
          inputMode="numeric"
          maxLength={14}
          required
          autoComplete="off"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          placeholder="000.000.000-00"
          className="w-full rounded-xl border-2 border-charcoal-200 px-5 py-4 text-2xl text-center tracking-wide text-charcoal-800 focus:border-wood-500 focus:outline-none focus:ring-4 focus:ring-wood-100"
        />
      </div>

      <div>
        <label
          htmlFor="pin"
          className="block text-lg font-medium text-charcoal-700 mb-2"
        >
          PIN
        </label>
        <input
          id="pin"
          name="pin"
          type="password"
          inputMode="numeric"
          maxLength={4}
          required
          autoComplete="off"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="••••"
          className="w-full rounded-xl border-2 border-charcoal-200 px-5 py-4 text-3xl text-center tracking-[0.5em] text-charcoal-800 focus:border-wood-500 focus:outline-none focus:ring-4 focus:ring-wood-100"
        />
      </div>

      {error && (
        <div
          className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-red-700"
          role="alert"
        >
          <XCircle size={20} className="shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-wood-500 px-6 py-5 text-xl font-semibold text-white shadow-sm hover:bg-wood-600 disabled:opacity-60 transition-colors"
      >
        <Clock size={22} />
        {pending ? "Registrando..." : "Bater ponto"}
      </button>
    </form>
  );
}
