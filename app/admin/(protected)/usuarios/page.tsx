import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { setUsuarioActive } from "@/lib/actions/usuarios";
import CreateUsuarioForm from "@/components/admin/CreateUsuarioForm";

export default async function UsuariosPage() {
  const session = await auth();
  if (session?.user.role !== "ADMIN") {
    redirect("/admin");
  }

  const usuarios = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold text-charcoal-800 mb-1">
        Usuários
      </h1>
      <p className="text-sm text-charcoal-500 mb-6">
        Gerencie quem tem acesso ao painel administrativo.
      </p>

      <div className="rounded-2xl border border-charcoal-100 bg-white p-6 shadow-sm mb-8">
        <h2 className="font-semibold text-charcoal-800 mb-4">
          Novo usuário
        </h2>
        <CreateUsuarioForm />
      </div>

      <div className="rounded-2xl border border-charcoal-100 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-charcoal-100 text-left text-xs uppercase tracking-wide text-charcoal-400">
              <th className="px-6 py-3 font-medium">Nome</th>
              <th className="px-6 py-3 font-medium">E-mail</th>
              <th className="px-6 py-3 font-medium">Nível</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal-100">
            {usuarios.map((usuario) => {
              const toggleAction = setUsuarioActive.bind(
                null,
                usuario.id,
                !usuario.active
              );
              const isSelf = usuario.email === session.user.email;

              return (
                <tr key={usuario.id}>
                  <td className="px-6 py-4 font-medium text-charcoal-800">
                    {usuario.name}
                    {isSelf && (
                      <span className="ml-2 text-xs font-normal text-charcoal-400">
                        (você)
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-charcoal-600">
                    {usuario.email}
                  </td>
                  <td className="px-6 py-4 text-charcoal-600">
                    {usuario.role === "ADMIN" ? "Administrador" : "Equipe"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                        usuario.active
                          ? "bg-moss-50 text-moss-700"
                          : "bg-charcoal-100 text-charcoal-500"
                      }`}
                    >
                      {usuario.active ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {!isSelf && (
                      <form action={toggleAction}>
                        <button
                          type="submit"
                          className="text-sm font-medium text-wood-600 hover:text-wood-700"
                        >
                          {usuario.active ? "Desativar" : "Ativar"}
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
