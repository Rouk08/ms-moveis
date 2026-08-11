"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { OrcamentoStatus } from "@/lib/generated/prisma/enums";

async function requireSession() {
  const session = await auth();
  if (!session?.user) throw new Error("Não autenticado.");
  return session;
}

export type CreateOrcamentoFromSiteInput = {
  nome: string;
  telefone: string;
  email: string;
  tipoProjeto: string;
  mensagem: string;
};

/** Chamada pelo formulário público de /contato — sem autenticação. */
export async function createOrcamentoFromSite(
  data: CreateOrcamentoFromSiteInput
) {
  if (!data.nome || !data.telefone || !data.email || !data.mensagem) return;

  await prisma.orcamento.create({
    data: {
      nome: data.nome,
      telefone: data.telefone,
      email: data.email,
      tipoProjeto: data.tipoProjeto,
      mensagem: data.mensagem,
      origem: "SITE",
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/orcamentos");
}

export async function createOrcamentoManual(formData: FormData) {
  await requireSession();

  const nome = String(formData.get("nome") ?? "").trim();
  const telefone = String(formData.get("telefone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const tipoProjeto = String(formData.get("tipoProjeto") ?? "").trim();
  const mensagem = String(formData.get("mensagem") ?? "").trim();

  if (!nome || !telefone || !email || !mensagem) {
    throw new Error("Preencha todos os campos obrigatórios.");
  }

  const orcamento = await prisma.orcamento.create({
    data: { nome, telefone, email, tipoProjeto, mensagem, origem: "MANUAL" },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/orcamentos");
  redirect(`/admin/orcamentos/${orcamento.id}`);
}

const STATUS_VALUES: OrcamentoStatus[] = [
  "NOVO",
  "EM_ANDAMENTO",
  "APROVADO",
  "RECUSADO",
];

export async function updateOrcamento(id: string, formData: FormData) {
  await requireSession();

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
}
