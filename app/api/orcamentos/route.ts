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
  const nome = String(body.nome ?? "").trim();
  const telefone = String(body.telefone ?? "").trim();
  const email = String(body.email ?? "").trim();
  const tipoProjeto = String(body.tipoProjeto ?? "").trim();
  const mensagem = String(body.mensagem ?? "").trim();

  if (!nome || !telefone || !email || !mensagem) {
    return NextResponse.json(
      { error: "Preencha todos os campos obrigatórios." },
      { status: 400 }
    );
  }

  const orcamento = await prisma.orcamento.create({
    data: { nome, telefone, email, tipoProjeto, mensagem, origem: "MANUAL" },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/orcamentos");

  return NextResponse.json({ id: orcamento.id });
}
