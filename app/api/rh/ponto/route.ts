import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { TipoPonto } from "@/lib/generated/prisma/enums";

const TIPO_VALUES: TipoPonto[] = ["ENTRADA", "SAIDA"];

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
  const tipoRaw = String(body.tipo ?? "");
  const tipo = TIPO_VALUES.includes(tipoRaw as TipoPonto)
    ? (tipoRaw as TipoPonto)
    : undefined;
  const dataHoraRaw = String(body.dataHora ?? "").trim();
  const notasInternas = String(body.notasInternas ?? "").trim();

  if (!colaboradorId || !tipo || !dataHoraRaw) {
    return NextResponse.json(
      { error: "Selecione o colaborador, o tipo e a data/hora." },
      { status: 400 }
    );
  }

  await prisma.ponto.create({
    data: {
      colaboradorId,
      tipo,
      dataHora: new Date(dataHoraRaw),
      notasInternas: notasInternas || "Registro manual (correção)",
    },
  });

  revalidatePath("/admin/rh/ponto");

  return NextResponse.json({ success: true });
}
