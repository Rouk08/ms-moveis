import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import StatusBadgeAfastamento from "@/components/admin/StatusBadgeAfastamento";
import EditAfastamentoForm from "@/components/admin/EditAfastamentoForm";

export default async function AfastamentoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (session?.user.role !== "ADMIN") {
    redirect("/admin");
  }

  const { id } = await params;
  const afastamento = await prisma.afastamento.findUnique({
    where: { id },
    include: { colaborador: { select: { id: true, nome: true } } },
  });

  if (!afastamento) notFound();

  return (
    <div className="max-w-2xl">
      <Link
        href="/admin/rh/afastamentos"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-charcoal-500 hover:text-charcoal-700 mb-6"
      >
        <ArrowLeft size={16} />
        Voltar para afastamentos
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-charcoal-800">
            <Link
              href={`/admin/rh/colaboradores/${afastamento.colaborador.id}`}
              className="hover:text-wood-600"
            >
              {afastamento.colaborador.nome}
            </Link>
          </h1>
          <p className="text-sm text-charcoal-500">
            {afastamento.dataInicio.toLocaleDateString("pt-BR")}
            {afastamento.dataFim
              ? ` – ${afastamento.dataFim.toLocaleDateString("pt-BR")}`
              : " – em aberto"}
          </p>
        </div>
        <StatusBadgeAfastamento dataFim={afastamento.dataFim} />
      </div>

      <EditAfastamentoForm
        id={afastamento.id}
        tipo={afastamento.tipo}
        dataInicio={afastamento.dataInicio.toISOString().slice(0, 10)}
        dataFim={
          afastamento.dataFim
            ? afastamento.dataFim.toISOString().slice(0, 10)
            : ""
        }
        motivo={afastamento.motivo ?? ""}
        notasInternas={afastamento.notasInternas ?? ""}
      />
    </div>
  );
}
