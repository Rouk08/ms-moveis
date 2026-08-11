import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Apenas administradores podem gerenciar usuários." },
      { status: 403 }
    );
  }

  const { id } = await params;
  const body = await request.json();
  const active = Boolean(body.active);

  await prisma.user.update({
    where: { id },
    data: { active },
  });

  revalidatePath("/admin/usuarios");

  return NextResponse.json({ success: true });
}
