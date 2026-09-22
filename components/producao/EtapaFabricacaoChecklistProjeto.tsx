"use client";

import { useState } from "react";
import { CheckCircle2, Circle, Lock } from "lucide-react";
import { etapasFluxo } from "@/lib/fluxo-fabricacao";

type ItemChecklist = {
  id: string;
  numero: number;
  concluida: boolean;
};

export default function EtapaFabricacaoChecklistProjeto({
  itens,
}: {
  itens: ItemChecklist[];
}) {
  const [pendingId, setPendingId] = useState<string | null>(null);

  const ordenados = [...itens].sort((a, b) => a.numero - b.numero);
  const concluidos = ordenados.filter((i) => i.concluida);
  const proximoNumero =
    concluidos.length > 0
      ? Math.max(...concluidos.map((i) => i.numero)) + 1
      : (ordenados[0]?.numero ?? 1);

  const alternar = async (item: ItemChecklist, valor: boolean) => {
    setPendingId(item.id);
    const res = await fetch(`/api/producao/marceneiro/fabricacao/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ concluida: valor }),
    });
    if (res.ok) {
      window.location.reload();
    } else {
      setPendingId(null);
    }
  };

  return (
    <div className="space-y-3">
      {ordenados.map((item) => {
        const etapa = etapasFluxo.find((e) => e.numero === item.numero);
        if (!etapa) return null;

        const proxima = !item.concluida && item.numero === proximoNumero;
        const bloqueada = !item.concluida && item.numero > proximoNumero;
        const podeDesmarcar = item.concluida && item.numero === (concluidos.at(-1)?.numero ?? -1);
        const pending = pendingId === item.id;

        return (
          <div
            key={item.id}
            className={`rounded-xl border p-3.5 ${
              item.concluida
                ? "border-moss-200 bg-moss-50"
                : proxima
                  ? "border-wood-300 bg-wood-50 shadow-sm"
                  : "border-charcoal-100 bg-charcoal-50/40 opacity-60"
            }`}
          >
            <div className="flex items-start gap-3">
              <button
                type="button"
                disabled={pending || (!proxima && !podeDesmarcar) || bloqueada}
                onClick={() => alternar(item, !item.concluida)}
                aria-label={item.concluida ? "Desmarcar etapa" : "Marcar etapa como concluída"}
                className="mt-0.5 shrink-0 disabled:cursor-not-allowed"
              >
                {item.concluida ? (
                  <CheckCircle2
                    size={24}
                    className={pending ? "animate-pulse text-moss-400" : "text-moss-600"}
                  />
                ) : bloqueada ? (
                  <Lock size={22} className="text-charcoal-300" />
                ) : (
                  <Circle
                    size={24}
                    className={pending ? "animate-pulse text-wood-400" : "text-wood-500"}
                  />
                )}
              </button>
              <div className="min-w-0 flex-1">
                <p
                  className={`text-sm font-semibold ${
                    item.concluida ? "text-moss-700" : "text-charcoal-800"
                  }`}
                >
                  {etapa.numero}. {etapa.titulo}
                </p>
                <p className="mt-0.5 text-xs text-charcoal-500">{etapa.fase}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
