"use client";

import { useState, type FormEvent } from "react";

type NovoContratoFormProps = {
  orcamentoId: string;
  contratanteNome?: string;
  valorTotal?: string;
};

export default function NovoContratoForm({
  orcamentoId,
  contratanteNome,
  valorTotal,
}: NovoContratoFormProps) {
  const [tipoContratante, setTipoContratante] = useState<
    "PESSOA_FISICA" | "PESSOA_JURIDICA"
  >("PESSOA_FISICA");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setPending(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      orcamentoId,
      tipoContratante,
      contratanteNome: String(formData.get("contratanteNome") ?? "").trim(),
      contratanteDocumento: String(
        formData.get("contratanteDocumento") ?? ""
      ).trim(),
      contratanteEndereco: String(
        formData.get("contratanteEndereco") ?? ""
      ).trim(),
      contratanteCep: String(formData.get("contratanteCep") ?? "").trim(),
      contratanteBairro: String(
        formData.get("contratanteBairro") ?? ""
      ).trim(),
      contratanteCidade: String(
        formData.get("contratanteCidade") ?? ""
      ).trim(),
      contratanteUf: String(formData.get("contratanteUf") ?? "").trim(),
      contratanteRepNome: String(
        formData.get("contratanteRepNome") ?? ""
      ).trim(),
      contratanteRepCpf: String(
        formData.get("contratanteRepCpf") ?? ""
      ).trim(),
      contratanteRepRg: String(formData.get("contratanteRepRg") ?? "").trim(),
      contratanteRepCargo: String(
        formData.get("contratanteRepCargo") ?? ""
      ).trim(),
      enderecoInstalacao: String(
        formData.get("enderecoInstalacao") ?? ""
      ).trim(),
      prazoExecucaoDias: String(formData.get("prazoExecucaoDias") ?? "").trim(),
      valorTotal: String(formData.get("valorTotal") ?? "").trim(),
      foroCidade: String(formData.get("foroCidade") ?? "").trim(),
      foroUf: String(formData.get("foroUf") ?? "").trim(),
      dataContrato: String(formData.get("dataContrato") ?? "").trim(),
    };

    try {
      const res = await fetch("/api/contratos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Não foi possível salvar o contrato.");
        setPending(false);
        return;
      }

      window.location.href = `/admin/orcamentos/${orcamentoId}/contrato`;
    } catch {
      setError("Não foi possível salvar o contrato. Tente novamente.");
      setPending(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-charcoal-200 px-4 py-2.5 text-charcoal-800 focus:border-wood-500 focus:outline-none focus:ring-2 focus:ring-wood-200";
  const labelClass = "block text-sm font-medium text-charcoal-700 mb-1.5";

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-charcoal-100 bg-white p-6 shadow-sm space-y-5"
    >
      <div>
        <label htmlFor="tipoContratante" className={labelClass}>
          Tipo de contratante
        </label>
        <select
          id="tipoContratante"
          value={tipoContratante}
          onChange={(e) =>
            setTipoContratante(
              e.target.value as "PESSOA_FISICA" | "PESSOA_JURIDICA"
            )
          }
          className={inputClass}
        >
          <option value="PESSOA_FISICA">Pessoa física</option>
          <option value="PESSOA_JURIDICA">Pessoa jurídica</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="contratanteNome" className={labelClass}>
            {tipoContratante === "PESSOA_JURIDICA"
              ? "Razão social *"
              : "Nome completo *"}
          </label>
          <input
            id="contratanteNome"
            name="contratanteNome"
            type="text"
            required
            defaultValue={contratanteNome}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="contratanteDocumento" className={labelClass}>
            {tipoContratante === "PESSOA_JURIDICA" ? "CNPJ *" : "CPF *"}
          </label>
          <input
            id="contratanteDocumento"
            name="contratanteDocumento"
            type="text"
            required
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="contratanteEndereco" className={labelClass}>
          Endereço *
        </label>
        <input
          id="contratanteEndereco"
          name="contratanteEndereco"
          type="text"
          required
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
        <div>
          <label htmlFor="contratanteCep" className={labelClass}>
            CEP *
          </label>
          <input
            id="contratanteCep"
            name="contratanteCep"
            type="text"
            required
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="contratanteBairro" className={labelClass}>
            Bairro *
          </label>
          <input
            id="contratanteBairro"
            name="contratanteBairro"
            type="text"
            required
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="contratanteCidade" className={labelClass}>
            Cidade *
          </label>
          <input
            id="contratanteCidade"
            name="contratanteCidade"
            type="text"
            required
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="contratanteUf" className={labelClass}>
            UF *
          </label>
          <input
            id="contratanteUf"
            name="contratanteUf"
            type="text"
            maxLength={2}
            required
            className={inputClass}
          />
        </div>
      </div>

      {tipoContratante === "PESSOA_JURIDICA" && (
        <div className="rounded-lg bg-charcoal-50/60 p-4 space-y-4">
          <p className="text-sm font-medium text-charcoal-700">
            Representante legal
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="contratanteRepNome" className={labelClass}>
                Nome *
              </label>
              <input
                id="contratanteRepNome"
                name="contratanteRepNome"
                type="text"
                required
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="contratanteRepCargo" className={labelClass}>
                Cargo
              </label>
              <input
                id="contratanteRepCargo"
                name="contratanteRepCargo"
                type="text"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="contratanteRepCpf" className={labelClass}>
                CPF *
              </label>
              <input
                id="contratanteRepCpf"
                name="contratanteRepCpf"
                type="text"
                required
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="contratanteRepRg" className={labelClass}>
                RG *
              </label>
              <input
                id="contratanteRepRg"
                name="contratanteRepRg"
                type="text"
                required
                className={inputClass}
              />
            </div>
          </div>
        </div>
      )}

      <div>
        <label htmlFor="enderecoInstalacao" className={labelClass}>
          Endereço de instalação *
        </label>
        <input
          id="enderecoInstalacao"
          name="enderecoInstalacao"
          type="text"
          required
          placeholder="Se for o mesmo do contratante, copie acima"
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="prazoExecucaoDias" className={labelClass}>
            Prazo de execução (dias) *
          </label>
          <input
            id="prazoExecucaoDias"
            name="prazoExecucaoDias"
            type="number"
            min="1"
            required
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="valorTotal" className={labelClass}>
            Valor total (R$) *
          </label>
          <input
            id="valorTotal"
            name="valorTotal"
            type="number"
            step="0.01"
            min="0.01"
            required
            defaultValue={valorTotal}
            className={inputClass}
          />
        </div>
      </div>
      <p className="text-xs text-charcoal-400 -mt-3">
        O valor é dividido automaticamente em 30% sinal / 40% fabricação /
        30% entrega — dá pra ajustar depois de criar o contrato.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div>
          <label htmlFor="foroCidade" className={labelClass}>
            Foro — cidade *
          </label>
          <input
            id="foroCidade"
            name="foroCidade"
            type="text"
            required
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="foroUf" className={labelClass}>
            Foro — UF *
          </label>
          <input
            id="foroUf"
            name="foroUf"
            type="text"
            maxLength={2}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="dataContrato" className={labelClass}>
            Data do contrato
          </label>
          <input
            id="dataContrato"
            name="dataContrato"
            type="date"
            defaultValue={new Date().toISOString().slice(0, 10)}
            className={inputClass}
          />
        </div>
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
        {pending ? "Salvando..." : "Salvar contrato"}
      </button>
    </form>
  );
}
