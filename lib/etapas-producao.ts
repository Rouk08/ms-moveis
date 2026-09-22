// Etapas padrão do calendário de produção, criadas automaticamente
// quando um contrato passa a ASSINADO. Datas calculadas a partir do
// prazo de execução do próprio contrato — mesma lógica das cláusulas
// 3.1 (05 dias úteis pra aprovação do projeto) e 4.1 (prazo contado a
// partir da aprovação + sinal) do modelo de contrato.
export function calcularEtapasPadrao(
  dataContrato: Date,
  prazoExecucaoDias: number
): { nome: string; dataPrevista: Date }[] {
  const somarDias = (dias: number) => {
    const data = new Date(dataContrato);
    data.setDate(data.getDate() + dias);
    return data;
  };

  const diasAprovacao = 5;
  const diasEntrega = Math.round(prazoExecucaoDias * 0.85);

  return [
    { nome: "Aprovação do projeto executivo", dataPrevista: somarDias(diasAprovacao) },
    { nome: "Início da fabricação", dataPrevista: somarDias(diasAprovacao) },
    {
      nome: "Entrega dos móveis",
      dataPrevista: somarDias(diasAprovacao + diasEntrega),
    },
    {
      nome: "Instalação",
      dataPrevista: somarDias(diasAprovacao + prazoExecucaoDias),
    },
  ];
}
