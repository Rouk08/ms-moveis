import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";
import { prisma } from "@/lib/prisma";
import StatusBadgeContrato from "@/components/admin/StatusBadgeContrato";
import EditContratoForm from "@/components/admin/EditContratoForm";

export default async function ContratoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const orcamento = await prisma.orcamento.findUnique({
    where: { id },
    include: { contrato: true },
  });

  if (!orcamento || !orcamento.contrato) notFound();
  const contrato = orcamento.contrato;

  return (
    <div className="max-w-2xl">
      <Link
        href={`/admin/orcamentos/${id}`}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-charcoal-500 hover:text-charcoal-700 mb-6"
      >
        <ArrowLeft size={16} />
        Voltar para o orçamento
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-charcoal-800">
            Contrato — {contrato.contratanteNome}
          </h1>
          <p className="text-sm text-charcoal-500">
            {Number(contrato.valorTotal).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}{" "}
            · {contrato.prazoExecucaoDias} dias
          </p>
        </div>
        <StatusBadgeContrato status={contrato.status} />
      </div>

      <a
        href={`/api/contratos/${contrato.id}/pdf`}
        className="mb-6 inline-flex items-center gap-2 rounded-full bg-wood-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-wood-600 transition-colors"
      >
        <Download size={16} />
        Baixar PDF
      </a>

      <EditContratoForm
        id={contrato.id}
        tipoContratante={contrato.tipoContratante}
        contratanteNome={contrato.contratanteNome}
        contratanteDocumento={contrato.contratanteDocumento}
        contratanteEndereco={contrato.contratanteEndereco}
        contratanteCep={contrato.contratanteCep}
        contratanteBairro={contrato.contratanteBairro}
        contratanteCidade={contrato.contratanteCidade}
        contratanteUf={contrato.contratanteUf}
        contratanteRepNome={contrato.contratanteRepNome ?? ""}
        contratanteRepCpf={contrato.contratanteRepCpf ?? ""}
        contratanteRepRg={contrato.contratanteRepRg ?? ""}
        contratanteRepCargo={contrato.contratanteRepCargo ?? ""}
        enderecoInstalacao={contrato.enderecoInstalacao}
        prazoExecucaoDias={contrato.prazoExecucaoDias}
        valorTotal={contrato.valorTotal.toString()}
        foroCidade={contrato.foroCidade}
        foroUf={contrato.foroUf}
        dataContrato={contrato.dataContrato.toISOString().slice(0, 10)}
        status={contrato.status}
        notasInternas={contrato.notasInternas ?? ""}
      />
    </div>
  );
}
