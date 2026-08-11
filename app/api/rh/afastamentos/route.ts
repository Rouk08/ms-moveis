import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { TipoAfastamento } from "@/lib/generated/prisma/enums";

const TIPO_VALUES: TipoAfastamento[] = [
  "ATESTADO",
  "LICENCA_MEDICA",
  "INSS_AUXILIO_DOENCA",
  "MATERNIDADE",
  "PATERNIDADE",
  "LUTO",
  "OUTROS",
];

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
  const tipoRaw = String(body.tipo ?? "OUTROS");
  const tipo = TIPO_VALUES.includes(tipoRaw as TipoAfastamento)
    ? (tipoRaw as TipoAfastamento)
    : "OUTROS";
  const dataInicioRaw = String(body.dataInicio ?? "").trim();
  const dataFimRaw = String(body.dataFim ?? "").trim();
  const motivo = String(body.motivo ?? "").trim();
  const notasInternas = String(body.notasInternas ?? "").trim();

  if (!colaboradorId || !dataInicioRaw) {
    return NextResponse.json(
      { error: "Selecione o colaborador e a data de início." },
      { status: 400 }
    );
  }

  const afastamento = await prisma.afastamento.create({
    data: {
      colaboradorId,
      tipo,
      dataInicio: new Date(dataInicioRaw),
      dataFim: dataFimRaw ? new Date(dataFimRaw) : null,
      motivo: motivo || null,
      notasInternas: notasInternas || null,
    },
  });

  revalidatePath("/admin/rh");
  revalidatePath("/admin/rh/afastamentos");

  return NextResponse.json({ id: afastamento.id });
}
