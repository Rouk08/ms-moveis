"use server";

import { auth } from "@/lib/auth";

export type TestState = { ok: boolean; time: string; session?: string } | undefined;

export async function testAction(
  _prevState: TestState,
  _formData: FormData
): Promise<TestState> {
  const session = await auth();
  return { ok: true, time: new Date().toISOString(), session: JSON.stringify(session) };
}
