import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { MARCENEIRO_COOKIE, tokenMarceneiroEsperado } from "@/lib/marceneiro-auth";
import MarceneiroPinForm from "@/components/MarceneiroPinForm";
import EtapaFabricacaoChecklistProjeto from "@/components/producao/EtapaFabricacaoChecklistProjeto";

export const metadata: Metadata = {
  title: "Checklist do projeto — Produção",
  robots: { index: false, follow: false },
};

export default async function ProjetoFabricacaoPage({
  params,
}: {
  params: Promise<{ contratoId: string }>;
}) {
  const store = await cookies();
  const autenticado =
    store.get(MARCENEIRO_COOKIE)?.value === tokenMarceneiroEsperado();

  if (!autenticado) {
    return (
      <div className="min-h-screen bg-charcoal-50/30 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-charcoal-100 bg-white p-8 shadow-sm">
            <MarceneiroPinForm />
          </div>
        </div>
      </div>
    );
  }

  const { contratoId } = await params;
  const contrato = await prisma.contrato.findUnique({
    where: { id: contratoId },
    include: { etapasFabricacao: { orderBy: { numero: "asc" } } },
  });

  if (!contrato || contrato.status !== "ASSINADO") notFound();

  const total = contrato.etapasFabricacao.length;
  const feitos = contrato.etapasFabricacao.filter((i) => i.concluida).length;

  return (
    <div className="min-h-screen bg-charcoal-50/30 p-6">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/producao"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-charcoal-500 hover:text-charcoal-700"
        >
          <ArrowLeft size={15} />
          Voltar
        </Link>

        <div className="mb-5 rounded-2xl border border-charcoal-100 bg-white p-4 shadow-sm">
          <p className="font-heading font-semibold text-charcoal-800">
            {contrato.contratanteNome}
          </p>
          <p className="mt-1 flex items-center gap-1 text-xs text-charcoal-500">
            <MapPin size={11} className="shrink-0" />
            <span>{contrato.enderecoInstalacao}</span>
          </p>
          <p className="mt-2 text-sm font-medium text-wood-700">
            {feitos} de {total} etapas concluídas
          </p>
        </div>

        <EtapaFabricacaoChecklistProjeto
          itens={contrato.etapasFabricacao.map((item) => ({
            id: item.id,
            numero: item.numero,
            concluida: item.concluida,
          }))}
        />
      </div>
    </div>
  );
}
