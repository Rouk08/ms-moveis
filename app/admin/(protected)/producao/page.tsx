import Link from "next/link";
import { AlertTriangle, BookText, Calendar, Hammer } from "lucide-react";
import { prisma } from "@/lib/prisma";
import EtapaProducaoCheckbox from "@/components/admin/EtapaProducaoCheckbox";
import { etapasFluxo } from "@/lib/fluxo-fabricacao";

function formatData(date: Date) {
  return date.toLocaleDateString("pt-BR", { timeZone: "UTC" });
}

export default async function ProducaoPage() {
  const [etapas, contratos] = await Promise.all([
    prisma.etapaProducao.findMany({
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
    }),
    prisma.contrato.findMany({
      where: { status: "ASSINADO" },
      orderBy: { dataContrato: "asc" },
      select: {
        id: true,
        contratanteNome: true,
        orcamentoId: true,
        orcamento: { select: { numero: true } },
        etapasFabricacao: { orderBy: { numero: "asc" } },
      },
    }),
  ]);

  const projetos = contratos
    .map((c) => {
      const total = c.etapasFabricacao.length;
      const feitos = c.etapasFabricacao.filter((i) => i.concluida).length;
      const proximaEtapa = etapasFluxo.find((e) => e.numero === feitos + 1);
      return {
        contrato: c,
        total,
        feitos,
        completo: total > 0 && feitos === total,
        proximaEtapa,
      };
    })
    .sort((a, b) => Number(a.completo) - Number(b.completo));

  const hoje = new Date();
  hoje.setUTCHours(0, 0, 0, 0);

  return (
    <div>
      <div className="flex items-center justify-between gap-2 mb-1">
        <div className="flex items-center gap-2">
          <Calendar size={22} className="text-wood-600" />
          <h1 className="text-2xl font-semibold text-charcoal-800">
            Calendário de produção
          </h1>
        </div>
        <Link
          href="/producao/manual"
          target="_blank"
          className="flex items-center gap-1.5 rounded-full border border-wood-200 bg-white px-3 py-1.5 text-xs font-medium text-wood-700 shadow-sm hover:bg-wood-50"
        >
          <BookText size={14} />
          Manual de fabricação
        </Link>
      </div>
      <p className="text-sm text-charcoal-500 mb-4">
        Etapas de fabricação, entrega e instalação de todos os contratos
        assinados, ordenadas por data.
      </p>

      <div className="mb-6 flex items-center gap-2 rounded-lg bg-wood-50 px-4 py-3 text-sm text-wood-700">
        <Hammer size={16} className="shrink-0" />
        <span>
          O marceneiro acompanha e marca etapas concluídas direto em{" "}
          <span className="font-semibold">msmoveissobmedida.com.br/producao</span>{" "}
          — sem precisar de login do admin (código de acesso próprio).
        </span>
      </div>

      <h2 className="mb-2 text-sm font-semibold text-charcoal-700">
        Progresso de fabricação por projeto
      </h2>
      <div className="mb-6 rounded-2xl border border-charcoal-100 bg-white shadow-sm overflow-hidden">
        {projetos.length === 0 ? (
          <p className="px-6 py-10 text-sm text-charcoal-400 text-center">
            Nenhum contrato assinado ainda.
          </p>
        ) : (
          <div className="divide-y divide-charcoal-100">
            {projetos.map(({ contrato, total, feitos, completo, proximaEtapa }) => (
              <Link
                key={contrato.id}
                href={`/admin/orcamentos/${contrato.orcamentoId}/contrato`}
                className="flex items-center gap-4 px-6 py-4 hover:bg-charcoal-50/60 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-charcoal-800 truncate">
                    {contrato.contratanteNome} · Orçamento #
                    {contrato.orcamento.numero}
                  </p>
                  <p className="text-xs text-charcoal-400 mt-0.5">
                    {completo
                      ? "Fabricação concluída"
                      : proximaEtapa
                        ? `Próxima etapa: ${proximaEtapa.numero}. ${proximaEtapa.titulo}`
                        : "Sem checklist"}
                  </p>
                  <div className="mt-2 flex items-center gap-2 max-w-xs">
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
              </Link>
            ))}
          </div>
        )}
      </div>

      <h2 className="mb-2 text-sm font-semibold text-charcoal-700">
        Entrega e instalação
      </h2>
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
