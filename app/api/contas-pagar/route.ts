import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { CategoriaPagar } from "@/lib/generated/prisma/enums";

const CATEGORIA_VALUES: CategoriaPagar[] = [
  "MATERIAL",
  "FORNECEDOR",
  "SALARIOS",
  "ALUGUEL",
  "IMPOSTOS",
  "MARKETING",
  "OUTROS",
];

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

  if (!descricao || !valorRaw || !vencimentoRaw) {
    return NextResponse.json(
      { error: "Preencha descrição, valor e vencimento." },
      { status: 400 }
    );
  }

  const contaPagar = await prisma.contaPagar.create({
    data: {
      descricao,
      fornecedor: fornecedor || null,
      categoria,
      valor: valorRaw,
      vencimento: new Date(vencimentoRaw),
      notasInternas: notasInternas || null,
    },
  });

  revalidatePath("/admin/financeiro");
  revalidatePath("/admin/financeiro/contas-a-pagar");

  return NextResponse.json({ id: contaPagar.id });
}
