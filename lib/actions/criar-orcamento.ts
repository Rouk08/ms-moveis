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

  const nome = String(formData.get("nome") ?? "").trim();
  const telefone = String(formData.get("telefone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const tipoProjeto = String(formData.get("tipoProjeto") ?? "").trim();
  const mensagem = String(formData.get("mensagem") ?? "").trim();

  if (!nome || !telefone || !email || !mensagem) {
    return { error: "Preencha todos os campos obrigatórios." };
  }

  const orcamento = await prisma.orcamento.create({
    data: { nome, telefone, email, tipoProjeto, mensagem, origem: "MANUAL" },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/orcamentos");
  redirect(`/admin/orcamentos/${orcamento.id}`);
}
