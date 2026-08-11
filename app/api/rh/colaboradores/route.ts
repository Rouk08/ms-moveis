import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function gerarPin(): string {
  return String(Math.floor(1000 + Math.random() * 9000));
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Apenas administradores podem gerenciar o RH." },
      { status: 403 }
    );
  }

  const body = await request.json();
  const nome = String(body.nome ?? "").trim();
  const cpf = String(body.cpf ?? "").replace(/\D/g, "");
  const cargo = String(body.cargo ?? "").trim();
  const telefone = String(body.telefone ?? "").trim();
  const email = String(body.email ?? "").trim();
  const dataAdmissaoRaw = String(body.dataAdmissao ?? "").trim();
  const salarioRaw = String(body.salario ?? "").trim();
  const notasInternas = String(body.notasInternas ?? "").trim();

  if (!nome || cpf.length !== 11 || !cargo || !dataAdmissaoRaw) {
    return NextResponse.json(
      { error: "Preencha nome, CPF (11 dígitos), cargo e data de admissão." },
      { status: 400 }
    );
  }

  const existente = await prisma.colaborador.findUnique({ where: { cpf } });
  if (existente) {
    return NextResponse.json(
      { error: "Já existe um colaborador com esse CPF." },
      { status: 409 }
    );
  }

  const pin = gerarPin();
  const pinHash = await bcrypt.hash(pin, 10);

  const colaborador = await prisma.colaborador.create({
    data: {
      nome,
      cpf,
      cargo,
      telefone: telefone || null,
      email: email || null,
      dataAdmissao: new Date(dataAdmissaoRaw),
      salario: salarioRaw || null,
      pinHash,
      notasInternas: notasInternas || null,
    },
  });

  revalidatePath("/admin/rh");
  revalidatePath("/admin/rh/colaboradores");

  return NextResponse.json({ id: colaborador.id, pin });
}
