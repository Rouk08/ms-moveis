import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { OrcamentoStatus } from "@/lib/generated/prisma/enums";

const STATUS_VALUES: OrcamentoStatus[] = [
  "NOVO",
  "EM_ANDAMENTO",
  "APROVADO",
  "RECUSADO",
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
  const notasInternas = String(body.notasInternas ?? "").trim();

  await prisma.orcamento.update({
    where: { id },
    data: {
      ...(status ? { status } : {}),
      valorEstimado: valorRaw || null,
      notasInternas: notasInternas || null,
    },
  });

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

  revalidatePath("/admin");
  revalidatePath("/admin/orcamentos");

  return NextResponse.json({ success: true });
}
