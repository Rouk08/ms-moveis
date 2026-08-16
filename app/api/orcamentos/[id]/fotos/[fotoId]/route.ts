import { readFile, unlink } from "fs/promises";
import { join } from "path";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { orcamentoFotosDir } from "@/lib/uploads";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string; fotoId: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { id, fotoId } = await params;
  const foto = await prisma.orcamentoFoto.findUnique({ where: { id: fotoId } });

  if (!foto || foto.orcamentoId !== id) {
    return NextResponse.json({ error: "Foto não encontrada." }, { status: 404 });
  }

  try {
    const buffer = await readFile(join(orcamentoFotosDir(id), foto.caminho));
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": foto.contentType,
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
  { params }: { params: Promise<{ id: string; fotoId: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { id, fotoId } = await params;
  const foto = await prisma.orcamentoFoto.findUnique({ where: { id: fotoId } });

  if (!foto || foto.orcamentoId !== id) {
    return NextResponse.json({ error: "Foto não encontrada." }, { status: 404 });
  }

  await prisma.orcamentoFoto.delete({ where: { id: fotoId } });

  try {
    await unlink(join(orcamentoFotosDir(id), foto.caminho));
  } catch {
    // Arquivo já pode não existir no disco — o registro no banco já foi removido.
  }

  revalidatePath(`/admin/orcamentos/${id}`);

  return NextResponse.json({ success: true });
}
