import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { auth } from "@/lib/auth";
import NovoColaboradorForm from "@/components/admin/NovoColaboradorForm";

export default async function NovoColaboradorPage() {
  const session = await auth();
  if (session?.user.role !== "ADMIN") {
    redirect("/admin");
  }

  return (
    <div className="max-w-xl">
      <Link
        href="/admin/rh/colaboradores"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-charcoal-500 hover:text-charcoal-700 mb-6"
      >
        <ArrowLeft size={16} />
        Voltar para colaboradores
      </Link>

      <h1 className="text-2xl font-semibold text-charcoal-800 mb-1">
        Novo colaborador
      </h1>
      <p className="text-sm text-charcoal-500 mb-6">
        Cadastre um novo colaborador. Um PIN de 4 dígitos será gerado
        para bater ponto em <span className="font-mono">/ponto</span>.
      </p>

      <NovoColaboradorForm />
    </div>
  );
}
