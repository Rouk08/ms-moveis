"use client";

import { useActionState } from "react";
import { testAction, type TestState } from "@/lib/actions/test";

export default function TestActionForm() {
  const [state, formAction, pending] = useActionState<TestState, FormData>(
    testAction,
    undefined
  );

  return (
    <form
      action={formAction}
      className="mb-6 rounded-2xl border-2 border-dashed border-amber-400 bg-amber-50 p-4"
    >
      <p className="text-sm font-semibold mb-2">RETESTE (temporário)</p>
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-white"
      >
        {pending ? "Testando..." : "Retestar"}
      </button>
      {state && (
        <p className="mt-2 text-sm">
          Resultado: ok={String(state.ok)} time={state.time} id={String(state.id)}
        </p>
      )}
    </form>
  );
}
