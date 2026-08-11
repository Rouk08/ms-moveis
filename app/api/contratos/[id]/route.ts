import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type {
  StatusContrato,
  TipoContratante,
} from "@/lib/generated/prisma/enums";

const STATUS_VALUES: StatusContrato[] = ["RASCUNHO", "GERADO", "ASSINADO"];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  const existente = await prisma.contrato.findUnique({ where: { id } });
  if (!existente) {
    return NextResponse.json(
      { error: "Contrato não encontrado." },
      { status: 404 }
    );
  }

  const tipoContratante: TipoContratante =
    String(body.tipoContratante ?? existente.tipoContratante) ===
    "PESSOA_JURIDICA"
      ? "PESSOA_JURIDICA"
      : "PESSOA_FISICA";
  const contratanteRepNome = String(body.contratanteRepNome ?? "").trim();
  const contratanteRepCpf = String(body.contratanteRepCpf ?? "").trim();
  const contratanteRepRg = String(body.contratanteRepRg ?? "").trim();
  const contratanteRepCargo = String(body.contratanteRepCargo ?? "").trim();

  if (
    tipoContratante === "PESSOA_JURIDICA" &&
    body.contratanteRepNome !== undefined &&
    (!contratanteRepNome || !contratanteRepCpf || !contratanteRepRg)
  ) {
    return NextResponse.json(
      {
        error:
          "Para pessoa jurídica, preencha nome, CPF e RG do representante legal.",
      },
      { status: 400 }
    );
  }

  const statusRaw = String(body.status ?? "");
  const status = STATUS_VALUES.includes(statusRaw as StatusContrato)
    ? (statusRaw as StatusContrato)
    : undefined;

  const valorTotalRaw = String(body.valorTotal ?? "").trim();
  let valoresUpdate = {};
  if (valorTotalRaw) {
    const valorTotal = Number(valorTotalRaw.replace(",", "."));
    if (!Number.isNaN(valorTotal) && valorTotal > 0) {
      const valorSinal = Math.round(valorTotal * 0.3 * 100) / 100;
      const valorFabricacao = Math.round(valorTotal * 0.4 * 100) / 100;
      const valorEntrega =
        Math.round((valorTotal - valorSinal - valorFabricacao) * 100) / 100;
      valoresUpdate = { valorTotal, valorSinal, valorFabricacao, valorEntrega };
    }
  }

  const dataContratoRaw = String(body.dataContrato ?? "").trim();

  const contrato = await prisma.contrato.update({
    where: { id },
    data: {
      tipoContratante,
      ...(body.contratanteNome !== undefined
        ? { contratanteNome: String(body.contratanteNome).trim() }
        : {}),
      ...(body.contratanteDocumento !== undefined
        ? { contratanteDocumento: String(body.contratanteDocumento).trim() }
        : {}),
      ...(body.contratanteEndereco !== undefined
        ? { contratanteEndereco: String(body.contratanteEndereco).trim() }
        : {}),
      ...(body.contratanteCep !== undefined
        ? { contratanteCep: String(body.contratanteCep).trim() }
        : {}),
      ...(body.contratanteBairro !== undefined
        ? { contratanteBairro: String(body.contratanteBairro).trim() }
        : {}),
      ...(body.contratanteCidade !== undefined
        ? { contratanteCidade: String(body.contratanteCidade).trim() }
        : {}),
      ...(body.contratanteUf !== undefined
        ? { contratanteUf: String(body.contratanteUf).trim() }
        : {}),
      contratanteRepNome:
        tipoContratante === "PESSOA_JURIDICA"
          ? contratanteRepNome || existente.contratanteRepNome
          : null,
      contratanteRepCpf:
        tipoContratante === "PESSOA_JURIDICA"
          ? contratanteRepCpf || existente.contratanteRepCpf
          : null,
      contratanteRepRg:
        tipoContratante === "PESSOA_JURIDICA"
          ? contratanteRepRg || existente.contratanteRepRg
          : null,
      contratanteRepCargo:
        tipoContratante === "PESSOA_JURIDICA"
          ? contratanteRepCargo || existente.contratanteRepCargo
          : null,
      ...(body.enderecoInstalacao !== undefined
        ? { enderecoInstalacao: String(body.enderecoInstalacao).trim() }
        : {}),
      ...(body.prazoExecucaoDias !== undefined
        ? {
            prazoExecucaoDias: Math.max(
              1,
              parseInt(String(body.prazoExecucaoDias), 10) || 0
            ),
          }
        : {}),
      ...valoresUpdate,
      ...(body.foroCidade !== undefined
        ? { foroCidade: String(body.foroCidade).trim() }
        : {}),
      ...(body.foroUf !== undefined
        ? { foroUf: String(body.foroUf).trim() }
        : {}),
      ...(dataContratoRaw ? { dataContrato: new Date(dataContratoRaw) } : {}),
      ...(status ? { status } : {}),
      ...(body.notasInternas !== undefined
        ? { notasInternas: String(body.notasInternas).trim() || null }
        : {}),
    },
  });

  revalidatePath(`/admin/orcamentos/${contrato.orcamentoId}`);
  revalidatePath(`/admin/orcamentos/${contrato.orcamentoId}/contrato`);

  return NextResponse.json({ success: true });
}
