import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type {
  CategoriaPagar,
  FrequenciaRecorrencia,
} from "@/lib/generated/prisma/enums";

const CATEGORIA_VALUES: CategoriaPagar[] = [
  "MATERIAL",
  "FORNECEDOR",
  "SALARIOS",
  "ALUGUEL",
  "IMPOSTOS",
  "MARKETING",
  "OUTROS",
];

const FREQUENCIA_VALUES: FrequenciaRecorrencia[] = [
  "SEMANAL",
  "MENSAL",
  "TRIMESTRAL",
  "ANUAL",
];

function proximoVencimento(
  base: Date,
  frequencia: FrequenciaRecorrencia,
  passo: number
) {
  const data = new Date(base);
  switch (frequencia) {
    case "SEMANAL":
      data.setDate(data.getDate() + passo * 7);
      break;
    case "MENSAL":
      data.setMonth(data.getMonth() + passo);
      break;
    case "TRIMESTRAL":
      data.setMonth(data.getMonth() + passo * 3);
      break;
    case "ANUAL":
      data.setFullYear(data.getFullYear() + passo);
      break;
  }
  return data;
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const body = await request.json();
  const descricao = String(body.descricao ?? "").trim();
  const fornecedor = String(body.fornecedor ?? "").trim();
  const categoriaRaw = String(body.categoria ?? "OUTROS");
  const categoria = CATEGORIA_VALUES.includes(categoriaRaw as CategoriaPagar)
    ? (categoriaRaw as CategoriaPagar)
    : "OUTROS";
  const valorRaw = String(body.valor ?? "").trim();
  const vencimentoRaw = String(body.vencimento ?? "").trim();
  const notasInternas = String(body.notasInternas ?? "").trim();
  const recorrente = Boolean(body.recorrente);
  const frequenciaRaw = String(body.frequenciaRecorrencia ?? "MENSAL");
  const frequenciaRecorrencia = FREQUENCIA_VALUES.includes(
    frequenciaRaw as FrequenciaRecorrencia
  )
    ? (frequenciaRaw as FrequenciaRecorrencia)
    : "MENSAL";
  const totalOcorrencias = recorrente
    ? Math.max(2, Math.min(60, parseInt(String(body.totalOcorrencias ?? "12"), 10) || 12))
    : 1;

  if (!descricao || !valorRaw || !vencimentoRaw) {
    return NextResponse.json(
      { error: "Preencha descrição, valor e vencimento." },
      { status: 400 }
    );
  }

  const vencimentoBase = new Date(vencimentoRaw);
  const grupoRecorrencia = recorrente ? crypto.randomUUID() : null;

  const criados = [];
  for (let i = 0; i < totalOcorrencias; i++) {
    const vencimento = recorrente
      ? proximoVencimento(vencimentoBase, frequenciaRecorrencia, i)
      : vencimentoBase;

    const registro = await prisma.contaPagar.create({
      data: {
        descricao,
        fornecedor: fornecedor || null,
        categoria,
        valor: valorRaw,
        vencimento,
        notasInternas: notasInternas || null,
        grupoRecorrencia,
        frequenciaRecorrencia: recorrente ? frequenciaRecorrencia : null,
        numeroOcorrencia: recorrente ? i + 1 : null,
        totalOcorrencias: recorrente ? totalOcorrencias : null,
      },
    });
    criados.push(registro);
  }

  revalidatePath("/admin/financeiro");
  revalidatePath("/admin/financeiro/contas-a-pagar");

  return NextResponse.json({ id: criados[0].id, count: criados.length });
}
