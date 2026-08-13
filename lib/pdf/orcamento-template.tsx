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
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: "#b3763a",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5ddd4",
  },
  logo: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  companyName: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
  },
  companyMeta: {
    fontSize: 8.5,
    color: "#6b6156",
    marginTop: 2,
  },
  title: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
  },
  tagline: {
    fontSize: 10,
    color: "#8a6d3f",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 9,
    color: "#6b6156",
    marginBottom: 14,
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
  row: {
    flexDirection: "row",
    marginBottom: 4,
  },
  label: {
    width: 110,
    color: "#6b6156",
  },
  value: {
    flex: 1,
    color: "#1f1a17",
  },
  clientName: {
    flex: 1,
    color: "#1f1a17",
    fontFamily: "Helvetica-Bold",
  },
  paragraph: {
    textAlign: "justify",
    color: "#1f1a17",
  },
  valorBox: {
    marginTop: 10,
    padding: 16,
    backgroundColor: "#faf6f0",
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
  },
  valorBlock: {
    flex: 1,
  },
  valorDivider: {
    width: 1,
    alignSelf: "stretch",
    backgroundColor: "#e5ddd4",
    marginHorizontal: 16,
  },
  valorLabel: {
    fontSize: 9,
    color: "#6b6156",
    marginBottom: 3,
  },
  valorAmount: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: "#8a5a2b",
  },
  prazoAmount: {
    fontSize: 12,
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

type OrcamentoData = {
  nome: string;
  telefone: string;
  email: string;
  tipoProjeto: string[];
  mensagem: string;
  valorEstimado: number | null;
  incluiProjeto: boolean;
  createdAt: Date;
};

type OrcamentoTemplateProps = {
  orcamento: OrcamentoData;
  company: typeof companyData;
  logoSrc: string;
};

export default function OrcamentoTemplate({
  orcamento: o,
  company,
  logoSrc,
}: OrcamentoTemplateProps) {
  const dataFormatada = formatDateLong(o.createdAt);
  const validade = new Date(o.createdAt);
  validade.setDate(validade.getDate() + 10);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.topBar} fixed />

        <View style={styles.header}>
          {/* eslint-disable-next-line jsx-a11y/alt-text -- @react-pdf/renderer's Image, not an HTML img */}
          <Image src={logoSrc} style={styles.logo} />
          <View>
            <Text style={styles.companyName}>{company.name}</Text>
            <Text style={styles.companyMeta}>
              {company.address.full} · {company.phone.display} ·{" "}
              {company.email}
            </Text>
          </View>
        </View>

        <Text style={styles.title}>Orçamento</Text>
        <Text style={styles.tagline}>
          Proposta personalizada para o seu projeto
        </Text>
        <Text style={styles.subtitle}>
          Emitido em {dataFormatada} · Válido até{" "}
          {formatDateLong(validade)}
        </Text>

        <Text style={styles.sectionTitle}>Dados do cliente</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Nome</Text>
          <Text style={styles.clientName}>{o.nome}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Telefone</Text>
          <Text style={styles.value}>{o.telefone}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>E-mail</Text>
          <Text style={styles.value}>{o.email}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Tipo de projeto</Text>
          <Text style={styles.value}>{o.tipoProjeto.join(", ") || "—"}</Text>
        </View>

        <Text style={styles.sectionTitle}>Descrição do projeto</Text>
        <Text style={styles.paragraph}>{o.mensagem}</Text>

        <View style={styles.valorBox}>
          <View style={styles.valorBlock}>
            <Text style={styles.valorLabel}>Valor estimado</Text>
            <Text style={styles.valorAmount}>
              {o.valorEstimado !== null
                ? formatBRL(o.valorEstimado)
                : "A definir"}
            </Text>
          </View>
          <View style={styles.valorDivider} />
          <View style={styles.valorBlock}>
            <Text style={styles.valorLabel}>Prazo estimado</Text>
            <Text style={styles.prazoAmount}>30 a 45 dias</Text>
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
              <View key={item.title} style={styles.includeItem}>
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
            <View key={step.step} style={styles.processStep}>
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
          {company.whatsapp.display} · {company.email}
        </Text>
      </Page>
    </Document>
  );
}
