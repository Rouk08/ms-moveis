"use client";

import { useState } from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { etapasFluxo } from "@/lib/fluxo-fabricacao";

type ItemChecklist = {
  id: string;
  numero: number;
  concluida: boolean;
};

export default function EtapaFabricacaoAdminList({
  contratoId,
  itens,
}: {
  contratoId: string;
  itens: ItemChecklist[];
}) {
  const [pendingId, setPendingId] = useState<string | null>(null);

  const ordenados = [...itens].sort((a, b) => a.numero - b.numero);
  const total = ordenados.length;
  const feitos = ordenados.filter((i) => i.concluida).length;

  const alternar = async (item: ItemChecklist) => {
    setPendingId(item.id);
    const res = await fetch(
      `/api/contratos/${contratoId}/etapas-fabricacao/${item.id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ concluida: !item.concluida }),
      }
    );
    if (res.ok) {
      window.location.reload();
    } else {
      setPendingId(null);
    }
  };

  return (
    <div className="rounded-2xl border border-charcoal-100 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-charcoal-800">
          Checklist de fabricação (bancada)
        </h3>
        <span className="text-xs font-medium text-wood-600">
          {feitos} de {total} etapas
        </span>
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {ordenados.map((item) => {
          const etapa = etapasFluxo.find((e) => e.numero === item.numero);
          if (!etapa) return null;
          const pending = pendingId === item.id;

          return (
            <button
              key={item.id}
              type="button"
              disabled={pending}
              onClick={() => alternar(item)}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors disabled:opacity-60 ${
                item.concluida
                  ? "border-moss-200 bg-moss-50 text-moss-700"
                  : "border-charcoal-100 bg-charcoal-50/40 text-charcoal-700 hover:bg-charcoal-50"
              }`}
            >
              {item.concluida ? (
                <CheckCircle2 size={16} className="shrink-0 text-moss-600" />
              ) : (
                <Circle size={16} className="shrink-0 text-charcoal-300" />
              )}
              <span>
                {etapa.numero}. {etapa.titulo}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
