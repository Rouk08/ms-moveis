import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Hammer } from "lucide-react";
import {
  dicasOperacionais,
  etapasFluxo,
  ferragensPadrao,
  kpisFluxo,
} from "@/lib/fluxo-fabricacao";
import EsquadroCalculator from "@/components/producao/EsquadroCalculator";
import PrintButton from "@/components/producao/PrintButton";

export const metadata: Metadata = {
  title: "Manual de Fabricação — Produção",
  robots: { index: false, follow: false },
};

export default function ManualFabricacaoPage() {
  return (
    <div className="min-h-screen bg-charcoal-50/30">
      <header className="bg-gradient-to-br from-wood-900 via-wood-800 to-wood-700 px-6 py-8 text-white">
        <div className="mx-auto flex max-w-4xl flex-wrap items-start justify-between gap-4">
          <div>
            <span className="mb-3 inline-block rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-wood-100">
              Manual Operacional de Marcenaria
            </span>
            <h1 className="text-2xl font-bold leading-tight sm:text-3xl">
              Fluxo de Produção de Móveis
            </h1>
            <p className="mt-2 max-w-xl text-sm text-wood-100">
              Procedimento padrão sequencial do plano de corte ao embarque. Respeite as
              tolerâncias mecânicas, folgas de ferragens e critérios de inspeção.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/producao"
              className="print:hidden flex items-center gap-1.5 rounded-full border border-white/40 bg-white/15 px-4 py-2 text-sm font-medium text-white hover:bg-white/25"
            >
              <ArrowLeft size={15} />
              Voltar
            </Link>
            <PrintButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-8">
        <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {kpisFluxo.map((kpi) => (
            <div
              key={kpi.label}
              className="rounded-xl border-l-4 border-wood-700 bg-white px-4 py-3 shadow-sm"
            >
              <p className="text-xs font-medium text-charcoal-500">{kpi.label}</p>
              <p className="text-xl font-bold text-wood-700">{kpi.valor}</p>
              <p className="text-xs text-charcoal-400">{kpi.nota}</p>
            </div>
          ))}
        </div>

        <section className="mb-10">
          <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-lg font-bold text-wood-700">Etapas sequenciais de fabricação</h2>
            <span className="text-sm text-charcoal-400">8 etapas lineares</span>
          </div>
          <p className="mb-5 text-sm text-charcoal-500">
            Siga rigorosamente cada etapa na ordem especificada para evitar retrabalhos na
            montagem final.
          </p>

          <div className="relative space-y-5 pl-14 sm:pl-16">
            <div className="absolute bottom-4 left-6 top-4 w-1 rounded-full bg-gradient-to-b from-wood-500 via-wood-400 to-wood-500 sm:left-8" />

            {etapasFluxo.map((etapa) => (
              <article key={etapa.numero} className="relative">
                <div className="absolute -left-14 top-0 flex h-11 w-11 items-center justify-center rounded-full border-4 border-charcoal-50 bg-wood-700 text-lg font-extrabold text-white shadow sm:-left-16 sm:h-14 sm:w-14 sm:text-xl">
                  {etapa.numero}
                </div>
                <div className="rounded-lg border border-charcoal-100 border-l-4 border-l-wood-500 bg-white p-4 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h3 className="text-base font-bold text-wood-700">{etapa.titulo}</h3>
                    <span className="rounded-full bg-wood-100 px-2.5 py-0.5 text-xs font-semibold text-wood-800">
                      {etapa.fase}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-charcoal-700">
                    {etapa.descricao}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {etapa.parametros.map((param) => (
                      <span
                        key={param}
                        className="rounded-md border border-wood-200 bg-wood-50 px-2 py-1 text-xs font-medium text-wood-800"
                      >
                        {param}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-10 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-charcoal-100 bg-white p-5 shadow-sm">
            <h3 className="mb-1 text-base font-semibold text-wood-700">
              Ferragens e insumos padrão
            </h3>
            <p className="mb-3 text-sm text-charcoal-500">
              Componentes e especificações técnicas de estoque ativo para a linha de produção.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-charcoal-100 text-left text-xs font-semibold uppercase text-wood-800">
                    <th className="py-2 pr-2">Insumo</th>
                    <th className="py-2 pr-2">Especificação</th>
                    <th className="py-2">Aplicação</th>
                  </tr>
                </thead>
                <tbody>
                  {ferragensPadrao.map((f) => (
                    <tr key={f.insumo} className="border-b border-charcoal-50 last:border-0">
                      <td className="py-2 pr-2 font-medium text-charcoal-800">{f.insumo}</td>
                      <td className="py-2 pr-2 text-charcoal-600">{f.especificacao}</td>
                      <td className="py-2 text-charcoal-600">{f.aplicacao}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-2xl border border-charcoal-100 bg-white p-5 shadow-sm">
            <h3 className="mb-1 text-base font-semibold text-wood-700">
              Cotidiano do marceneiro: dicas operacionais
            </h3>
            <p className="mb-3 text-sm text-charcoal-500">
              Boas práticas de bancada para assegurar ritmo e zero refugo.
            </p>
            <div className="space-y-3">
              {dicasOperacionais.map((dica, i) => (
                <div key={dica.titulo} className="flex gap-2.5">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-wood-100 text-xs font-bold text-wood-800">
                    {i + 1}
                  </span>
                  <p className="text-sm text-charcoal-700">
                    <strong className="text-charcoal-800">{dica.titulo}:</strong> {dica.texto}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <EsquadroCalculator />
            </div>
          </div>
        </section>

        <section className="print:hidden rounded-2xl border border-wood-200 bg-wood-50 p-5 text-center shadow-sm">
          <Hammer size={20} className="mx-auto mb-2 text-wood-700" />
          <p className="text-sm font-medium text-wood-800">
            O checklist de cada peça agora fica dentro do projeto do cliente.
          </p>
          <p className="mt-1 text-xs text-wood-600">
            Acesse a lista de projetos em produção para marcar as etapas conforme avança.
          </p>
          <Link
            href="/producao"
            className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-wood-600 px-4 py-2 text-sm font-semibold text-white hover:bg-wood-700"
          >
            Ver projetos em produção
          </Link>
        </section>
      </main>

      <footer className="border-t border-charcoal-100 px-6 py-6 text-center text-xs text-charcoal-400">
        Padronização de Marcenaria — Manual de Fabricação &amp; Tolerâncias Mecânicas. Garantia
        de precisão milimétrica, durabilidade estrutural e satisfação do cliente final.
      </footer>
    </div>
  );
}
