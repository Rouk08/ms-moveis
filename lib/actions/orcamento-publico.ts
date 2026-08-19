"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export type CreateOrcamentoFromSiteInput = {
  nome: string;
  telefone: string;
  email: string;
  tipoProjeto: string[];
  mensagem: string;
};

/** Chamada pelo formulário público de /contato — sem autenticação. */
export async function createOrcamentoFromSite(
  data: CreateOrcamentoFromSiteInput
) {
  if (!data.nome || !data.telefone || !data.mensagem) return;

  await prisma.orcamento.create({
    data: {
      nome: data.nome,
      telefone: data.telefone,
      email: data.email.trim() || null,
      tipoProjeto: data.tipoProjeto,
      mensagem: data.mensagem,
      origem: "SITE",
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/orcamentos");
}
