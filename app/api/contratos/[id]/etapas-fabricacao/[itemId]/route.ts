import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Admin altera livremente, sem a restrição de ordem que vale para o
// marceneiro (ver /api/producao/marceneiro/fabricacao/[itemId]).
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { id, itemId } = await params;
  const item = await prisma.etapaFabricacaoItem.findUnique({
    where: { id: itemId },
  });
  if (!item || item.contratoId !== id) {
    return NextResponse.json({ error: "Etapa não encontrada." }, { status: 404 });
  }

  const body = await request.json();
  if (typeof body.concluida !== "boolean") {
    return NextResponse.json(
      { error: "Informe se a etapa está concluída." },
      { status: 400 }
    );
  }

  await prisma.etapaFabricacaoItem.update({
    where: { id: itemId },
    data: {
      concluida: body.concluida,
      dataConclusao: body.concluida ? new Date() : null,
    },
  });

  const contrato = await prisma.contrato.findUnique({
    where: { id },
    select: { orcamentoId: true },
  });
  if (contrato) {
    revalidatePath(`/admin/orcamentos/${contrato.orcamentoId}/contrato`);
  }
  revalidatePath("/admin/producao");
  revalidatePath("/producao");

  return NextResponse.json({ success: true });
}
