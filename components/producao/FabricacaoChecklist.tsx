"use client";

import { useMemo, useSyncExternalStore } from "react";
import { CheckSquare } from "lucide-react";
import { etapasFluxo } from "@/lib/fluxo-fabricacao";

const STORAGE_KEY = "ms_producao_checklist_peca";
const listeners = new Set<() => void>();

function getSnapshot() {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? "{}";
  } catch {
    return "{}";
  }
}

function getServerSnapshot() {
  return "{}";
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function writeChecklist(value: Record<number, boolean>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // localStorage indisponível (ex: navegação privada) — segue só em memória
  }
  listeners.forEach((notify) => notify());
}

export default function FabricacaoChecklist() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const marcados = useMemo(() => {
    try {
      return JSON.parse(raw) as Record<number, boolean>;
    } catch {
      return {};
    }
  }, [raw]);

  const alternar = (numero: number, valor: boolean) => {
    writeChecklist({ ...marcados, [numero]: valor });
  };

  const reiniciar = () => {
    if (!confirm("Deseja redefinir o checklist para iniciar uma nova peça ou móvel?")) return;
    writeChecklist({});
  };

  const total = etapasFluxo.length;
  const feitos = etapasFluxo.filter((e) => marcados[e.numero]).length;
  const pct = Math.round((feitos / total) * 100);

  return (
    <section className="print:hidden rounded-2xl border border-charcoal-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="flex items-center gap-2 text-base font-semibold text-wood-700">
            <CheckSquare size={18} />
            Checklist operacional da peça/móvel em bancada
          </h3>
          <p className="mt-0.5 text-sm text-charcoal-500">
            Marque as etapas finalizadas antes de liberar o móvel para a expedição.
          </p>
        </div>
        <button
          type="button"
          onClick={reiniciar}
          className="rounded-lg border border-charcoal-200 px-3 py-1.5 text-xs font-medium text-charcoal-600 hover:bg-charcoal-50"
        >
          Reiniciar checklist
        </button>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {etapasFluxo.map((etapa) => {
          const marcado = !!marcados[etapa.numero];
          return (
            <label
              key={etapa.numero}
              className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
                marcado
                  ? "border-wood-300 bg-wood-50 font-medium text-wood-700"
                  : "border-charcoal-100 bg-charcoal-50/40 text-charcoal-700"
              }`}
            >
              <input
                type="checkbox"
                checked={marcado}
                onChange={(e) => alternar(etapa.numero, e.target.checked)}
                className="h-4 w-4 accent-wood-600"
              />
              <span>
                {etapa.numero}. {etapa.titulo}
              </span>
            </label>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between rounded-lg bg-wood-50 px-4 py-2.5">
        <span className="text-sm font-medium text-wood-700">Status da fabricação:</span>
        <span className={`text-sm font-bold ${pct === 100 ? "text-moss-600" : "text-wood-700"}`}>
          {pct === 100
            ? "✓ 100% concluído — móvel liberado para embarque!"
            : `${feitos} de ${total} etapas validadas (${pct}%)`}
        </span>
      </div>
    </section>
  );
}
