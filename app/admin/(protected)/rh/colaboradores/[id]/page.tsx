import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, Calendar, Briefcase, Plus } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import StatusBadgeColaborador from "@/components/admin/StatusBadgeColaborador";
import StatusBadgeFerias from "@/components/admin/StatusBadgeFerias";
import StatusBadgeAfastamento from "@/components/admin/StatusBadgeAfastamento";
import EditColaboradorForm from "@/components/admin/EditColaboradorForm";
import ResetarPinButton from "@/components/admin/ResetarPinButton";

function formatCpf(cpf: string): string {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

export default async function ColaboradorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (session?.user.role !== "ADMIN") {
    redirect("/admin");
  }

  const { id } = await params;
  const hoje = new Date();

  const colaborador = await prisma.colaborador.findUnique({
    where: { id },
    include: {
      afastamentos: {
        where: {
          dataInicio: { lte: hoje },
          OR: [{ dataFim: null }, { dataFim: { gte: hoje } }],
        },
        take: 1,
      },
      ferias: {
        where: { dataGozoInicio: { lte: hoje }, dataGozoFim: { gte: hoje } },
        take: 1,
      },
    },
  });

  if (!colaborador) notFound();

  const [feriasRecentes, afastamentosRecentes, pontosRecentes] =
    await Promise.all([
      prisma.ferias.findMany({
        where: { colaboradorId: id },
        orderBy: { periodoAquisitivoInicio: "desc" },
        take: 5,
      }),
      prisma.afastamento.findMany({
        where: { colaboradorId: id },
        orderBy: { dataInicio: "desc" },
        take: 5,
      }),
      prisma.ponto.findMany({
        where: { colaboradorId: id },
        orderBy: { dataHora: "desc" },
        take: 10,
      }),
    ]);

  return (
    <div className="max-w-3xl">
      <Link
        href="/admin/rh/colaboradores"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-charcoal-500 hover:text-charcoal-700 mb-6"
      >
        <ArrowLeft size={16} />
        Voltar para colaboradores
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-charcoal-800">
            {colaborador.nome}
          </h1>
          <p className="text-sm text-charcoal-500">
            {formatCpf(colaborador.cpf)}
          </p>
        </div>
        <StatusBadgeColaborador
          dataDemissao={colaborador.dataDemissao}
          afastamentoAtivo={colaborador.afastamentos.length > 0}
          feriasAtiva={colaborador.ferias.length > 0}
        />
      </div>

      <div className="rounded-2xl border border-charcoal-100 bg-white p-6 shadow-sm mb-6">
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="flex gap-2.5">
            <Briefcase size={16} className="text-wood-500 mt-0.5 shrink-0" />
            <div>
              <dt className="text-charcoal-400">Cargo</dt>
              <dd className="text-charcoal-700">{colaborador.cargo}</dd>
            </div>
          </div>
          <div className="flex gap-2.5">
            <Calendar size={16} className="text-wood-500 mt-0.5 shrink-0" />
            <div>
              <dt className="text-charcoal-400">Admissão</dt>
              <dd className="text-charcoal-700">
                {colaborador.dataAdmissao.toLocaleDateString("pt-BR")}
              </dd>
            </div>
          </div>
          <div className="flex gap-2.5">
            <Phone size={16} className="text-wood-500 mt-0.5 shrink-0" />
            <div>
              <dt className="text-charcoal-400">Telefone</dt>
              <dd className="text-charcoal-700">
                {colaborador.telefone || "—"}
              </dd>
            </div>
          </div>
          <div className="flex gap-2.5">
            <Mail size={16} className="text-wood-500 mt-0.5 shrink-0" />
            <div>
              <dt className="text-charcoal-400">E-mail</dt>
              <dd className="text-charcoal-700">
                {colaborador.email || "—"}
              </dd>
            </div>
          </div>
        </dl>
      </div>

      <div className="mb-6">
        <h2 className="font-semibold text-charcoal-800 mb-3">
          Acesso ao ponto
        </h2>
        <ResetarPinButton id={colaborador.id} />
      </div>

      <div className="mb-8">
        <EditColaboradorForm
          id={colaborador.id}
          nome={colaborador.nome}
          cargo={colaborador.cargo}
          telefone={colaborador.telefone ?? ""}
          email={colaborador.email ?? ""}
          salario={colaborador.salario?.toString() ?? ""}
          dataDemissao={
            colaborador.dataDemissao
              ? colaborador.dataDemissao.toISOString().slice(0, 10)
              : ""
          }
          notasInternas={colaborador.notasInternas ?? ""}
        />
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-charcoal-800">Férias</h2>
          <Link
            href={`/admin/rh/ferias/novo?colaboradorId=${colaborador.id}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-wood-600 hover:text-wood-700"
          >
            <Plus size={14} />
            Nova
          </Link>
        </div>
        <div className="rounded-2xl border border-charcoal-100 bg-white shadow-sm overflow-hidden">
          {feriasRecentes.length === 0 ? (
            <p className="px-6 py-6 text-sm text-charcoal-400 text-center">
              Nenhum registro de férias.
            </p>
          ) : (
            <ul className="divide-y divide-charcoal-100">
              {feriasRecentes.map((ferias) => (
                <li key={ferias.id}>
                  <Link
                    href={`/admin/rh/ferias/${ferias.id}`}
                    className="flex items-center justify-between px-6 py-3 hover:bg-charcoal-50/60 transition-colors"
                  >
                    <span className="text-sm text-charcoal-700">
                      {ferias.periodoAquisitivoInicio.toLocaleDateString(
                        "pt-BR"
                      )}{" "}
                      –{" "}
                      {ferias.periodoAquisitivoFim.toLocaleDateString(
                        "pt-BR"
                      )}
                    </span>
                    <StatusBadgeFerias
                      periodoAquisitivoFim={ferias.periodoAquisitivoFim}
                      diasDireito={ferias.diasDireito}
                      diasGozados={ferias.diasGozados}
                      dataGozoInicio={ferias.dataGozoInicio}
                      dataGozoFim={ferias.dataGozoFim}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-charcoal-800">Afastamentos</h2>
          <Link
            href={`/admin/rh/afastamentos/novo?colaboradorId=${colaborador.id}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-wood-600 hover:text-wood-700"
          >
            <Plus size={14} />
            Novo
          </Link>
        </div>
        <div className="rounded-2xl border border-charcoal-100 bg-white shadow-sm overflow-hidden">
          {afastamentosRecentes.length === 0 ? (
            <p className="px-6 py-6 text-sm text-charcoal-400 text-center">
              Nenhum afastamento registrado.
            </p>
          ) : (
            <ul className="divide-y divide-charcoal-100">
              {afastamentosRecentes.map((afastamento) => (
                <li key={afastamento.id}>
                  <Link
                    href={`/admin/rh/afastamentos/${afastamento.id}`}
                    className="flex items-center justify-between px-6 py-3 hover:bg-charcoal-50/60 transition-colors"
                  >
                    <span className="text-sm text-charcoal-700">
                      {afastamento.dataInicio.toLocaleDateString("pt-BR")}
                      {afastamento.dataFim
                        ? ` – ${afastamento.dataFim.toLocaleDateString("pt-BR")}`
                        : " – em aberto"}
                    </span>
                    <StatusBadgeAfastamento dataFim={afastamento.dataFim} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div>
        <h2 className="font-semibold text-charcoal-800 mb-3">
          Ponto recente
        </h2>
        <div className="rounded-2xl border border-charcoal-100 bg-white shadow-sm overflow-hidden">
          {pontosRecentes.length === 0 ? (
            <p className="px-6 py-6 text-sm text-charcoal-400 text-center">
              Nenhum registro de ponto.
            </p>
          ) : (
            <ul className="divide-y divide-charcoal-100">
              {pontosRecentes.map((ponto) => (
                <li
                  key={ponto.id}
                  className="flex items-center justify-between px-6 py-3"
                >
                  <span className="text-sm text-charcoal-700">
                    {ponto.dataHora.toLocaleString("pt-BR")}
                  </span>
                  <span
                    className={`text-xs font-medium ${
                      ponto.tipo === "ENTRADA"
                        ? "text-moss-600"
                        : "text-charcoal-500"
                    }`}
                  >
                    {ponto.tipo === "ENTRADA" ? "Entrada" : "Saída"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
