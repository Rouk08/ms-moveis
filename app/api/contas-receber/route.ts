import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const body = await request.json();
  const cliente = String(body.cliente ?? "").trim();
  const telefone = String(body.telefone ?? "").trim();
  const email = String(body.email ?? "").trim();
  const valorRaw = String(body.valor ?? "").trim();
  const vencimentoRaw = String(body.vencimento ?? "").trim();
  const totalParcelas = Math.max(
    1,
    Math.min(24, parseInt(String(body.totalParcelas ?? "1"), 10) || 1)
  );
  const notasInternas = String(body.notasInternas ?? "").trim();
  const orcamentoId = String(body.orcamentoId ?? "").trim() || null;

  const valorTotal = Number(valorRaw.replace(",", "."));

  if (!cliente || !vencimentoRaw || !valorRaw || Number.isNaN(valorTotal)) {
    return NextResponse.json(
      { error: "Preencha cliente, valor e vencimento." },
      { status: 400 }
    );
  }

  const vencimentoBase = new Date(vencimentoRaw);
  const grupoParcelamento =
    totalParcelas > 1 ? crypto.randomUUID() : null;

  const valorParcela = Math.floor((valorTotal / totalParcelas) * 100) / 100;
  let somaParcelas = 0;

  const criados = [];
  for (let i = 0; i < totalParcelas; i++) {
    const isLast = i === totalParcelas - 1;
    const valor = isLast
      ? Math.round((valorTotal - somaParcelas) * 100) / 100
      : valorParcela;
    somaParcelas += valor;

    const vencimento = new Date(vencimentoBase);
    vencimento.setMonth(vencimento.getMonth() + i);

    const registro = await prisma.contaReceber.create({
      data: {
        cliente,
        telefone: telefone || null,
        email: email || null,
        valor: valor.toFixed(2),
        vencimento,
        parcela: i + 1,
        totalParcelas,
        grupoParcelamento,
        notasInternas: notasInternas || null,
        orcamentoId,
      },
    });
    criados.push(registro);
  }

  revalidatePath("/admin/financeiro");
  revalidatePath("/admin/financeiro/contas-a-receber");

  return NextResponse.json({
    id: criados[0].id,
    count: criados.length,
  });
}
