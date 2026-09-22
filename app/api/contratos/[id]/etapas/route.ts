import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { id } = await params;
  const contrato = await prisma.contrato.findUnique({ where: { id } });
  if (!contrato) {
    return NextResponse.json(
      { error: "Contrato não encontrado." },
      { status: 404 }
    );
  }

  const body = await request.json();
  const nome = String(body.nome ?? "").trim();
  const dataPrevistaRaw = String(body.dataPrevista ?? "").trim();

  if (!nome || !dataPrevistaRaw) {
    return NextResponse.json(
      { error: "Informe o nome e a data prevista da etapa." },
      { status: 400 }
    );
  }

  const ultimaOrdem = await prisma.etapaProducao.count({
    where: { contratoId: id },
  });

  await prisma.etapaProducao.create({
    data: {
      contratoId: id,
      ordem: ultimaOrdem,
      nome,
      dataPrevista: new Date(dataPrevistaRaw),
      observacao: String(body.observacao ?? "").trim() || null,
    },
  });

  revalidatePath(`/admin/orcamentos/${contrato.orcamentoId}/contrato`);
  revalidatePath("/admin/producao");

  return NextResponse.json({ success: true });
}
