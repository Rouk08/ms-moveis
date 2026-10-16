import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Duplica uma conta avulsa — útil quando há mais de uma conta igual no
// mês (ex: dois recebimentos do mesmo cliente). A cópia sai sempre como
// parcela única (1/1), fora do grupo de parcelamento original, pra não
// embolar a numeração das parcelas de verdade.
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { id } = await params;
  const conta = await prisma.contaReceber.findUnique({ where: { id } });
  if (!conta) {
    return NextResponse.json({ error: "Conta não encontrada." }, { status: 404 });
  }

  const copia = await prisma.contaReceber.create({
    data: {
      cliente: conta.cliente,
      telefone: conta.telefone,
      email: conta.email,
      valor: conta.valor,
      vencimento: conta.vencimento,
      notasInternas: conta.notasInternas,
      orcamentoId: conta.orcamentoId,
    },
  });

  revalidatePath("/admin/financeiro");
  revalidatePath("/admin/financeiro/contas-a-receber");

  return NextResponse.json({ id: copia.id });
}
