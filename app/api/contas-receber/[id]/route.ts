import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { StatusRecebimento } from "@/lib/generated/prisma/enums";

const STATUS_VALUES: StatusRecebimento[] = ["PENDENTE", "RECEBIDO"];

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

  const cliente = String(body.cliente ?? "").trim();
  const telefone = String(body.telefone ?? "").trim();
  const email = String(body.email ?? "").trim();
  const valorRaw = String(body.valor ?? "").trim();
  const vencimentoRaw = String(body.vencimento ?? "").trim();
  const statusRaw = String(body.status ?? "");
  const status = STATUS_VALUES.includes(statusRaw as StatusRecebimento)
    ? (statusRaw as StatusRecebimento)
    : undefined;
  const notasInternas = String(body.notasInternas ?? "").trim();

  await prisma.contaReceber.update({
    where: { id },
    data: {
      ...(cliente ? { cliente } : {}),
      telefone: telefone || null,
      email: email || null,
      ...(valorRaw ? { valor: valorRaw } : {}),
      ...(vencimentoRaw ? { vencimento: new Date(vencimentoRaw) } : {}),
      ...(status
        ? {
            status,
            dataRecebimento: status === "RECEBIDO" ? new Date() : null,
          }
        : {}),
      notasInternas: notasInternas || null,
    },
  });

  revalidatePath("/admin/financeiro");
  revalidatePath("/admin/financeiro/contas-a-receber");
  revalidatePath(`/admin/financeiro/contas-a-receber/${id}`);

  return NextResponse.json({ success: true });
}
