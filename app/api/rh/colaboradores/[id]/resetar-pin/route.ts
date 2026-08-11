import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function gerarPin(): string {
  return String(Math.floor(1000 + Math.random() * 9000));
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Apenas administradores podem gerenciar o RH." },
      { status: 403 }
    );
  }

  const { id } = await params;

  const pin = gerarPin();
  const pinHash = await bcrypt.hash(pin, 10);

  await prisma.colaborador.update({
    where: { id },
    data: { pinHash },
  });

  return NextResponse.json({ pin });
}
