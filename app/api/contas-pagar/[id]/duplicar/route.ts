import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Duplica uma conta avulsa — útil quando há mais de uma conta igual no
// mês (ex: duas notas do mesmo fornecedor). A cópia nunca entra no
// grupo de recorrência original, pra não embolar a numeração nem ser
// apagada junto se alguém cancelar "esta e as futuras" da original.
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { id } = await params;
  const conta = await prisma.contaPagar.findUnique({ where: { id } });
  if (!conta) {
    return NextResponse.json({ error: "Conta não encontrada." }, { status: 404 });
  }

  const copia = await prisma.contaPagar.create({
    data: {
      descricao: conta.descricao,
      fornecedor: conta.fornecedor,
      categoria: conta.categoria,
      valor: conta.valor,
      vencimento: conta.vencimento,
      notasInternas: conta.notasInternas,
    },
  });

  revalidatePath("/admin/financeiro");
  revalidatePath("/admin/financeiro/contas-a-pagar");

  return NextResponse.json({ id: copia.id });
}
