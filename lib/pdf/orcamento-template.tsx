import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";
import { stats, processSteps, differentiators, type company as companyData } from "@/lib/data";

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

function formatPercent(value: number): string {
  return value.toLocaleString("pt-BR", { maximumFractionDigits: 1 });
}

const INCLUDE_TITLE_OVERRIDES: Record<string, string> = {
  "Projeto 3D Personalizado": "Projeto",
};

const PROCESS_TITLE_OVERRIDES: Record<string, string> = {
  "Projeto 3D": "Projeto",
};

const PROJETO_DIFERENCIAL_TITLE = "Projeto 3D Personalizado";

const styles = StyleSheet.create({
  page: {
    padding: 48,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#1f1a17",
    lineHeight: 1.4,
  },
  headerBand: {
    flexDirection: "row",
    marginHorizontal: -48,
    marginTop: -48,
    marginBottom: 20,
  },
  headerBandLeft: {
    width: "38%",
    backgroundColor: "#2b2119",
    paddingHorizontal: 26,
    paddingVertical: 26,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerBandRight: {
    flex: 1,
    backgroundColor: "#faf6f0",
    paddingHorizontal: 26,
    paddingVertical: 26,
    justifyContent: "center",
  },
  logo: {
    width: 46,
    height: 46,
    borderRadius: 23,
  },
  headerCompanyName: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#f5ede2",
  },
  headerSlogan: {
    fontSize: 7.5,
    color: "#c9a468",
    marginTop: 2,
  },
  tagline: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: "#8a6d3f",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 9,
    color: "#6b6156",
  },
  sectionTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: "#8a6d3f",
    marginBottom: 6,
    marginTop: 13,
  },
  paragraph: {
    textAlign: "justify",
    color: "#1f1a17",
  },
  clientSection: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 4,
  },
  clientCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e5ddd4",
    borderRadius: 8,
    padding: 14,
  },
  clientCardRow: {
    flexDirection: "row",
    marginBottom: 7,
  },
  clientCardDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#b3763a",
    marginTop: 4,
    marginRight: 8,
  },
  clientCardLabel: {
    fontSize: 8,
    color: "#6b6156",
    marginBottom: 1,
  },
  clientCardValue: {
    color: "#1f1a17",
    fontFamily: "Helvetica-Bold",
  },
  projectPhotoBox: {
    width: 140,
    height: 140,
    borderRadius: 8,
  },
  projectPhotoImg: {
    width: 140,
    height: 140,
    borderRadius: 8,
    objectFit: "cover",
  },
  itemCategoria: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 0.4,
    color: "#8a6d3f",
    marginTop: 8,
    marginBottom: 4,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#f0eae1",
  },
  itemNomeBlock: {
    flex: 1,
    paddingRight: 10,
  },
  itemNome: {
    color: "#1f1a17",
  },
  itemObservacao: {
    fontSize: 8,
    fontStyle: "italic",
    color: "#8a8078",
    marginTop: 2,
  },
  itemValor: {
    color: "#1f1a17",
    fontFamily: "Helvetica-Bold",
  },
  categoriaSubtotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 4,
    paddingBottom: 2,
  },
  categoriaSubtotalLabel: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    color: "#6b6156",
  },
  categoriaSubtotalValor: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    color: "#6b6156",
  },
  itemsCard: {
    borderWidth: 1,
    borderColor: "#e5ddd4",
    borderRadius: 8,
    padding: 12,
  },
  resumoBox: {
    marginTop: 10,
    padding: 16,
    backgroundColor: "#faf6f0",
    borderRadius: 8,
  },
  resumoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  resumoLabel: {
    fontSize: 9,
    color: "#6b6156",
  },
  resumoValue: {
    fontSize: 9,
    color: "#1f1a17",
    fontFamily: "Helvetica-Bold",
  },
  resumoDescontoValue: {
    fontSize: 9,
    color: "#a15c3c",
    fontFamily: "Helvetica-Bold",
  },
  resumoDivider: {
    height: 1,
    backgroundColor: "#e5ddd4",
    marginVertical: 8,
  },
  resumoTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  resumoTotalLabel: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#1f1a17",
  },
  resumoTotalValue: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: "#8a5a2b",
  },
  footerInfoRow: {
    flexDirection: "row",
    marginTop: 13,
  },
  footerInfoCol: {
    flex: 1,
  },
  footerInfoLabel: {
    fontSize: 7.5,
    color: "#6b6156",
    marginBottom: 2,
  },
  footerInfoValue: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#1f1a17",
  },
  includeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  includeItem: {
    width: "50%",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 7,
  },
  includeBullet: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#b3763a",
  },
  includeTitle: {
    fontSize: 9.5,
    fontFamily: "Helvetica-Bold",
    color: "#1f1a17",
  },
  processRow: {
    flexDirection: "row",
  },
  processStep: {
    flex: 1,
    paddingRight: 10,
  },
  processNumberBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#b3763a",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
  },
  processNumberText: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
  },
  processTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#1f1a17",
  },
  statsDivider: {
    height: 1,
    backgroundColor: "#e5ddd4",
    marginTop: 13,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 18,
    paddingTop: 10,
  },
  statValue: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#8a5a2b",
    textAlign: "center",
  },
  statLabel: {
    fontSize: 7.5,
    color: "#6b6156",
    textAlign: "center",
    marginTop: 1,
  },
  footerDivider: {
    height: 1,
    backgroundColor: "#e5ddd4",
    marginTop: 14,
  },
  footer: {
    paddingTop: 8,
    fontSize: 8,
    color: "#8a8078",
    textAlign: "center",
  },
});

type OrcamentoItemData = {
  categoria: string;
  item: string;
  valorUnitario: number;
  observacao?: string | null;
};

type OrcamentoData = {
  nome: string;
  telefone: string;
  email: string | null;
  tipoProjeto: string[];
  mensagem: string;
  valorEstimado: number | null;
  desconto?: number | null;
  incluiProjeto: boolean;
  createdAt: Date;
  itens?: OrcamentoItemData[];
};

type OrcamentoTemplateProps = {
  orcamento: OrcamentoData;
  company: typeof companyData;
  logoSrc: string;
  fotosSrc?: string[];
};

export default function OrcamentoTemplate({
  orcamento: o,
  company,
  logoSrc,
  fotosSrc = [],
}: OrcamentoTemplateProps) {
  const itens = o.itens ?? [];
  const totalItens = itens.reduce((soma, i) => soma + i.valorUnitario, 0);
  const desconto = o.desconto ?? 0;
  const valorFinal = o.valorEstimado;
  const subtotal =
    itens.length > 0 ? totalItens : valorFinal !== null ? valorFinal + desconto : null;
  const descontoPercentual =
    desconto > 0 && subtotal ? (desconto / subtotal) * 100 : 0;
  const dataFormatada = formatDateLong(o.createdAt);
  const fotoDestaque = fotosSrc[0];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerBand}>
          <View style={styles.headerBandLeft}>
            {/* eslint-disable-next-line jsx-a11y/alt-text -- @react-pdf/renderer's Image, not an HTML img */}
            <Image src={logoSrc} style={styles.logo} />
            <View>
              <Text style={styles.headerCompanyName}>{company.name}</Text>
              <Text style={styles.headerSlogan}>Móveis planejados sob medida</Text>
            </View>
          </View>
          <View style={styles.headerBandRight}>
            <Text style={styles.tagline}>
              Proposta personalizada para o seu projeto
            </Text>
            <Text style={styles.subtitle}>Emitido em {dataFormatada}</Text>
          </View>
        </View>

        <View style={styles.clientSection} wrap={false}>
          <View style={styles.clientCard}>
            <Text style={styles.sectionTitle}>Dados do cliente</Text>
            <View style={styles.clientCardRow}>
              <View style={styles.clientCardDot} />
              <View style={{ flex: 1 }}>
                <Text style={styles.clientCardLabel}>Nome</Text>
                <Text style={styles.clientCardValue}>{o.nome}</Text>
              </View>
            </View>
            <View style={styles.clientCardRow}>
              <View style={styles.clientCardDot} />
              <View style={{ flex: 1 }}>
                <Text style={styles.clientCardLabel}>Telefone</Text>
                <Text style={styles.clientCardValue}>{o.telefone}</Text>
              </View>
            </View>
            {o.email && (
              <View style={styles.clientCardRow}>
                <View style={styles.clientCardDot} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.clientCardLabel}>E-mail</Text>
                  <Text style={styles.clientCardValue}>{o.email}</Text>
                </View>
              </View>
            )}
            <View style={[styles.clientCardRow, { marginBottom: 0 }]}>
              <View style={styles.clientCardDot} />
              <View style={{ flex: 1 }}>
                <Text style={styles.clientCardLabel}>Tipo de projeto</Text>
                <Text style={styles.clientCardValue}>
                  {o.tipoProjeto.join(", ") || "—"}
                </Text>
              </View>
            </View>
          </View>
          {fotoDestaque && (
            <View style={styles.projectPhotoBox}>
              {/* eslint-disable-next-line jsx-a11y/alt-text -- @react-pdf/renderer's Image, not an HTML img */}
              <Image src={fotoDestaque} style={styles.projectPhotoImg} />
            </View>
          )}
        </View>

        <Text style={styles.sectionTitle}>Descrição do projeto</Text>
        <Text style={styles.paragraph}>{o.mensagem}</Text>

        {itens.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Itens do orçamento</Text>
            <View style={styles.itemsCard}>
              {Object.entries(
                itens.reduce<Record<string, OrcamentoItemData[]>>((grupos, i) => {
                  (grupos[i.categoria] ??= []).push(i);
                  return grupos;
                }, {})
              ).map(([categoria, itensDaCategoria]) => (
                <View key={categoria}>
                  <Text style={styles.itemCategoria}>{categoria}</Text>
                  {itensDaCategoria.map((i, index) => (
                    <View
                      key={`${i.item}-${index}`}
                      style={styles.itemRow}
                      wrap={false}
                    >
                      <View style={styles.itemNomeBlock}>
                        <Text style={styles.itemNome}>{i.item}</Text>
                        {i.observacao && (
                          <Text style={styles.itemObservacao}>
                            {i.observacao}
                          </Text>
                        )}
                      </View>
                      <Text style={styles.itemValor}>
                        {formatBRL(i.valorUnitario)}
                      </Text>
                    </View>
                  ))}
                  <View style={styles.categoriaSubtotalRow}>
                    <Text style={styles.categoriaSubtotalLabel}>
                      Subtotal — {categoria.toLowerCase()}
                    </Text>
                    <Text style={styles.categoriaSubtotalValor}>
                      {formatBRL(
                        itensDaCategoria.reduce(
                          (soma, i) => soma + i.valorUnitario,
                          0
                        )
                      )}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}

        <Text style={styles.sectionTitle}>Resumo do investimento</Text>
        <View style={styles.resumoBox} wrap={false}>
          {subtotal !== null && (
            <View style={styles.resumoRow}>
              <Text style={styles.resumoLabel}>Subtotal</Text>
              <Text style={styles.resumoValue}>{formatBRL(subtotal)}</Text>
            </View>
          )}
          {desconto > 0 && (
            <View style={styles.resumoRow}>
              <Text style={styles.resumoLabel}>
                Desconto à vista de {formatPercent(descontoPercentual)}%
              </Text>
              <Text style={styles.resumoDescontoValue}>
                - {formatBRL(desconto)}
              </Text>
            </View>
          )}
          <View style={styles.resumoDivider} />
          <View style={styles.resumoTotalRow}>
            <Text style={styles.resumoTotalLabel}>Total do investimento</Text>
            <Text style={styles.resumoTotalValue}>
              {valorFinal !== null ? formatBRL(valorFinal) : "A definir"}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>O que está incluso</Text>
        <View style={styles.includeGrid}>
          {differentiators
            .filter(
              (item) =>
                o.incluiProjeto || item.title !== PROJETO_DIFERENCIAL_TITLE
            )
            .map((item) => (
              <View key={item.title} style={styles.includeItem} wrap={false}>
                <View style={styles.includeBullet} />
                <Text style={styles.includeTitle}>
                  {INCLUDE_TITLE_OVERRIDES[item.title] ?? item.title}
                </Text>
              </View>
            ))}
        </View>

        <Text style={styles.sectionTitle}>Como funciona</Text>
        <View style={styles.processRow}>
          {processSteps.map((step) => (
            <View key={step.step} style={styles.processStep} wrap={false}>
              <View style={styles.processNumberBadge}>
                <Text style={styles.processNumberText}>{step.step}</Text>
              </View>
              <Text style={styles.processTitle}>
                {PROCESS_TITLE_OVERRIDES[step.title] ?? step.title}
              </Text>
            </View>
          ))}
        </View>

        <Text
          style={[
            styles.paragraph,
            { marginTop: 13, fontSize: 8.5, color: "#8a8078" },
          ]}
        >
          Este orçamento é uma estimativa inicial e não constitui contrato.
          Valores finais podem variar conforme detalhamento do projeto
          executivo. Após aprovação, será formalizado um contrato de
          prestação de serviços.
        </Text>

        <View style={styles.footerInfoRow} wrap={false}>
          <View style={styles.footerInfoCol}>
            <Text style={styles.footerInfoLabel}>Validade da proposta</Text>
            <Text style={styles.footerInfoValue}>10 dias</Text>
          </View>
          <View style={styles.footerInfoCol}>
            <Text style={styles.footerInfoLabel}>Condições de pagamento</Text>
            <Text style={styles.footerInfoValue}>
              Sinal + parcela + entrega
            </Text>
          </View>
          <View style={styles.footerInfoCol}>
            <Text style={styles.footerInfoLabel}>Prazo de entrega</Text>
            <Text style={styles.footerInfoValue}>30 a 45 dias</Text>
          </View>
        </View>

        <View style={styles.statsDivider} />
        <View style={styles.statsRow}>
          {stats.map((stat) => (
            <View key={stat.label}>
              <Text style={styles.statValue}>
                {stat.value}
                {stat.suffix}
              </Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.footerDivider} />
        <Text style={styles.footer}>
          {company.name} · {company.phone.display} ·{" "}
          {company.whatsapp.display} · {company.email} · {company.website}
        </Text>
      </Page>
    </Document>
  );
}
