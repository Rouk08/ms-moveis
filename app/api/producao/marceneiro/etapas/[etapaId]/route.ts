import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { MARCENEIRO_COOKIE, tokenMarceneiroEsperado } from "@/lib/marceneiro-auth";

async function autorizado() {
  const store = await cookies();
  return store.get(MARCENEIRO_COOKIE)?.value === tokenMarceneiroEsperado();
}

// Só marca/desmarca conclusão — o marceneiro não edita data, nome nem
// exclui etapa (isso continua exclusivo do admin, em
// /api/contratos/[id]/etapas/[etapaId]).
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ etapaId: string }> }
) {
  if (!(await autorizado())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { etapaId } = await params;
  const etapa = await prisma.etapaProducao.findUnique({
    where: { id: etapaId },
  });
  if (!etapa) {
    return NextResponse.json(
      { error: "Etapa não encontrada." },
      { status: 404 }
    );
  }

  const body = await request.json();
  if (typeof body.concluida !== "boolean") {
    return NextResponse.json(
      { error: "Informe se a etapa está concluída." },
      { status: 400 }
    );
  }

  await prisma.etapaProducao.update({
    where: { id: etapaId },
    data: {
      concluida: body.concluida,
      dataConclusao: body.concluida ? new Date() : null,
    },
  });

  revalidatePath("/producao");
  revalidatePath("/admin/producao");

  return NextResponse.json({ success: true });
}
