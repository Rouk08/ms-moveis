"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Role } from "@/lib/generated/prisma/enums";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Apenas administradores podem gerenciar usuários.");
  }
  return session;
}

export type CreateUsuarioState = { error?: string } | undefined;

export async function createUsuario(
  _prevState: CreateUsuarioState,
  formData: FormData
): Promise<CreateUsuarioState> {
  await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  const roleRaw = String(formData.get("role") ?? "MEMBER");
  const role: Role = roleRaw === "ADMIN" ? "ADMIN" : "MEMBER";

  if (!name || !email || password.length < 8) {
    return {
      error:
        "Preencha nome, e-mail e uma senha com pelo menos 8 caracteres.",
    };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "Já existe um usuário com esse e-mail." };
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: { name, email, passwordHash, role },
  });

  revalidatePath("/admin/usuarios");
}

export async function setUsuarioActive(id: string, active: boolean) {
  await requireAdmin();

  await prisma.user.update({
    where: { id },
    data: { active },
  });

  revalidatePath("/admin/usuarios");
}
