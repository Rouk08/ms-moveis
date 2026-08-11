import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCompanyInfo } from "@/lib/company";
import ContratoTemplate from "@/lib/pdf/contrato-template";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { id } = await params;
  const contrato = await prisma.contrato.findUnique({
    where: { id },
    include: { orcamento: { select: { nome: true } } },
  });

  if (!contrato) {
    return NextResponse.json(
      { error: "Contrato não encontrado." },
      { status: 404 }
    );
  }

  const buffer = await renderToBuffer(
    <ContratoTemplate
      contrato={{
        tipoContratante: contrato.tipoContratante,
        contratanteNome: contrato.contratanteNome,
        contratanteDocumento: contrato.contratanteDocumento,
        contratanteEndereco: contrato.contratanteEndereco,
        contratanteCep: contrato.contratanteCep,
        contratanteBairro: contrato.contratanteBairro,
        contratanteCidade: contrato.contratanteCidade,
        contratanteUf: contrato.contratanteUf,
        contratanteRepNome: contrato.contratanteRepNome,
        contratanteRepCpf: contrato.contratanteRepCpf,
        contratanteRepRg: contrato.contratanteRepRg,
        contratanteRepCargo: contrato.contratanteRepCargo,
        enderecoInstalacao: contrato.enderecoInstalacao,
        prazoExecucaoDias: contrato.prazoExecucaoDias,
        valorTotal: Number(contrato.valorTotal),
        valorSinal: Number(contrato.valorSinal),
        valorFabricacao: Number(contrato.valorFabricacao),
        valorEntrega: Number(contrato.valorEntrega),
        foroCidade: contrato.foroCidade,
        foroUf: contrato.foroUf,
        dataContrato: contrato.dataContrato,
      }}
      company={getCompanyInfo()}
    />
  );

  if (contrato.status === "RASCUNHO") {
    await prisma.contrato.update({
      where: { id },
      data: { status: "GERADO" },
    });
  }

  const nomeArquivo = `contrato-${contrato.orcamento.nome
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")}.pdf`;

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${nomeArquivo}"`,
    },
  });
}
