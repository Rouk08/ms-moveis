import Link from "next/link";
import { AlertTriangle, Calendar } from "lucide-react";
import { prisma } from "@/lib/prisma";
import EtapaProducaoCheckbox from "@/components/admin/EtapaProducaoCheckbox";

function formatData(date: Date) {
  return date.toLocaleDateString("pt-BR", { timeZone: "UTC" });
}

export default async function ProducaoPage() {
  const etapas = await prisma.etapaProducao.findMany({
    where: { concluida: false },
    orderBy: { dataPrevista: "asc" },
    include: {
      contrato: {
        select: {
          id: true,
          contratanteNome: true,
          orcamentoId: true,
          orcamento: { select: { numero: true } },
        },
      },
    },
  });

  const hoje = new Date();
  hoje.setUTCHours(0, 0, 0, 0);

  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <Calendar size={22} className="text-wood-600" />
        <h1 className="text-2xl font-semibold text-charcoal-800">
          Calendário de produção
        </h1>
      </div>
      <p className="text-sm text-charcoal-500 mb-6">
        Etapas de fabricação, entrega e instalação de todos os contratos
        assinados, ordenadas por data.
      </p>

      <div className="rounded-2xl border border-charcoal-100 bg-white shadow-sm overflow-hidden">
        {etapas.length === 0 ? (
          <p className="px-6 py-10 text-sm text-charcoal-400 text-center">
            Nenhuma etapa pendente. O calendário é preenchido
            automaticamente quando um contrato é marcado como assinado.
          </p>
        ) : (
          <div className="divide-y divide-charcoal-100">
            {etapas.map((etapa) => {
              const dataPrevista = new Date(etapa.dataPrevista);
              const atrasada = dataPrevista < hoje;

              return (
                <div
                  key={etapa.id}
                  className={`flex items-center gap-4 px-6 py-4 ${
                    atrasada ? "bg-red-50/50" : ""
                  }`}
                >
                  <EtapaProducaoCheckbox
                    contratoId={etapa.contratoId}
                    etapaId={etapa.id}
                  />
                  <div className="min-w-[100px] text-sm">
                    <p
                      className={`font-medium ${
                        atrasada ? "text-red-600" : "text-charcoal-700"
                      }`}
                    >
                      {formatData(dataPrevista)}
                    </p>
                    {atrasada && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600">
                        <AlertTriangle size={11} />
                        Atrasada
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-charcoal-800">
                      {etapa.nome}
                    </p>
                    <p className="text-xs text-charcoal-400 truncate">
                      {etapa.contrato.contratanteNome} · Orçamento #
                      {etapa.contrato.orcamento.numero}
                    </p>
                  </div>
                  <Link
                    href={`/admin/orcamentos/${etapa.contrato.orcamentoId}/contrato`}
                    className="shrink-0 text-xs font-medium text-wood-600 hover:text-wood-700"
                  >
                    Ver contrato
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
