import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import NovaFeriasForm from "@/components/admin/NovaFeriasForm";

export default async function NovaFeriasPage({
  searchParams,
}: {
  searchParams: Promise<{ colaboradorId?: string }>;
}) {
  const session = await auth();
  if (session?.user.role !== "ADMIN") {
    redirect("/admin");
  }

  const { colaboradorId } = await searchParams;

  const colaboradores = await prisma.colaborador.findMany({
    where: { dataDemissao: null },
    orderBy: { nome: "asc" },
    select: { id: true, nome: true },
  });

  return (
    <div className="max-w-xl">
      <Link
        href="/admin/rh/ferias"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-charcoal-500 hover:text-charcoal-700 mb-6"
      >
        <ArrowLeft size={16} />
        Voltar para férias
      </Link>

      <h1 className="text-2xl font-semibold text-charcoal-800 mb-1">
        Novo período de férias
      </h1>
      <p className="text-sm text-charcoal-500 mb-6">
        Registre o período aquisitivo de férias de um colaborador.
      </p>

      <NovaFeriasForm colaboradores={colaboradores} colaboradorId={colaboradorId} />
    </div>
  );
}
