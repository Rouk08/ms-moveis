import { rm } from "fs/promises";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { orcamentoFotosDir } from "@/lib/uploads";
import { parseItensFromBody } from "@/lib/orcamento-itens";
import type {
  FormaPagamento,
  OrcamentoStatus,
} from "@/lib/generated/prisma/enums";

const STATUS_VALUES: OrcamentoStatus[] = [
  "NOVO",
  "EM_ANDAMENTO",
  "APROVADO",
  "RECUSADO",
];

const FORMA_PAGAMENTO_VALUES: FormaPagamento[] = [
  "DINHEIRO",
  "PIX",
  "CARTAO_CREDITO",
  "CARTAO_DEBITO",
  "BOLETO",
  "TRANSFERENCIA",
];

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

  const statusRaw = String(body.status ?? "");
  const status = STATUS_VALUES.includes(statusRaw as OrcamentoStatus)
    ? (statusRaw as OrcamentoStatus)
    : undefined;

  const valorRaw = String(body.valorEstimado ?? "").trim();
  const descontoRaw = String(body.desconto ?? "").trim();
  const notasInternas = String(body.notasInternas ?? "").trim();
  const incluiProjeto = body.incluiProjeto !== false;

  const nome = String(body.nome ?? "").trim();
  const telefone = String(body.telefone ?? "").trim();
  const email = String(body.email ?? "").trim();
  const mensagem = String(body.mensagem ?? "").trim();
  const tipoProjeto = Array.isArray(body.tipoProjeto)
    ? body.tipoProjeto.map((t: unknown) => String(t).trim()).filter(Boolean)
    : undefined;
  const itens = parseItensFromBody(body);

  const formaPagamentoRaw = String(body.formaPagamento ?? "").trim();
  const formaPagamento = FORMA_PAGAMENTO_VALUES.includes(
    formaPagamentoRaw as FormaPagamento
  )
    ? (formaPagamentoRaw as FormaPagamento)
    : null;
  const parcelado = body.parcelado === true;
  const numeroParcelasRaw = parseInt(String(body.numeroParcelas ?? ""), 10);
  const numeroParcelas =
    parcelado && Number.isFinite(numeroParcelasRaw) && numeroParcelasRaw > 1
      ? numeroParcelasRaw
      : null;

  if (!nome || !telefone || !mensagem) {
    return NextResponse.json(
      { error: "Preencha nome, telefone e mensagem." },
      { status: 400 }
    );
  }

  await prisma.$transaction([
    prisma.orcamento.update({
      where: { id },
      data: {
        nome,
        telefone,
        email: email || null,
        mensagem,
        ...(tipoProjeto ? { tipoProjeto } : {}),
        ...(status ? { status } : {}),
        valorEstimado: valorRaw || null,
        desconto: descontoRaw || null,
        notasInternas: notasInternas || null,
        incluiProjeto,
        formaPagamento,
        parcelado,
        numeroParcelas,
      },
    }),
    prisma.orcamentoItem.deleteMany({ where: { orcamentoId: id } }),
    ...(itens.length > 0
      ? [
          prisma.orcamentoItem.createMany({
            data: itens.map((i) => ({
              orcamentoId: id,
              categoria: i.categoria,
              item: i.item,
              valorUnitario: i.valorUnitario,
              observacao: i.observacao || null,
            })),
          }),
        ]
      : []),
  ]);

  revalidatePath("/admin");
  revalidatePath("/admin/orcamentos");
  revalidatePath(`/admin/orcamentos/${id}`);

  return NextResponse.json({ success: true });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { id } = await params;
  const orcamento = await prisma.orcamento.findUnique({
    where: { id },
    include: { contrato: true },
  });

  if (!orcamento) {
    return NextResponse.json(
      { error: "Orçamento não encontrado." },
      { status: 404 }
    );
  }

  if (orcamento.contrato) {
    return NextResponse.json(
      {
        error:
          "Não é possível excluir: há um contrato gerado a partir deste orçamento. Remova ou trate o contrato primeiro.",
      },
      { status: 409 }
    );
  }

  await prisma.orcamento.delete({ where: { id } });

  try {
    await rm(orcamentoFotosDir(id), { recursive: true, force: true });
  } catch {
    // Sem fotos no disco para este orçamento — nada a fazer.
  }

  revalidatePath("/admin");
  revalidatePath("/admin/orcamentos");

  return NextResponse.json({ success: true });
}
