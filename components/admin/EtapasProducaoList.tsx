"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, Circle, Plus, Trash2 } from "lucide-react";

export type EtapaProducaoItem = {
  id: string;
  nome: string;
  dataPrevista: string;
  concluida: boolean;
  observacao: string | null;
};

type EtapasProducaoListProps = {
  contratoId: string;
  etapasIniciais: EtapaProducaoItem[];
};

export default function EtapasProducaoList({
  contratoId,
  etapasIniciais,
}: EtapasProducaoListProps) {
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<string | null>(null);

  const toggleConcluida = async (etapaId: string, concluida: boolean) => {
    setPending(etapaId);
    await fetch(`/api/contratos/${contratoId}/etapas/${etapaId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ concluida }),
    });
    window.location.reload();
  };

  const editarData = async (etapaId: string, dataPrevista: string) => {
    setPending(etapaId);
    await fetch(`/api/contratos/${contratoId}/etapas/${etapaId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dataPrevista }),
    });
    window.location.reload();
  };

  const excluirEtapa = async (etapaId: string) => {
    if (!window.confirm("Excluir esta etapa do calendário?")) return;
    setPending(etapaId);
    await fetch(`/api/contratos/${contratoId}/etapas/${etapaId}`, {
      method: "DELETE",
    });
    window.location.reload();
  };

  const adicionarEtapa = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const payload = {
      nome: String(formData.get("nome") ?? "").trim(),
      dataPrevista: String(formData.get("dataPrevista") ?? "").trim(),
    };

    if (!payload.nome || !payload.dataPrevista) {
      setError("Preencha o nome e a data da etapa.");
      return;
    }

    const res = await fetch(`/api/contratos/${contratoId}/etapas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Não foi possível adicionar a etapa.");
      return;
    }
    window.location.reload();
  };

  if (etapasIniciais.length === 0 && !showForm) {
    return (
      <div className="rounded-2xl border border-charcoal-100 bg-white p-6 shadow-sm mb-6">
        <h2 className="font-semibold text-charcoal-800 mb-2">
          Calendário de produção
        </h2>
        <p className="text-sm text-charcoal-400 mb-3">
          Nenhuma etapa ainda — o calendário é criado automaticamente
          quando o contrato é marcado como assinado.
        </p>
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-charcoal-100 px-3 py-2 text-sm font-medium text-charcoal-700 hover:bg-charcoal-200"
        >
          <Plus size={15} />
          Adicionar etapa manualmente
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-charcoal-100 bg-white p-6 shadow-sm mb-6">
      <h2 className="font-semibold text-charcoal-800 mb-4">
        Calendário de produção
      </h2>

      <div className="space-y-2">
        {etapasIniciais.map((etapa) => (
          <div
            key={etapa.id}
            className={`flex flex-wrap items-center gap-3 rounded-lg border px-3 py-2.5 ${
              etapa.concluida
                ? "border-moss-200 bg-moss-50/60"
                : "border-charcoal-200"
            }`}
          >
            <button
              type="button"
              onClick={() => toggleConcluida(etapa.id, !etapa.concluida)}
              disabled={pending === etapa.id}
              aria-label={etapa.concluida ? "Marcar como pendente" : "Marcar como concluída"}
              className="shrink-0"
            >
              {etapa.concluida ? (
                <CheckCircle2 size={20} className="text-moss-600" />
              ) : (
                <Circle size={20} className="text-charcoal-300" />
              )}
            </button>
            <span
              className={`flex-1 min-w-[160px] text-sm ${
                etapa.concluida
                  ? "text-charcoal-500 line-through"
                  : "text-charcoal-800"
              }`}
            >
              {etapa.nome}
            </span>
            <input
              type="date"
              defaultValue={etapa.dataPrevista.slice(0, 10)}
              onChange={(e) => editarData(etapa.id, e.target.value)}
              disabled={pending === etapa.id}
              className="rounded-lg border border-charcoal-200 px-2.5 py-1.5 text-sm text-charcoal-700 focus:border-wood-500 focus:outline-none focus:ring-2 focus:ring-wood-200"
            />
            <button
              type="button"
              onClick={() => excluirEtapa(etapa.id)}
              disabled={pending === etapa.id}
              aria-label="Excluir etapa"
              className="rounded-lg p-1.5 text-charcoal-400 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4">
        {!showForm ? (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-charcoal-100 px-3 py-2 text-sm font-medium text-charcoal-700 hover:bg-charcoal-200"
          >
            <Plus size={15} />
            Adicionar etapa
          </button>
        ) : (
          <form
            onSubmit={adicionarEtapa}
            className="mt-2 flex flex-wrap items-end gap-3 rounded-lg border border-charcoal-200 p-4"
          >
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-medium text-charcoal-500 mb-1">
                Nome da etapa
              </label>
              <input
                name="nome"
                type="text"
                required
                placeholder="Ex: Ajustes finais"
                className="w-full rounded-lg border border-charcoal-200 px-3 py-2 text-sm text-charcoal-800 focus:border-wood-500 focus:outline-none focus:ring-2 focus:ring-wood-200"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-charcoal-500 mb-1">
                Data prevista
              </label>
              <input
                name="dataPrevista"
                type="date"
                required
                className="rounded-lg border border-charcoal-200 px-3 py-2 text-sm text-charcoal-800 focus:border-wood-500 focus:outline-none focus:ring-2 focus:ring-wood-200"
              />
            </div>
            <button
              type="submit"
              className="rounded-full bg-wood-500 px-5 py-2 text-sm font-semibold text-white hover:bg-wood-600"
            >
              Adicionar
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-full px-4 py-2 text-sm font-medium text-charcoal-500 hover:bg-charcoal-50"
            >
              Cancelar
            </button>
            {error && (
              <p className="w-full text-sm text-red-600" role="alert">
                {error}
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
