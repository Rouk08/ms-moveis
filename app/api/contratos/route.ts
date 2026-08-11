import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { TipoContratante } from "@/lib/generated/prisma/enums";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const body = await request.json();
  const orcamentoId = String(body.orcamentoId ?? "").trim();
  const tipoContratante: TipoContratante =
    String(body.tipoContratante ?? "") === "PESSOA_JURIDICA"
      ? "PESSOA_JURIDICA"
      : "PESSOA_FISICA";
  const contratanteNome = String(body.contratanteNome ?? "").trim();
  const contratanteDocumento = String(body.contratanteDocumento ?? "").trim();
  const contratanteEndereco = String(body.contratanteEndereco ?? "").trim();
  const contratanteCep = String(body.contratanteCep ?? "").trim();
  const contratanteBairro = String(body.contratanteBairro ?? "").trim();
  const contratanteCidade = String(body.contratanteCidade ?? "").trim();
  const contratanteUf = String(body.contratanteUf ?? "").trim();
  const contratanteRepNome = String(body.contratanteRepNome ?? "").trim();
  const contratanteRepCpf = String(body.contratanteRepCpf ?? "").trim();
  const contratanteRepRg = String(body.contratanteRepRg ?? "").trim();
  const contratanteRepCargo = String(body.contratanteRepCargo ?? "").trim();
  const enderecoInstalacao = String(body.enderecoInstalacao ?? "").trim();
  const prazoExecucaoDias = Math.max(
    1,
    parseInt(String(body.prazoExecucaoDias ?? ""), 10) || 0
  );
  const valorTotalRaw = String(body.valorTotal ?? "").trim();
  const foroCidade = String(body.foroCidade ?? "").trim();
  const foroUf = String(body.foroUf ?? "").trim();
  const dataContratoRaw = String(body.dataContrato ?? "").trim();

  if (
    !orcamentoId ||
    !contratanteNome ||
    !contratanteDocumento ||
    !contratanteEndereco ||
    !contratanteCep ||
    !contratanteBairro ||
    !contratanteCidade ||
    !contratanteUf ||
    !enderecoInstalacao ||
    !prazoExecucaoDias ||
    !valorTotalRaw ||
    !foroCidade ||
    !foroUf
  ) {
    return NextResponse.json(
      { error: "Preencha todos os campos obrigatórios." },
      { status: 400 }
    );
  }

  if (
    tipoContratante === "PESSOA_JURIDICA" &&
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

  const valorTotal = Number(valorTotalRaw.replace(",", "."));
  if (Number.isNaN(valorTotal) || valorTotal <= 0) {
    return NextResponse.json(
      { error: "Valor total inválido." },
      { status: 400 }
    );
  }

  const valorSinal = Math.round(valorTotal * 0.3 * 100) / 100;
  const valorFabricacao = Math.round(valorTotal * 0.4 * 100) / 100;
  const valorEntrega =
    Math.round((valorTotal - valorSinal - valorFabricacao) * 100) / 100;

  const contrato = await prisma.contrato.create({
    data: {
      orcamentoId,
      tipoContratante,
      contratanteNome,
      contratanteDocumento,
      contratanteEndereco,
      contratanteCep,
      contratanteBairro,
      contratanteCidade,
      contratanteUf,
      contratanteRepNome:
        tipoContratante === "PESSOA_JURIDICA" ? contratanteRepNome : null,
      contratanteRepCpf:
        tipoContratante === "PESSOA_JURIDICA" ? contratanteRepCpf : null,
      contratanteRepRg:
        tipoContratante === "PESSOA_JURIDICA" ? contratanteRepRg : null,
      contratanteRepCargo:
        tipoContratante === "PESSOA_JURIDICA"
          ? contratanteRepCargo || null
          : null,
      enderecoInstalacao,
      prazoExecucaoDias,
      valorTotal,
      valorSinal,
      valorFabricacao,
      valorEntrega,
      foroCidade,
      foroUf,
      ...(dataContratoRaw ? { dataContrato: new Date(dataContratoRaw) } : {}),
    },
  });

  revalidatePath(`/admin/orcamentos/${orcamentoId}`);
  revalidatePath(`/admin/orcamentos/${orcamentoId}/contrato`);

  return NextResponse.json({ id: contrato.id });
}
