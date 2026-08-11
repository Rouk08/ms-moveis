"use server";

export type TestState = { ok: boolean; time: string } | undefined;

export async function testAction(
  _prevState: TestState,
  _formData: FormData
): Promise<TestState> {
  return { ok: true, time: new Date().toISOString() };
}
