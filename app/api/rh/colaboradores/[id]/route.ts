import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Apenas administradores podem gerenciar o RH." },
      { status: 403 }
    );
  }

  const { id } = await params;
  const body = await request.json();

  const nome = String(body.nome ?? "").trim();
  const cargo = String(body.cargo ?? "").trim();
  const telefone = String(body.telefone ?? "").trim();
  const email = String(body.email ?? "").trim();
  const salarioRaw = String(body.salario ?? "").trim();
  const dataDemissaoRaw = String(body.dataDemissao ?? "").trim();
  const notasInternas = String(body.notasInternas ?? "").trim();

  await prisma.colaborador.update({
    where: { id },
    data: {
      ...(nome ? { nome } : {}),
      ...(cargo ? { cargo } : {}),
      telefone: telefone || null,
      email: email || null,
      salario: salarioRaw || null,
      dataDemissao: dataDemissaoRaw ? new Date(dataDemissaoRaw) : null,
      notasInternas: notasInternas || null,
    },
  });

  revalidatePath("/admin/rh");
  revalidatePath("/admin/rh/colaboradores");
  revalidatePath(`/admin/rh/colaboradores/${id}`);

  return NextResponse.json({ success: true });
}
