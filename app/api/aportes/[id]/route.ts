import { rm } from "fs/promises";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { aporteComprovantesDir } from "@/lib/uploads";

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

  const socio = String(body.socio ?? "").trim();
  const valorRaw = String(body.valor ?? "").trim();
  const dataRaw = String(body.data ?? "").trim();
  const observacao = String(body.observacao ?? "").trim();

  await prisma.aporte.update({
    where: { id },
    data: {
      ...(socio ? { socio } : {}),
      ...(valorRaw ? { valor: valorRaw } : {}),
      ...(dataRaw ? { data: new Date(dataRaw) } : {}),
      observacao: observacao || null,
    },
  });

  revalidatePath("/admin/financeiro");
  revalidatePath("/admin/financeiro/aportes");
  revalidatePath(`/admin/financeiro/aportes/${id}`);

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
  const aporte = await prisma.aporte.findUnique({ where: { id } });
  if (!aporte) {
    return NextResponse.json({ error: "Aporte não encontrado." }, { status: 404 });
  }

  await prisma.aporte.delete({ where: { id } });
  await rm(aporteComprovantesDir(id), { recursive: true, force: true });

  revalidatePath("/admin/financeiro");
  revalidatePath("/admin/financeiro/aportes");

  return NextResponse.json({ success: true });
}
