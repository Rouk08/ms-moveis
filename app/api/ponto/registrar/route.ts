import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { checkPontoRateLimit } from "@/lib/ponto-rate-limit";

const ERRO_GENERICO = "CPF ou PIN incorretos.";

export async function POST(request: Request) {
  const body = await request.json();
  const cpf = String(body.cpf ?? "").replace(/\D/g, "");
  const pin = String(body.pin ?? "").trim();

  if (cpf.length !== 11 || pin.length !== 4) {
    return NextResponse.json({ error: ERRO_GENERICO }, { status: 400 });
  }

  if (!checkPontoRateLimit(cpf)) {
    return NextResponse.json(
      { error: "Muitas tentativas. Aguarde alguns minutos e tente de novo." },
      { status: 429 }
    );
  }

  const colaborador = await prisma.colaborador.findUnique({
    where: { cpf },
  });

  if (!colaborador || colaborador.dataDemissao) {
    return NextResponse.json({ error: ERRO_GENERICO }, { status: 401 });
  }

  const pinValido = await bcrypt.compare(pin, colaborador.pinHash);
  if (!pinValido) {
    return NextResponse.json({ error: ERRO_GENERICO }, { status: 401 });
  }

  const inicioHoje = new Date();
  inicioHoje.setHours(0, 0, 0, 0);

  const ultimoPontoHoje = await prisma.ponto.findFirst({
    where: { colaboradorId: colaborador.id, dataHora: { gte: inicioHoje } },
    orderBy: { dataHora: "desc" },
  });

  const tipo = ultimoPontoHoje?.tipo === "ENTRADA" ? "SAIDA" : "ENTRADA";

  const registro = await prisma.ponto.create({
    data: { colaboradorId: colaborador.id, tipo },
  });

  revalidatePath("/admin/rh/ponto");

  return NextResponse.json({
    nome: colaborador.nome,
    tipo,
    hora: registro.dataHora.toISOString(),
  });
}
