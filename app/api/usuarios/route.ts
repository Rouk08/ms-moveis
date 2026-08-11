import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Role } from "@/lib/generated/prisma/enums";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Apenas administradores podem gerenciar usuários." },
      { status: 403 }
    );
  }

  const body = await request.json();
  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "")
    .trim()
    .toLowerCase();
  const password = String(body.password ?? "");
  const roleRaw = String(body.role ?? "MEMBER");
  const role: Role = roleRaw === "ADMIN" ? "ADMIN" : "MEMBER";

  if (!name || !email || password.length < 8) {
    return NextResponse.json(
      { error: "Preencha nome, e-mail e uma senha com pelo menos 8 caracteres." },
      { status: 400 }
    );
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "Já existe um usuário com esse e-mail." },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: { name, email, passwordHash, role },
  });

  revalidatePath("/admin/usuarios");

  return NextResponse.json({ success: true });
}
