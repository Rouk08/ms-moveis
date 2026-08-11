"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { OrcamentoStatus } from "@/lib/generated/prisma/enums";

const STATUS_VALUES: OrcamentoStatus[] = [
  "NOVO",
  "EM_ANDAMENTO",
  "APROVADO",
  "RECUSADO",
];

export type UpdateOrcamentoState = { error?: string; success?: boolean } | undefined;

export async function updateOrcamento(
  id: string,
  _prevState: UpdateOrcamentoState,
  formData: FormData
): Promise<UpdateOrcamentoState> {
  const session = await auth();
  if (!session?.user) throw new Error("Não autenticado.");

  const statusRaw = String(formData.get("status") ?? "");
  const status = STATUS_VALUES.includes(statusRaw as OrcamentoStatus)
    ? (statusRaw as OrcamentoStatus)
    : undefined;

  const valorRaw = String(formData.get("valorEstimado") ?? "").trim();
  const notasInternas = String(formData.get("notasInternas") ?? "").trim();

  await prisma.orcamento.update({
    where: { id },
    data: {
      ...(status ? { status } : {}),
      valorEstimado: valorRaw || null,
      notasInternas: notasInternas || null,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/orcamentos");
  revalidatePath(`/admin/orcamentos/${id}`);

  return { success: true };
}
