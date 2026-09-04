import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { getCompanyInfo } from "@/lib/company";

const MESES = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

function formatDateLong(date: Date): string {
  return `${date.getDate()} de ${MESES[date.getMonth()]} de ${date.getFullYear()}`;
}

function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const styles = StyleSheet.create({
  page: {
    padding: 48,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#1f1a17",
    lineHeight: 1.4,
  },
  title: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    marginBottom: 4,
  },
  subsubtitle: {
    fontSize: 9,
    textAlign: "center",
    marginBottom: 4,
    fontStyle: "italic",
  },
  date: {
    fontSize: 9,
    textAlign: "center",
    marginBottom: 16,
  },
  clauseTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    marginTop: 12,
    marginBottom: 6,
  },
  paragraph: {
    marginBottom: 6,
    textAlign: "justify",
  },
  listItem: {
    marginBottom: 4,
    marginLeft: 12,
    textAlign: "justify",
  },
  especCategoria: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    marginTop: 6,
    marginBottom: 2,
    marginLeft: 12,
  },
  especItem: {
    marginBottom: 3,
    marginLeft: 20,
    textAlign: "justify",
  },
  especObservacao: {
    fontSize: 8.5,
    fontStyle: "italic",
    color: "#4a4038",
  },
  signatureBlock: {
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  signatureLine: {
    borderTopWidth: 1,
    borderTopColor: "#1f1a17",
    width: 220,
    paddingTop: 4,
    textAlign: "center",
  },
  witnessBlock: {
    marginTop: 32,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

type ContratoData = {
  tipoContratante: "PESSOA_FISICA" | "PESSOA_JURIDICA";
  contratanteNome: string;
  contratanteDocumento: string;
  contratanteEndereco: string;
  contratanteCep: string;
  contratanteBairro: string;
  contratanteCidade: string;
  contratanteUf: string;
  contratanteRepNome: string | null;
  contratanteRepCpf: string | null;
  contratanteRepRg: string | null;
  contratanteRepCargo: string | null;
  enderecoInstalacao: string;
  prazoExecucaoDias: number;
  valorTotal: number;
  valorSinal: number;
  valorFabricacao: number;
  valorEntrega: number;
  foroCidade: string;
  foroUf: string;
  dataContrato: Date;
  clausulaAdicional: string | null;
};

const FORMA_PAGAMENTO_LABELS: Record<string, string> = {
  DINHEIRO: "dinheiro",
  PIX: "PIX",
  CARTAO_CREDITO: "cartão de crédito",
  CARTAO_DEBITO: "cartão de débito",
  BOLETO: "boleto",
  TRANSFERENCIA: "transferência bancária",
};

type ParcelaOrcamentoData = {
  descricao: string;
  valor: number;
  vencimento: string | null;
};

type ItemOrcamentoData = {
  categoria: string;
  item: string;
  valorUnitario: number;
  observacao: string | null;
};

type ContratoTemplateProps = {
  contrato: ContratoData;
  company: ReturnType<typeof getCompanyInfo>;
  // Número, forma de pagamento e parcelas vêm do Orçamento vinculado,
  // não são campos do Contrato — mantém a origem única do dado
  // (definida na etapa de orçamento, só refletida aqui). A Cláusula
  // Quinta usa exatamente essas parcelas, na mesma ordem/descrição/
  // valor definidos no orçamento.
  orcamentoNumero: number;
  formaPagamento?: string | null;
  parcelado?: boolean;
  numeroParcelas?: number | null;
  parcelasOrcamento?: ParcelaOrcamentoData[];
  itensOrcamento?: ItemOrcamentoData[];
};

export default function ContratoTemplate({
  contrato,
  company,
  orcamentoNumero,
  formaPagamento,
  parcelado,
  numeroParcelas,
  parcelasOrcamento,
  itensOrcamento,
}: ContratoTemplateProps) {
  const c = contrato;
  const dataFormatada = formatDateLong(c.dataContrato);
  const parcelamentoTexto = parcelado
    ? numeroParcelas
      ? `parcelado em ${numeroParcelas} vezes`
      : "de forma parcelada"
    : "à vista";
  // Contratos gerados antes das parcelas exatas do orçamento existirem
  // (ou de orçamentos sem parcelas definidas) caem no split 30/40/30
  // legado, calculado na criação do contrato — nunca deixa a Cláusula
  // Quinta sem nenhum item.
  const parcelasParaExibir: ParcelaOrcamentoData[] =
    parcelasOrcamento && parcelasOrcamento.length > 0
      ? parcelasOrcamento
      : [
          {
            descricao:
              "Sinal de 30% (trinta por cento) no ato da assinatura e aprovação do projeto",
            valor: c.valorSinal,
            vencimento: "Na assinatura",
          },
          {
            descricao: "Parcela de 40% (quarenta por cento) no início da fabricação",
            valor: c.valorFabricacao,
            vencimento: "Início da fabricação",
          },
          {
            descricao: "Parcela de 30% (trinta por cento) na entrega e instalação final",
            valor: c.valorEntrega,
            vencimento: "Entrega e instalação",
          },
        ];

  // Especificação do que será produzido, agrupada por categoria, na
  // mesma estrutura usada no PDF do orçamento — só aparece quando o
  // orçamento de origem usou itens detalhados (nem todo orçamento usa,
  // alguns têm só um valor estimado fechado).
  const itensPorCategoria = (itensOrcamento ?? []).reduce<
    Record<string, ItemOrcamentoData[]>
  >((grupos, item) => {
    (grupos[item.categoria] ??= []).push(item);
    return grupos;
  }, {});

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>MS MÓVEIS PLANEJADOS</Text>
        <Text style={styles.subtitle}>
          CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE PROJETO, FABRICAÇÃO E
          INSTALAÇÃO DE MÓVEIS PLANEJADOS
        </Text>
        <Text style={styles.subsubtitle}>
          Instrumento particular de prestação de serviços técnicos e
          industriais
        </Text>
        <Text style={styles.date}>
          Vinculado ao Orçamento nº {orcamentoNumero} · {dataFormatada}
        </Text>

        <Text style={styles.clauseTitle}>1. PREÂMBULO</Text>
        <Text style={styles.paragraph}>
          Pelo presente instrumento particular, as partes abaixo qualificadas
          têm entre si, justo e contratado, a prestação de serviços que se
          regerá pelas cláusulas e condições adiante descritas:
        </Text>
        {c.tipoContratante === "PESSOA_JURIDICA" ? (
          <Text style={styles.paragraph}>
            CONTRATANTE: {c.contratanteNome}, inscrito(a) no CNPJ sob o nº{" "}
            {c.contratanteDocumento}, com sede na {c.contratanteEndereco},
            CEP {c.contratanteCep}, bairro {c.contratanteBairro}, cidade{" "}
            {c.contratanteCidade}, estado {c.contratanteUf}, neste ato
            representado(a) por seu representante legal, o(a) Sr(a).{" "}
            {c.contratanteRepNome}, portador(a) do CPF nº{" "}
            {c.contratanteRepCpf}, RG nº {c.contratanteRepRg}, cargo{" "}
            {c.contratanteRepCargo}, doravante denominado(a) simplesmente
            CONTRATANTE.
          </Text>
        ) : (
          <Text style={styles.paragraph}>
            CONTRATANTE: {c.contratanteNome}, portador(a) do CPF nº{" "}
            {c.contratanteDocumento}, residente na {c.contratanteEndereco},
            CEP {c.contratanteCep}, bairro {c.contratanteBairro}, cidade{" "}
            {c.contratanteCidade}, estado {c.contratanteUf}, doravante
            denominado(a) simplesmente CONTRATANTE.
          </Text>
        )}
        <Text style={styles.paragraph}>
          CONTRATADA: MS MÓVEIS PLANEJADOS, pessoa jurídica de direito
          privado, inscrita no CNPJ sob o nº {company.cnpj}, com sede na{" "}
          {company.endereco}, CEP {company.cep}, bairro {company.bairro},
          cidade {company.cidade}, estado {company.uf}, neste ato
          representada por seu representante legal, o(a) Sr(a).{" "}
          {company.repNome}, portador(a) do CPF nº {company.repCpf}, RG nº{" "}
          {company.repRg}, cargo {company.repCargo}, doravante denominada
          simplesmente CONTRATADA.
        </Text>

        <Text style={styles.clauseTitle}>
          2. CLÁUSULA PRIMEIRA – DO OBJETO
        </Text>
        <Text style={styles.paragraph}>
          1.1. O presente contrato tem por objeto a prestação de serviços de
          projeto, fabricação e instalação de móveis planejados pela
          CONTRATADA em favor da CONTRATANTE, conforme especificações
          técnicas, memorial descritivo e projetos aprovados que farão parte
          integrante deste contrato como Anexos.
        </Text>
        <Text style={styles.paragraph}>
          1.2. Os serviços compreendem, sem se limitar a:
        </Text>
        <Text style={styles.listItem}>
          a) Elaboração de projeto técnico e executivo de móveis planejados,
          incluindo plantas, cortes e perspectivas;
        </Text>
        <Text style={styles.listItem}>
          b) Fabricação de todos os móveis conforme projeto aprovado,
          utilizando materiais de qualidade comprovada;
        </Text>
        <Text style={styles.listItem}>
          c) Entrega e instalação dos móveis no endereço designado pela
          CONTRATANTE;
        </Text>
        <Text style={styles.listItem}>
          d) Acabamento final, incluindo ajustes e revisões necessárias para
          perfeita funcionalidade e estética;
        </Text>
        <Text style={styles.listItem}>
          e) Limpeza do local de instalação ao término dos serviços.
        </Text>
        <Text style={styles.paragraph}>
          1.3. O local da prestação dos serviços será:{" "}
          {c.enderecoInstalacao}.
        </Text>
        <Text style={styles.paragraph}>
          1.4. Quaisquer serviços adicionais não previstos no projeto
          original serão objeto de aditivo contratual com definição de
          prazo e preço adicionais.
        </Text>
        {itensOrcamento && itensOrcamento.length > 0 && (
          <>
            <Text style={styles.paragraph}>
              1.5. Os móveis planejados objeto deste contrato, conforme
              especificado no Orçamento nº {orcamentoNumero}, compreendem
              os seguintes itens:
            </Text>
            {Object.entries(itensPorCategoria).map(([categoria, itens]) => (
              <View key={categoria}>
                <Text style={styles.especCategoria}>{categoria}</Text>
                {itens.map((item, index) => (
                  <Text key={index} style={styles.especItem}>
                    • {item.item} — {formatBRL(item.valorUnitario)}
                    {item.observacao && (
                      <Text style={styles.especObservacao}>
                        {" "}
                        ({item.observacao})
                      </Text>
                    )}
                  </Text>
                ))}
              </View>
            ))}
          </>
        )}

        <Text style={styles.clauseTitle}>
          3. CLÁUSULA SEGUNDA – DAS OBRIGAÇÕES DA CONTRATADA
        </Text>
        <Text style={styles.paragraph}>
          2.1. A CONTRATADA obriga-se a executar os serviços com zelo,
          diligência e técnica adequada, observando as normas técnicas
          aplicáveis, em especial a ABNT NBR 15995:2011, utilizando
          materiais de primeira qualidade conforme especificações do
          projeto aprovado.
        </Text>
        <Text style={styles.paragraph}>
          2.2. É de responsabilidade da CONTRATADA o fornecimento de toda a
          mão de obra, ferramentas, equipamentos e insumos necessários, bem
          como a remoção de entulhos e resíduos gerados durante a
          instalação, entregando o local em condições adequadas de uso.
        </Text>
        <Text style={styles.paragraph}>
          2.3. A CONTRATADA assume integral responsabilidade trabalhista,
          previdenciária e cível sobre seus empregados e colaboradores,
          isentando a CONTRATANTE de qualquer responsabilidade solidária ou
          subsidiária, nos termos do Art. 455 da CLT e da Súmula 331 do
          TST.
        </Text>

        <Text style={styles.clauseTitle}>
          4. CLÁUSULA TERCEIRA – DAS OBRIGAÇÕES DA CONTRATANTE
        </Text>
        <Text style={styles.paragraph}>
          3.1. A CONTRATANTE obriga-se a fornecer todas as informações
          necessárias para a elaboração do projeto, incluindo medidas e
          particularidades do ambiente, além de aprovar o projeto executivo
          em até 05 (cinco) dias úteis do recebimento.
        </Text>
        <Text style={styles.paragraph}>
          3.2. Deverá a CONTRATANTE disponibilizar o local de instalação em
          condições adequadas (acesso, energia elétrica e segurança) e
          efetuar os pagamentos nas formas e prazos estabelecidos na
          Cláusula Quinta.
        </Text>

        <Text style={styles.clauseTitle}>
          5. CLÁUSULA QUARTA – DO PRAZO DE EXECUÇÃO
        </Text>
        <Text style={styles.paragraph}>
          4.1. O prazo total para execução dos serviços é de{" "}
          {c.prazoExecucaoDias} ({c.prazoExecucaoDias === 1 ? "um" : c.prazoExecucaoDias}
          ) dias corridos, contados a partir da aprovação do projeto
          executivo e do recebimento do sinal financeiro.
        </Text>
        <Text style={styles.paragraph}>
          4.2. O cronograma seguirá as etapas de elaboração/aprovação,
          fabricação, entrega/instalação e ajustes finais, podendo ser
          suspenso por alterações solicitadas pela CONTRATANTE, caso
          fortuito, força maior ou atraso nos pagamentos.
        </Text>
        <Text style={styles.paragraph}>
          4.3. Atrasos imputáveis exclusivamente à CONTRATADA sujeitam-na à
          multa de 1% (um por cento) do valor total do contrato por dia de
          atraso, limitada a 10% (dez por cento) do valor global.
        </Text>

        <Text style={styles.clauseTitle}>
          6. CLÁUSULA QUINTA – DO PREÇO E DAS CONDIÇÕES DE PAGAMENTO
        </Text>
        <Text style={styles.paragraph}>
          5.1. O valor total dos serviços é de {formatBRL(c.valorTotal)},
          abrangendo todos os custos diretos e indiretos da operação.
        </Text>
        <Text style={styles.paragraph}>
          5.2. O pagamento será escalonado da seguinte forma, exatamente
          como definido no Orçamento nº {orcamentoNumero}:
        </Text>
        {parcelasParaExibir.map((parcela, index) => (
          <Text key={index} style={styles.listItem}>
            {String.fromCharCode(97 + index)}) {parcela.descricao}
            {parcela.vencimento ? ` (${parcela.vencimento})` : ""}:{" "}
            {formatBRL(parcela.valor)}
            {index === parcelasParaExibir.length - 1 ? "." : ";"}
          </Text>
        ))}
        {formaPagamento && (
          <Text style={styles.paragraph}>
            5.3. Cada parcela acima será quitada via{" "}
            {FORMA_PAGAMENTO_LABELS[formaPagamento] ?? formaPagamento},{" "}
            {parcelamentoTexto}.
          </Text>
        )}

        <Text style={styles.clauseTitle}>
          7. CLÁUSULA SEXTA – DO ATRASO E DA INADIMPLÊNCIA
        </Text>
        <Text style={styles.paragraph}>
          6.1. O atraso no pagamento sujeitará a CONTRATANTE à multa de 2%
          (dois por cento), juros de mora de 1% (um por cento) ao mês e
          correção monetária pelo IGP-M/FGV.
        </Text>
        <Text style={styles.paragraph}>
          6.2. A inadimplência superior a 10 (dez) dias autoriza a
          suspensão dos serviços, e superior a 15 (quinze) dias permite a
          rescisão de pleno direito com inclusão em órgãos de proteção ao
          crédito.
        </Text>

        <Text style={styles.clauseTitle}>
          8. CLÁUSULA SÉTIMA – DA GARANTIA
        </Text>
        <Text style={styles.paragraph}>
          7.1. A CONTRATADA oferece garantia contratual de 24 (vinte e
          quatro) meses, contados a partir da data de entrega e instalação,
          exclusivamente para defeitos de fabricação e/ou instalação dos
          móveis, não se aplicando a danos decorrentes de mau uso,
          negligência ou desgaste natural, sem prejuízo dos direitos
          assegurados ao consumidor pela Lei nº 8.078/90 (CDC).
        </Text>
        <Text style={styles.paragraph}>
          7.2. Não estão cobertos por esta garantia, por não constituírem
          defeito de fabricação ou instalação: danos causados por mau uso
          ou uso inadequado; agentes externos (umidade, calor,
          infiltrações); desgaste natural pelo uso; e intervenções,
          reparos ou modificações realizados por terceiros não autorizados
          pela CONTRATADA.
        </Text>

        <Text style={styles.clauseTitle}>
          9. CLÁUSULA OITAVA – DO REAJUSTE
        </Text>
        <Text style={styles.paragraph}>
          8.1. Os valores contratuais serão reajustados anualmente pelo
          índice IGP-M/FGV acumulado, de forma automática, visando a
          manutenção do equilíbrio econômico-financeiro do contrato.
        </Text>

        <Text style={styles.clauseTitle}>
          10. CLÁUSULA NONA – DA RESCISÃO
        </Text>
        <Text style={styles.paragraph}>
          9.1. A rescisão antecipada imotivada pela CONTRATANTE implicará
          em multa de 50% (cinquenta por cento) sobre o saldo remanescente
          dos serviços não executados.
        </Text>

        <Text style={styles.clauseTitle}>
          11. CLÁUSULA DÉCIMA – DO SIGILO E PROTEÇÃO DE DADOS (LGPD)
        </Text>
        <Text style={styles.paragraph}>
          10.1. As partes obrigam-se ao sigilo absoluto sobre informações
          técnicas e comerciais por 02 (dois) anos após o término do
          contrato.
        </Text>
        <Text style={styles.paragraph}>
          10.2. O tratamento de dados pessoais observará estritamente a Lei
          nº 13.709/2018 (LGPD), limitando-se às finalidades necessárias
          para a execução deste instrumento.
        </Text>

        <Text style={styles.clauseTitle}>
          12. CLÁUSULA DÉCIMA PRIMEIRA – DO FORO
        </Text>
        <Text style={styles.paragraph}>
          11.1. Fica eleito o foro da Comarca de {c.foroCidade}/{c.foroUf}{" "}
          para dirimir controvérsias, com renúncia a qualquer outro,
          ressalvadas as hipóteses de competência absoluta previstas no
          Código de Defesa do Consumidor.
        </Text>

        {c.clausulaAdicional && c.clausulaAdicional.trim() && (
          <>
            <Text style={styles.clauseTitle}>
              13. CLÁUSULA DÉCIMA SEGUNDA – DISPOSIÇÕES ADICIONAIS
            </Text>
            {c.clausulaAdicional
              .trim()
              .split(/\n+/)
              .filter((linha) => linha.trim())
              .map((linha, index) => (
                <Text key={index} style={styles.paragraph}>
                  {linha.trim()}
                </Text>
              ))}
          </>
        )}

        <View style={styles.signatureBlock}>
          <Text style={styles.signatureLine}>{c.contratanteNome}</Text>
          <Text style={styles.signatureLine}>MS MÓVEIS PLANEJADOS</Text>
        </View>
        <View style={styles.witnessBlock}>
          <Text style={styles.signatureLine}>Testemunha 1</Text>
          <Text style={styles.signatureLine}>Testemunha 2</Text>
        </View>
        <Text style={[styles.paragraph, { marginTop: 24, textAlign: "center" }]}>
          Local e data: _________________________, {dataFormatada}
        </Text>
      </Page>
    </Document>
  );
}
