import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Apenas administradores podem gerenciar o RH." },
      { status: 403 }
    );
  }

  const body = await request.json();
  const colaboradorId = String(body.colaboradorId ?? "").trim();
  const periodoAquisitivoInicioRaw = String(
    body.periodoAquisitivoInicio ?? ""
  ).trim();
  const diasDireito = Math.max(
    1,
    parseInt(String(body.diasDireito ?? "30"), 10) || 30
  );
  const notasInternas = String(body.notasInternas ?? "").trim();

  if (!colaboradorId || !periodoAquisitivoInicioRaw) {
    return NextResponse.json(
      { error: "Selecione o colaborador e o início do período aquisitivo." },
      { status: 400 }
    );
  }

  const periodoAquisitivoInicio = new Date(periodoAquisitivoInicioRaw);
  const periodoAquisitivoFim = new Date(periodoAquisitivoInicio);
  periodoAquisitivoFim.setFullYear(periodoAquisitivoFim.getFullYear() + 1);

  const ferias = await prisma.ferias.create({
    data: {
      colaboradorId,
      periodoAquisitivoInicio,
      periodoAquisitivoFim,
      diasDireito,
      notasInternas: notasInternas || null,
    },
  });

  revalidatePath("/admin/rh");
  revalidatePath("/admin/rh/ferias");

  return NextResponse.json({ id: ferias.id });
}
