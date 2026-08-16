import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  ALLOWED_IMAGE_TYPES,
  MAX_FILES_PER_UPLOAD,
  MAX_UPLOAD_SIZE_BYTES,
  orcamentoFotosDir,
} from "@/lib/uploads";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { id } = await params;
  const orcamento = await prisma.orcamento.findUnique({ where: { id } });
  if (!orcamento) {
    return NextResponse.json(
      { error: "Orçamento não encontrado." },
      { status: 404 }
    );
  }

  const formData = await request.formData();
  const files = formData
    .getAll("fotos")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);

  if (files.length === 0) {
    return NextResponse.json(
      { error: "Selecione ao menos uma foto." },
      { status: 400 }
    );
  }

  if (files.length > MAX_FILES_PER_UPLOAD) {
    return NextResponse.json(
      { error: `Envie no máximo ${MAX_FILES_PER_UPLOAD} fotos por vez.` },
      { status: 400 }
    );
  }

  for (const file of files) {
    if (!ALLOWED_IMAGE_TYPES[file.type]) {
      return NextResponse.json(
        { error: `Arquivo "${file.name}" não é uma imagem aceita (JPG, PNG ou WEBP).` },
        { status: 400 }
      );
    }
    if (file.size > MAX_UPLOAD_SIZE_BYTES) {
      return NextResponse.json(
        { error: `Arquivo "${file.name}" passa de 8MB.` },
        { status: 400 }
      );
    }
  }

  const dir = orcamentoFotosDir(id);
  await mkdir(dir, { recursive: true });

  const criadas = [];
  for (const file of files) {
    const ext = ALLOWED_IMAGE_TYPES[file.type];
    const nomeArmazenado = `${crypto.randomUUID()}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(join(dir, nomeArmazenado), buffer);

    const foto = await prisma.orcamentoFoto.create({
      data: {
        orcamentoId: id,
        nomeArquivo: file.name,
        caminho: nomeArmazenado,
        contentType: file.type,
        tamanho: file.size,
      },
    });
    criadas.push(foto);
  }

  revalidatePath(`/admin/orcamentos/${id}`);

  return NextResponse.json({ count: criadas.length });
}
