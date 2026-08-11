import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type {
  CategoriaPagar,
  StatusPagamento,
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

const STATUS_VALUES: StatusPagamento[] = ["PENDENTE", "PAGO"];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  const descricao = String(body.descricao ?? "").trim();
  const fornecedor = String(body.fornecedor ?? "").trim();
  const categoriaRaw = String(body.categoria ?? "");
  const categoria = CATEGORIA_VALUES.includes(categoriaRaw as CategoriaPagar)
    ? (categoriaRaw as CategoriaPagar)
    : undefined;
  const valorRaw = String(body.valor ?? "").trim();
  const vencimentoRaw = String(body.vencimento ?? "").trim();
  const statusRaw = String(body.status ?? "");
  const status = STATUS_VALUES.includes(statusRaw as StatusPagamento)
    ? (statusRaw as StatusPagamento)
    : undefined;
  const notasInternas = String(body.notasInternas ?? "").trim();

  await prisma.contaPagar.update({
    where: { id },
    data: {
      ...(descricao ? { descricao } : {}),
      fornecedor: fornecedor || null,
      ...(categoria ? { categoria } : {}),
      ...(valorRaw ? { valor: valorRaw } : {}),
      ...(vencimentoRaw ? { vencimento: new Date(vencimentoRaw) } : {}),
      ...(status
        ? {
            status,
            dataPagamento: status === "PAGO" ? new Date() : null,
          }
        : {}),
      notasInternas: notasInternas || null,
    },
  });

  revalidatePath("/admin/financeiro");
  revalidatePath("/admin/financeiro/contas-a-pagar");
  revalidatePath(`/admin/financeiro/contas-a-pagar/${id}`);

  return NextResponse.json({ success: true });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const scope = searchParams.get("scope") === "futuras" ? "futuras" : "unica";

  const conta = await prisma.contaPagar.findUnique({ where: { id } });
  if (!conta) {
    return NextResponse.json({ error: "Conta não encontrada." }, { status: 404 });
  }
  if (conta.status === "PAGO") {
    return NextResponse.json(
      { error: "Não é possível excluir uma conta já paga." },
      { status: 400 }
    );
  }

  if (scope === "futuras" && conta.grupoRecorrencia) {
    const { count } = await prisma.contaPagar.deleteMany({
      where: {
        grupoRecorrencia: conta.grupoRecorrencia,
        status: "PENDENTE",
        vencimento: { gte: conta.vencimento },
      },
    });
    revalidatePath("/admin/financeiro");
    revalidatePath("/admin/financeiro/contas-a-pagar");
    return NextResponse.json({ success: true, count });
  }

  await prisma.contaPagar.delete({ where: { id } });

  revalidatePath("/admin/financeiro");
  revalidatePath("/admin/financeiro/contas-a-pagar");

  return NextResponse.json({ success: true, count: 1 });
}
