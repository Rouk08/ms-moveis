import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import StatusBadgeFerias from "@/components/admin/StatusBadgeFerias";
import EditFeriasForm from "@/components/admin/EditFeriasForm";

export default async function FeriasDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (session?.user.role !== "ADMIN") {
    redirect("/admin");
  }

  const { id } = await params;
  const ferias = await prisma.ferias.findUnique({
    where: { id },
    include: { colaborador: { select: { id: true, nome: true } } },
  });

  if (!ferias) notFound();

  return (
    <div className="max-w-2xl">
      <Link
        href="/admin/rh/ferias"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-charcoal-500 hover:text-charcoal-700 mb-6"
      >
        <ArrowLeft size={16} />
        Voltar para férias
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-charcoal-800">
            <Link
              href={`/admin/rh/colaboradores/${ferias.colaborador.id}`}
              className="hover:text-wood-600"
            >
              {ferias.colaborador.nome}
            </Link>
          </h1>
          <p className="text-sm text-charcoal-500">
            Período aquisitivo:{" "}
            {ferias.periodoAquisitivoInicio.toLocaleDateString("pt-BR")} –{" "}
            {ferias.periodoAquisitivoFim.toLocaleDateString("pt-BR")}
          </p>
          <p className="text-sm text-charcoal-500">
            {ferias.diasGozados} de {ferias.diasDireito} dias gozados
          </p>
        </div>
        <StatusBadgeFerias
          periodoAquisitivoFim={ferias.periodoAquisitivoFim}
          diasDireito={ferias.diasDireito}
          diasGozados={ferias.diasGozados}
          dataGozoInicio={ferias.dataGozoInicio}
          dataGozoFim={ferias.dataGozoFim}
        />
      </div>

      <EditFeriasForm
        id={ferias.id}
        diasGozados={ferias.diasGozados}
        dataGozoInicio={
          ferias.dataGozoInicio
            ? ferias.dataGozoInicio.toISOString().slice(0, 10)
            : ""
        }
        dataGozoFim={
          ferias.dataGozoFim
            ? ferias.dataGozoFim.toISOString().slice(0, 10)
            : ""
        }
        notasInternas={ferias.notasInternas ?? ""}
      />
    </div>
  );
}
