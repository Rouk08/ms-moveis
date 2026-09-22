import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { MARCENEIRO_COOKIE, tokenMarceneiroEsperado } from "@/lib/marceneiro-auth";

async function autorizado() {
  const store = await cookies();
  return store.get(MARCENEIRO_COOKIE)?.value === tokenMarceneiroEsperado();
}

// Só marca/desmarca conclusão, e só em ordem — o marceneiro precisa
// concluir a etapa 1 antes da 2, a 2 antes da 3, e assim por diante.
// Só pode desmarcar a última etapa concluída (senão criaria buracos na
// sequência). Edição livre continua exclusiva do admin, em
// /api/contratos/[id]/etapas-fabricacao/[itemId].
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ itemId: string }> }
) {
  if (!(await autorizado())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { itemId } = await params;
  const item = await prisma.etapaFabricacaoItem.findUnique({
    where: { id: itemId },
  });
  if (!item) {
    return NextResponse.json({ error: "Etapa não encontrada." }, { status: 404 });
  }

  const body = await request.json();
  if (typeof body.concluida !== "boolean") {
    return NextResponse.json(
      { error: "Informe se a etapa está concluída." },
      { status: 400 }
    );
  }

  const itensDoContrato = await prisma.etapaFabricacaoItem.findMany({
    where: { contratoId: item.contratoId },
    orderBy: { numero: "asc" },
  });
  const concluidos = itensDoContrato.filter((i) => i.concluida);
  const proximoNumero = concluidos.length > 0
    ? Math.max(...concluidos.map((i) => i.numero)) + 1
    : itensDoContrato[0]?.numero ?? 1;
  const ultimoConcluidoNumero =
    concluidos.length > 0 ? Math.max(...concluidos.map((i) => i.numero)) : null;

  if (body.concluida) {
    if (item.numero !== proximoNumero) {
      return NextResponse.json(
        { error: "Conclua as etapas anteriores primeiro." },
        { status: 409 }
      );
    }
  } else {
    if (item.numero !== ultimoConcluidoNumero) {
      return NextResponse.json(
        { error: "Só é possível desmarcar a última etapa concluída." },
        { status: 409 }
      );
    }
  }

  await prisma.etapaFabricacaoItem.update({
    where: { id: itemId },
    data: {
      concluida: body.concluida,
      dataConclusao: body.concluida ? new Date() : null,
    },
  });

  revalidatePath("/producao");
  revalidatePath("/admin/producao");

  return NextResponse.json({ success: true });
}
