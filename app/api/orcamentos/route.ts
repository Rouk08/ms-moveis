import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseItensFromBody } from "@/lib/orcamento-itens";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const body = await request.json();
  const nome = String(body.nome ?? "").trim();
  const telefone = String(body.telefone ?? "").trim();
  const email = String(body.email ?? "").trim();
  const tipoProjeto = Array.isArray(body.tipoProjeto)
    ? body.tipoProjeto.map((t: unknown) => String(t).trim()).filter(Boolean)
    : [];
  const mensagem = String(body.mensagem ?? "").trim();
  const incluiProjeto = body.incluiProjeto !== false;
  const itens = parseItensFromBody(body);
  const valorEstimadoRaw = String(body.valorEstimado ?? "").trim();
  const descontoRaw = String(body.desconto ?? "").trim();

  if (!nome || !telefone || !mensagem) {
    return NextResponse.json(
      { error: "Preencha todos os campos obrigatórios." },
      { status: 400 }
    );
  }

  const orcamento = await prisma.orcamento.create({
    data: {
      nome,
      telefone,
      email: email || null,
      tipoProjeto,
      mensagem,
      incluiProjeto,
      valorEstimado: valorEstimadoRaw || null,
      desconto: descontoRaw || null,
      origem: "MANUAL",
      itens: {
        create: itens.map((i) => ({
          categoria: i.categoria,
          item: i.item,
          valorUnitario: i.valorUnitario,
          observacao: i.observacao || null,
        })),
      },
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/orcamentos");

  return NextResponse.json({ id: orcamento.id });
}
