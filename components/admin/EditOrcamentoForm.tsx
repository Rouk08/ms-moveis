"use client";

import { useState, type FormEvent } from "react";
import { projectTypes } from "@/lib/data";
import ItensOrcamentoField, {
  totalItens,
  type ItemOrcamento,
} from "@/components/admin/ItensOrcamentoField";
import type { OrcamentoStatus } from "@/lib/generated/prisma/enums";

const statusOptions = [
  { value: "NOVO", label: "Novo" },
  { value: "EM_ANDAMENTO", label: "Em andamento" },
  { value: "APROVADO", label: "Aprovado" },
  { value: "RECUSADO", label: "Recusado" },
];

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

type EditOrcamentoFormProps = {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  tipoProjeto: string[];
  mensagem: string;
  status: OrcamentoStatus;
  valorEstimado: string;
  desconto: string;
  notasInternas: string;
  incluiProjeto: boolean;
  itensIniciais: ItemOrcamento[];
};

export default function EditOrcamentoForm({
  id,
  nome,
  telefone,
  email,
  tipoProjeto: tipoProjetoInicial,
  mensagem,
  status,
  valorEstimado,
  desconto: descontoInicial,
  notasInternas,
  incluiProjeto,
  itensIniciais,
}: EditOrcamentoFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [tipoProjeto, setTipoProjeto] = useState<string[]>(tipoProjetoInicial);
  const [itens, setItens] = useState<ItemOrcamento[]>(itensIniciais);
  const [valorManual, setValorManual] = useState(valorEstimado);
  const [desconto, setDesconto] = useState(descontoInicial);

  const toggleTipo = (tipo: string) => {
    setTipoProjeto((prev) =>
      prev.includes(tipo) ? prev.filter((t) => t !== tipo) : [...prev, tipo]
    );
  };

  const usaItens = itens.length > 0;
  const descontoNum = parseFloat(desconto.replace(",", ".")) || 0;
  const baseValor = usaItens ? totalItens(itens) : parseFloat(valorManual) || 0;
  const valorEfetivo = Math.max(0, baseValor - descontoNum).toFixed(2);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setPending(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      nome: String(formData.get("nome") ?? "").trim(),
      telefone: String(formData.get("telefone") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      tipoProjeto,
      mensagem: String(formData.get("mensagem") ?? "").trim(),
      status: String(formData.get("status") ?? ""),
      valorEstimado: valorEfetivo,
      desconto: descontoNum.toFixed(2),
      notasInternas: String(formData.get("notasInternas") ?? "").trim(),
      incluiProjeto: formData.get("incluiProjeto") === "on",
      itens: itens.map((i) => ({
        categoria: i.categoria,
        item: i.item,
        valorUnitario: i.valorUnitario.replace(",", ".") || "0",
        observacao: i.observacao.trim(),
      })),
    };

    try {
      const res = await fetch(`/api/orcamentos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Não foi possível salvar as alterações.");
        setPending(false);
        return;
      }

      window.location.reload();
    } catch {
      setError("Não foi possível salvar as alterações. Tente novamente.");
      setPending(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-charcoal-100 bg-white p-6 shadow-sm space-y-5"
    >
      <h2 className="font-semibold text-charcoal-800">Dados do cliente</h2>

      <div>
        <label
          htmlFor="nome"
          className="block text-sm font-medium text-charcoal-700 mb-1.5"
        >
          Nome do cliente *
        </label>
        <input
          id="nome"
          name="nome"
          type="text"
          required
          defaultValue={nome}
          className="w-full rounded-lg border border-charcoal-200 px-4 py-2.5 text-charcoal-800 focus:border-wood-500 focus:outline-none focus:ring-2 focus:ring-wood-200"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label
            htmlFor="telefone"
            className="block text-sm font-medium text-charcoal-700 mb-1.5"
          >
            Telefone *
          </label>
          <input
            id="telefone"
            name="telefone"
            type="text"
            required
            defaultValue={telefone}
            placeholder="(47) 99999-8888"
            className="w-full rounded-lg border border-charcoal-200 px-4 py-2.5 text-charcoal-800 focus:border-wood-500 focus:outline-none focus:ring-2 focus:ring-wood-200"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-charcoal-700 mb-1.5"
          >
            E-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            defaultValue={email}
            className="w-full rounded-lg border border-charcoal-200 px-4 py-2.5 text-charcoal-800 focus:border-wood-500 focus:outline-none focus:ring-2 focus:ring-wood-200"
          />
        </div>
      </div>

      <div>
        <span className="block text-sm font-medium text-charcoal-700 mb-1.5">
          Tipo de projeto (selecione um ou mais)
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {projectTypes.map((type) => (
            <label
              key={type}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm cursor-pointer transition-colors ${
                tipoProjeto.includes(type)
                  ? "border-wood-500 bg-wood-50 text-wood-700"
                  : "border-charcoal-200 text-charcoal-600 hover:bg-charcoal-50"
              }`}
            >
              <input
                type="checkbox"
                checked={tipoProjeto.includes(type)}
                onChange={() => toggleTipo(type)}
                className="h-4 w-4 rounded border-charcoal-300 text-wood-500 focus:ring-wood-200"
              />
              {type}
            </label>
          ))}
        </div>
      </div>

      <ItensOrcamentoField
        tipoProjeto={tipoProjeto}
        itens={itens}
        onChange={setItens}
      />

      <div>
        <label
          htmlFor="mensagem"
          className="block text-sm font-medium text-charcoal-700 mb-1.5"
        >
          Mensagem *
        </label>
        <textarea
          id="mensagem"
          name="mensagem"
          rows={4}
          required
          defaultValue={mensagem}
          className="w-full rounded-lg border border-charcoal-200 px-4 py-2.5 text-charcoal-800 focus:border-wood-500 focus:outline-none focus:ring-2 focus:ring-wood-200"
        />
      </div>

      <div className="pt-2 border-t border-charcoal-100" />

      <h2 className="font-semibold text-charcoal-800">
        Acompanhamento interno
      </h2>

      <div>
        <label
          htmlFor="status"
          className="block text-sm font-medium text-charcoal-700 mb-1.5"
        >
          Status
        </label>
        <select
          id="status"
          name="status"
          defaultValue={status}
          className="w-full rounded-lg border border-charcoal-200 px-4 py-2.5 text-charcoal-800 focus:border-wood-500 focus:outline-none focus:ring-2 focus:ring-wood-200"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label
            htmlFor="valorEstimado"
            className="block text-sm font-medium text-charcoal-700 mb-1.5"
          >
            {usaItens ? "Total dos itens (R$)" : "Valor estimado (R$)"}
          </label>
          {usaItens ? (
            <div className="w-full rounded-lg border border-charcoal-100 bg-charcoal-50 px-4 py-2.5 text-charcoal-800">
              {formatBRL(totalItens(itens))}
            </div>
          ) : (
            <input
              id="valorEstimado"
              type="number"
              step="0.01"
              min="0"
              value={valorManual}
              onChange={(e) => setValorManual(e.target.value)}
              placeholder="0,00"
              className="w-full rounded-lg border border-charcoal-200 px-4 py-2.5 text-charcoal-800 focus:border-wood-500 focus:outline-none focus:ring-2 focus:ring-wood-200"
            />
          )}
        </div>
        <div>
          <label
            htmlFor="desconto"
            className="block text-sm font-medium text-charcoal-700 mb-1.5"
          >
            Desconto (R$)
          </label>
          <input
            id="desconto"
            type="number"
            step="0.01"
            min="0"
            value={desconto}
            onChange={(e) => setDesconto(e.target.value)}
            placeholder="0,00"
            className="w-full rounded-lg border border-charcoal-200 px-4 py-2.5 text-charcoal-800 focus:border-wood-500 focus:outline-none focus:ring-2 focus:ring-wood-200"
          />
        </div>
      </div>
      <p className="-mt-3 text-xs text-charcoal-400">
        Valor final (após desconto):{" "}
        <span className="font-semibold text-charcoal-600">
          {formatBRL(parseFloat(valorEfetivo))}
        </span>
      </p>

      <div>
        <label className="flex items-center gap-2.5 text-sm font-medium text-charcoal-700">
          <input
            type="checkbox"
            name="incluiProjeto"
            defaultChecked={incluiProjeto}
            className="h-4 w-4 rounded border-charcoal-300 text-wood-500 focus:ring-wood-200"
          />
          Incluir projeto (elaboração de projeto)
        </label>
        <p className="mt-1.5 text-xs text-charcoal-400">
          Controla se &ldquo;Projeto&rdquo; aparece no PDF do orçamento
          enviado ao cliente.
        </p>
      </div>

      <div>
        <label
          htmlFor="notasInternas"
          className="block text-sm font-medium text-charcoal-700 mb-1.5"
        >
          Notas internas
        </label>
        <textarea
          id="notasInternas"
          name="notasInternas"
          rows={4}
          defaultValue={notasInternas}
          placeholder="Observações visíveis só para a equipe..."
          className="w-full rounded-lg border border-charcoal-200 px-4 py-2.5 text-charcoal-800 focus:border-wood-500 focus:outline-none focus:ring-2 focus:ring-wood-200"
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
        className="rounded-full bg-wood-500 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-wood-600 disabled:opacity-60 transition-colors"
      >
        {pending ? "Salvando..." : "Salvar alterações"}
      </button>
    </form>
  );
}
