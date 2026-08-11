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

  const tipoRaw = String(body.tipo ?? "");
  const tipo = TIPO_VALUES.includes(tipoRaw as TipoAfastamento)
    ? (tipoRaw as TipoAfastamento)
    : undefined;
  const dataInicioRaw = String(body.dataInicio ?? "").trim();
  const dataFimRaw = String(body.dataFim ?? "").trim();
  const motivo = String(body.motivo ?? "").trim();
  const notasInternas = String(body.notasInternas ?? "").trim();

  await prisma.afastamento.update({
    where: { id },
    data: {
      ...(tipo ? { tipo } : {}),
      ...(dataInicioRaw ? { dataInicio: new Date(dataInicioRaw) } : {}),
      dataFim: dataFimRaw ? new Date(dataFimRaw) : null,
      motivo: motivo || null,
      notasInternas: notasInternas || null,
    },
  });

  revalidatePath("/admin/rh");
  revalidatePath("/admin/rh/afastamentos");
  revalidatePath(`/admin/rh/afastamentos/${id}`);

  return NextResponse.json({ success: true });
}
