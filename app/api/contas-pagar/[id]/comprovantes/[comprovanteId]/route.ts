import { readFile, unlink } from "fs/promises";
import { join } from "path";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { contaPagarComprovantesDir } from "@/lib/uploads";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string; comprovanteId: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { id, comprovanteId } = await params;
  const comprovante = await prisma.contaPagarComprovante.findUnique({
    where: { id: comprovanteId },
  });

  if (!comprovante || comprovante.contaPagarId !== id) {
    return NextResponse.json({ error: "Comprovante não encontrado." }, { status: 404 });
  }

  try {
    const buffer = await readFile(
      join(contaPagarComprovantesDir(id), comprovante.caminho)
    );
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": comprovante.contentType,
        "Cache-Control": "private, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Arquivo não encontrado no servidor." },
      { status: 404 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; comprovanteId: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { id, comprovanteId } = await params;
  const comprovante = await prisma.contaPagarComprovante.findUnique({
    where: { id: comprovanteId },
  });

  if (!comprovante || comprovante.contaPagarId !== id) {
    return NextResponse.json({ error: "Comprovante não encontrado." }, { status: 404 });
  }

  await prisma.contaPagarComprovante.delete({ where: { id: comprovanteId } });

  try {
    await unlink(join(contaPagarComprovantesDir(id), comprovante.caminho));
  } catch {
    // Arquivo já pode não existir no disco — o registro no banco já foi removido.
  }

  revalidatePath(`/admin/financeiro/contas-a-pagar/${id}`);

  return NextResponse.json({ success: true });
}
