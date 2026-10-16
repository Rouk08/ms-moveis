import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { prisma } from "@/lib/prisma";
import EditAporteForm from "@/components/admin/EditAporteForm";
import ExcluirAporteButton from "@/components/admin/ExcluirAporteButton";

export default async function AporteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const aporte = await prisma.aporte.findUnique({ where: { id } });

  if (!aporte) notFound();

  return (
    <div className="max-w-3xl">
      <Link
        href="/admin/financeiro/aportes"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-charcoal-500 hover:text-charcoal-700 mb-6"
      >
        <ArrowLeft size={16} />
        Voltar para aportes
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-charcoal-800">
            {aporte.socio}
          </h1>
          <p className="text-sm text-moss-600 font-medium">
            {Number(aporte.valor).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-charcoal-100 bg-white p-6 shadow-sm mb-6">
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="flex gap-2.5">
            <User size={16} className="text-wood-500 mt-0.5 shrink-0" />
            <div>
              <dt className="text-charcoal-400">Sócio</dt>
              <dd className="text-charcoal-700">{aporte.socio}</dd>
            </div>
          </div>
          <div className="flex gap-2.5">
            <Calendar size={16} className="text-wood-500 mt-0.5 shrink-0" />
            <div>
              <dt className="text-charcoal-400">Data do aporte</dt>
              <dd className="text-charcoal-700">
                {aporte.data.toLocaleDateString("pt-BR")}
              </dd>
            </div>
          </div>
        </dl>
      </div>

      <div className="mb-6">
        <ExcluirAporteButton id={aporte.id} />
      </div>

      <EditAporteForm
        id={aporte.id}
        socio={aporte.socio}
        valor={aporte.valor.toString()}
        data={aporte.data.toISOString().slice(0, 10)}
        observacao={aporte.observacao ?? ""}
      />
    </div>
  );
}
