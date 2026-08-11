"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type TestState = { ok: boolean; time: string; id?: string } | undefined;

export async function testAction(
  _prevState: TestState,
  _formData: FormData
): Promise<TestState> {
  const session = await auth();
  if (!session?.user) return { ok: false, time: new Date().toISOString() };

  const created = await prisma.orcamento.create({
    data: {
      nome: "Teste Retest",
      telefone: "000",
      email: "retest@example.com",
      tipoProjeto: "Teste",
      mensagem: "retest",
      origem: "MANUAL",
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/orcamentos");
  redirect(`/admin/orcamentos/${created.id}`);
}
