import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";
import type { company as companyData } from "@/lib/data";

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
  watermark: {
    position: "absolute",
    top: 261,
    left: 137,
    width: 320,
    height: 320,
    opacity: 0.06,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5ddd4",
  },
  logo: {
    width: 46,
    height: 46,
    borderRadius: 23,
  },
  companyName: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
  },
  companyMeta: {
    fontSize: 8.5,
    color: "#6b6156",
    marginTop: 2,
  },
  title: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 9,
    color: "#6b6156",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: "#8a6d3f",
    marginBottom: 6,
    marginTop: 16,
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
  paragraph: {
    textAlign: "justify",
    color: "#1f1a17",
  },
  valorBox: {
    marginTop: 16,
    padding: 14,
    backgroundColor: "#faf6f0",
    borderRadius: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  valorLabel: {
    fontSize: 10,
    color: "#6b6156",
  },
  valorAmount: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: "#8a5a2b",
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 48,
    right: 48,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e5ddd4",
    fontSize: 8,
    color: "#8a8078",
    textAlign: "center",
  },
});

type OrcamentoData = {
  nome: string;
  telefone: string;
  email: string;
  tipoProjeto: string;
  mensagem: string;
  valorEstimado: number | null;
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
  validade.setDate(validade.getDate() + 15);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* eslint-disable-next-line jsx-a11y/alt-text -- @react-pdf/renderer's Image, not an HTML img */}
        <Image src={logoSrc} style={styles.watermark} fixed />

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
        <Text style={styles.subtitle}>
          Emitido em {dataFormatada} · Válido até{" "}
          {formatDateLong(validade)}
        </Text>

        <Text style={styles.sectionTitle}>Dados do cliente</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Nome</Text>
          <Text style={styles.value}>{o.nome}</Text>
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
          <Text style={styles.value}>{o.tipoProjeto || "—"}</Text>
        </View>

        <Text style={styles.sectionTitle}>Descrição do projeto</Text>
        <Text style={styles.paragraph}>{o.mensagem}</Text>

        <View style={styles.valorBox}>
          <Text style={styles.valorLabel}>Valor estimado</Text>
          <Text style={styles.valorAmount}>
            {o.valorEstimado !== null ? formatBRL(o.valorEstimado) : "A definir"}
          </Text>
        </View>

        <Text style={[styles.paragraph, { marginTop: 16, fontSize: 8.5, color: "#8a8078" }]}>
          Este orçamento é uma estimativa inicial e não constitui contrato.
          Valores finais podem variar conforme detalhamento do projeto
          executivo. Após aprovação, será formalizado um contrato de
          prestação de serviços.
        </Text>

        <Text style={styles.footer} fixed>
          {company.name} · {company.phone.display} ·{" "}
          {company.whatsapp.display} · {company.email}
        </Text>
      </Page>
    </Document>
  );
}
