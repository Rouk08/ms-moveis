"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type TestState = { ok: boolean; time: string; count?: number } | undefined;

export async function testAction(
  _prevState: TestState,
  _formData: FormData
): Promise<TestState> {
  const session = await auth();
  if (!session?.user) return { ok: false, time: new Date().toISOString() };

  const count = await prisma.orcamento.count();
  return { ok: true, time: new Date().toISOString(), count };
}
