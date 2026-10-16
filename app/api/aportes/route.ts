import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const body = await request.json();
  const socio = String(body.socio ?? "").trim();
  const valorRaw = String(body.valor ?? "").trim();
  const dataRaw = String(body.data ?? "").trim();
  const observacao = String(body.observacao ?? "").trim();

  if (!socio || !valorRaw || !dataRaw) {
    return NextResponse.json(
      { error: "Preencha sócio, valor e data." },
      { status: 400 }
    );
  }

  const aporte = await prisma.aporte.create({
    data: {
      socio,
      valor: valorRaw,
      data: new Date(dataRaw),
      observacao: observacao || null,
    },
  });

  revalidatePath("/admin/financeiro");
  revalidatePath("/admin/financeiro/aportes");

  return NextResponse.json({ id: aporte.id });
}
