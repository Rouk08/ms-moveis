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

  const diasGozadosRaw = String(body.diasGozados ?? "").trim();
  const dataGozoInicioRaw = String(body.dataGozoInicio ?? "").trim();
  const dataGozoFimRaw = String(body.dataGozoFim ?? "").trim();
  const notasInternas = String(body.notasInternas ?? "").trim();

  await prisma.ferias.update({
    where: { id },
    data: {
      ...(diasGozadosRaw
        ? { diasGozados: Math.max(0, parseInt(diasGozadosRaw, 10) || 0) }
        : {}),
      dataGozoInicio: dataGozoInicioRaw ? new Date(dataGozoInicioRaw) : null,
      dataGozoFim: dataGozoFimRaw ? new Date(dataGozoFimRaw) : null,
      notasInternas: notasInternas || null,
    },
  });

  revalidatePath("/admin/rh");
  revalidatePath("/admin/rh/ferias");
  revalidatePath(`/admin/rh/ferias/${id}`);

  return NextResponse.json({ success: true });
}
