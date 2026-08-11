"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type CreateOrcamentoState = { error?: string } | undefined;

export async function createOrcamentoManual(
  _prevState: CreateOrcamentoState,
  formData: FormData
): Promise<CreateOrcamentoState> {
  const session = await auth();
  if (!session?.user) throw new Error("Não autenticado.");

  console.log("DEBUG formData entries:", Array.from(formData.entries()));

  const orcamento = await prisma.orcamento.create({
    data: {
      nome: "HARDCODED TEST",
      telefone: "000",
      email: "hardcoded@example.com",
      tipoProjeto: "Teste",
      mensagem: "hardcoded, sem ler formData",
      origem: "MANUAL",
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/orcamentos");
  redirect(`/admin/orcamentos/${orcamento.id}`);
}
