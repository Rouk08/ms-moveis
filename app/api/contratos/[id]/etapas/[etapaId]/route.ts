import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; etapaId: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { id, etapaId } = await params;
  const etapa = await prisma.etapaProducao.findUnique({
    where: { id: etapaId },
  });
  if (!etapa || etapa.contratoId !== id) {
    return NextResponse.json(
      { error: "Etapa não encontrada." },
      { status: 404 }
    );
  }

  const body = await request.json();
  const data: Record<string, unknown> = {};

  if (typeof body.nome === "string" && body.nome.trim()) {
    data.nome = body.nome.trim();
  }
  if (typeof body.dataPrevista === "string" && body.dataPrevista.trim()) {
    data.dataPrevista = new Date(body.dataPrevista);
  }
  if (typeof body.observacao === "string") {
    data.observacao = body.observacao.trim() || null;
  }
  if (typeof body.concluida === "boolean") {
    data.concluida = body.concluida;
    data.dataConclusao = body.concluida ? new Date() : null;
  }

  await prisma.etapaProducao.update({ where: { id: etapaId }, data });

  const contrato = await prisma.contrato.findUnique({
    where: { id },
    select: { orcamentoId: true },
  });
  if (contrato) {
    revalidatePath(`/admin/orcamentos/${contrato.orcamentoId}/contrato`);
  }
  revalidatePath("/admin/producao");

  return NextResponse.json({ success: true });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; etapaId: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { id, etapaId } = await params;
  const etapa = await prisma.etapaProducao.findUnique({
    where: { id: etapaId },
  });
  if (!etapa || etapa.contratoId !== id) {
    return NextResponse.json(
      { error: "Etapa não encontrada." },
      { status: 404 }
    );
  }

  await prisma.etapaProducao.delete({ where: { id: etapaId } });

  const contrato = await prisma.contrato.findUnique({
    where: { id },
    select: { orcamentoId: true },
  });
  if (contrato) {
    revalidatePath(`/admin/orcamentos/${contrato.orcamentoId}/contrato`);
  }
  revalidatePath("/admin/producao");

  return NextResponse.json({ success: true });
}
