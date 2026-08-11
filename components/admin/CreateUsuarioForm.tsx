"use client";

import { useActionState } from "react";
import {
  createUsuario,
  type CreateUsuarioState,
} from "@/lib/actions/usuarios";

export default function CreateUsuarioForm() {
  const [state, formAction, pending] = useActionState<
    CreateUsuarioState,
    FormData
  >(createUsuario, undefined);

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-charcoal-700 mb-1.5"
          >
            Nome
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="w-full rounded-lg border border-charcoal-200 px-4 py-2.5 text-charcoal-800 focus:border-wood-500 focus:outline-none focus:ring-2 focus:ring-wood-200"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-charcoal-700 mb-1.5"
          >
            E-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-lg border border-charcoal-200 px-4 py-2.5 text-charcoal-800 focus:border-wood-500 focus:outline-none focus:ring-2 focus:ring-wood-200"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-charcoal-700 mb-1.5"
          >
            Senha (mín. 8 caracteres)
          </label>
          <input
            id="password"
            name="password"
            type="password"
            minLength={8}
            required
            className="w-full rounded-lg border border-charcoal-200 px-4 py-2.5 text-charcoal-800 focus:border-wood-500 focus:outline-none focus:ring-2 focus:ring-wood-200"
          />
        </div>
        <div>
          <label
            htmlFor="role"
            className="block text-sm font-medium text-charcoal-700 mb-1.5"
          >
            Nível de acesso
          </label>
          <select
            id="role"
            name="role"
            defaultValue="MEMBER"
            className="w-full rounded-lg border border-charcoal-200 px-4 py-2.5 text-charcoal-800 focus:border-wood-500 focus:outline-none focus:ring-2 focus:ring-wood-200"
          >
            <option value="MEMBER">Equipe</option>
            <option value="ADMIN">Administrador</option>
          </select>
        </div>
      </div>

      {state?.error && (
        <p className="text-sm text-red-600" role="alert">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-wood-500 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-wood-600 disabled:opacity-60 transition-colors"
      >
        {pending ? "Criando..." : "Criar usuário"}
      </button>
    </form>
  );
}
