"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2, Circle, MapPin } from "lucide-react";

type MarceneiroEtapaItemProps = {
  id: string;
  nome: string;
  dataPrevista: string;
  clienteNome: string;
  enderecoInstalacao: string;
  atrasada: boolean;
};

export default function MarceneiroEtapaItem({
  id,
  nome,
  dataPrevista,
  clienteNome,
  enderecoInstalacao,
  atrasada,
}: MarceneiroEtapaItemProps) {
  const [pending, setPending] = useState(false);

  const marcarConcluida = async () => {
    setPending(true);
    await fetch(`/api/producao/marceneiro/etapas/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ concluida: true }),
    });
    window.location.reload();
  };

  return (
    <div
      className={`rounded-2xl border p-4 shadow-sm ${
        atrasada ? "border-red-200 bg-red-50/50" : "border-charcoal-100 bg-white"
      }`}
    >
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={marcarConcluida}
          disabled={pending}
          aria-label="Marcar como concluída"
          className="shrink-0 mt-0.5"
        >
          {pending ? (
            <CheckCircle2 size={26} className="text-moss-400 animate-pulse" />
          ) : (
            <Circle size={26} className="text-charcoal-300" />
          )}
        </button>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-charcoal-800">{nome}</p>
          <p className="text-sm text-charcoal-600">{clienteNome}</p>
          <p className="mt-1 flex items-center gap-1 text-xs text-charcoal-400">
            <MapPin size={11} className="shrink-0" />
            <span className="truncate">{enderecoInstalacao}</span>
          </p>
          <div className="mt-1.5 flex items-center gap-2 text-xs">
            <span className={atrasada ? "font-medium text-red-600" : "text-charcoal-500"}>
              Previsto: {new Date(dataPrevista).toLocaleDateString("pt-BR", { timeZone: "UTC" })}
            </span>
            {atrasada && (
              <span className="inline-flex items-center gap-1 font-medium text-red-600">
                <AlertTriangle size={11} />
                Atrasada
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
