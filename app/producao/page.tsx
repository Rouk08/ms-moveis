import type { Metadata } from "next";
import { cookies } from "next/headers";
import Image from "next/image";
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

  const etapas = await prisma.etapaProducao.findMany({
    where: { concluida: false },
    orderBy: { dataPrevista: "asc" },
    include: {
      contrato: {
        select: { contratanteNome: true, enderecoInstalacao: true },
      },
    },
  });

  const hoje = new Date();
  hoje.setUTCHours(0, 0, 0, 0);

  return (
    <div className="min-h-screen bg-charcoal-50/30 p-6">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center gap-2.5 mb-6">
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
              {etapas.length} etapa{etapas.length === 1 ? "" : "s"} pendente
              {etapas.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>

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
