import type { Metadata } from "next";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { BookText, ChevronRight, Hammer } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { MARCENEIRO_COOKIE, tokenMarceneiroEsperado } from "@/lib/marceneiro-auth";
import MarceneiroPinForm from "@/components/MarceneiroPinForm";
import MarceneiroEtapaItem from "@/components/MarceneiroEtapaItem";

export const metadata: Metadata = {
  title: "Produção",
  robots: { index: false, follow: false },
};

export default async function ProducaoMarceneiroPage() {
  const store = await cookies();
  const autenticado =
    store.get(MARCENEIRO_COOKIE)?.value === tokenMarceneiroEsperado();

  if (!autenticado) {
    return (
      <div className="min-h-screen bg-charcoal-50/30 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center gap-2 mb-8">
            <Image
              src="/logo.jpg"
              alt="MS Móveis"
              width={48}
              height={48}
              className="h-12 w-12 rounded-full object-cover"
            />
            <p className="font-heading font-semibold text-xl text-charcoal-800">
              MS Móveis
            </p>
            <p className="text-sm text-charcoal-500">Painel de produção</p>
          </div>
          <div className="rounded-2xl border border-charcoal-100 bg-white p-8 shadow-sm">
            <MarceneiroPinForm />
          </div>
        </div>
      </div>
    );
  }

  const [contratos, etapas] = await Promise.all([
    prisma.contrato.findMany({
      where: { status: "ASSINADO" },
      orderBy: { dataContrato: "asc" },
      include: { etapasFabricacao: { orderBy: { numero: "asc" } } },
    }),
    prisma.etapaProducao.findMany({
      where: { concluida: false },
      orderBy: { dataPrevista: "asc" },
      include: {
        contrato: {
          select: { contratanteNome: true, enderecoInstalacao: true },
        },
      },
    }),
  ]);

  const projetos = contratos
    .map((c) => {
      const total = c.etapasFabricacao.length;
      const feitos = c.etapasFabricacao.filter((i) => i.concluida).length;
      return { contrato: c, total, feitos, completo: total > 0 && feitos === total };
    })
    .sort((a, b) => Number(a.completo) - Number(b.completo));

  const hoje = new Date();
  hoje.setUTCHours(0, 0, 0, 0);

  return (
    <div className="min-h-screen bg-charcoal-50/30 p-6">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-between gap-2 mb-6">
          <div className="flex items-center gap-2.5">
            <Image
              src="/logo.jpg"
              alt="MS Móveis"
              width={36}
              height={36}
              className="h-9 w-9 rounded-full object-cover"
            />
            <div>
              <p className="font-heading font-semibold text-charcoal-800">
                Painel de produção
              </p>
              <p className="text-xs text-charcoal-500">
                {projetos.length} projeto{projetos.length === 1 ? "" : "s"} em
                produção
              </p>
            </div>
          </div>
          <Link
            href="/producao/manual"
            className="flex items-center gap-1.5 rounded-full border border-wood-200 bg-white px-3 py-1.5 text-xs font-medium text-wood-700 shadow-sm hover:bg-wood-50"
          >
            <BookText size={14} />
            Manual de fabricação
          </Link>
        </div>

        <h2 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-charcoal-700">
          <Hammer size={15} />
          Projetos — checklist de bancada
        </h2>
        {projetos.length === 0 ? (
          <p className="mb-6 rounded-2xl border border-charcoal-100 bg-white p-6 text-center text-sm text-charcoal-400 shadow-sm">
            Nenhum projeto em produção no momento.
          </p>
        ) : (
          <div className="mb-6 space-y-2.5">
            {projetos.map(({ contrato, total, feitos, completo }) => (
              <Link
                key={contrato.id}
                href={`/producao/${contrato.id}`}
                className={`flex items-center gap-3 rounded-xl border p-4 shadow-sm transition-colors ${
                  completo
                    ? "border-moss-200 bg-moss-50"
                    : "border-charcoal-100 bg-white hover:bg-charcoal-50/60"
                }`}
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-charcoal-800">
                    {contrato.contratanteNome}
                  </p>
                  <p className="truncate text-xs text-charcoal-500">
                    {contrato.enderecoInstalacao}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-charcoal-100">
                      <div
                        className={`h-full rounded-full ${completo ? "bg-moss-500" : "bg-wood-500"}`}
                        style={{ width: `${total ? (feitos / total) * 100 : 0}%` }}
                      />
                    </div>
                    <span
                      className={`shrink-0 text-xs font-medium ${completo ? "text-moss-700" : "text-wood-700"}`}
                    >
                      {feitos}/{total}
                    </span>
                  </div>
                </div>
                <ChevronRight size={18} className="shrink-0 text-charcoal-300" />
              </Link>
            ))}
          </div>
        )}

        <h2 className="mb-2 text-sm font-semibold text-charcoal-700">
          Entrega e instalação pendentes
        </h2>
        {etapas.length === 0 ? (
          <p className="rounded-2xl border border-charcoal-100 bg-white p-8 text-center text-sm text-charcoal-400 shadow-sm">
            Nenhuma etapa pendente no momento.
          </p>
        ) : (
          <div className="space-y-3">
            {etapas.map((etapa) => (
              <MarceneiroEtapaItem
                key={etapa.id}
                id={etapa.id}
                nome={etapa.nome}
                dataPrevista={etapa.dataPrevista.toISOString()}
                clienteNome={etapa.contrato.contratanteNome}
                enderecoInstalacao={etapa.contrato.enderecoInstalacao}
                atrasada={new Date(etapa.dataPrevista) < hoje}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
