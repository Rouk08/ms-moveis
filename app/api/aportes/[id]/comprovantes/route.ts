import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  ALLOWED_RECEIPT_TYPES,
  MAX_FILES_PER_UPLOAD,
  MAX_UPLOAD_SIZE_BYTES,
  aporteComprovantesDir,
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
  const aporte = await prisma.aporte.findUnique({ where: { id } });
  if (!aporte) {
    return NextResponse.json({ error: "Aporte não encontrado." }, { status: 404 });
  }

  const formData = await request.formData();
  const files = formData
    .getAll("comprovantes")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);

  if (files.length === 0) {
    return NextResponse.json(
      { error: "Selecione ao menos um arquivo." },
      { status: 400 }
    );
  }

  if (files.length > MAX_FILES_PER_UPLOAD) {
    return NextResponse.json(
      { error: `Envie no máximo ${MAX_FILES_PER_UPLOAD} arquivos por vez.` },
      { status: 400 }
    );
  }

  for (const file of files) {
    if (!ALLOWED_RECEIPT_TYPES[file.type]) {
      return NextResponse.json(
        { error: `Arquivo "${file.name}" não é aceito (use JPG, PNG, WEBP ou PDF).` },
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

  const dir = aporteComprovantesDir(id);
  await mkdir(dir, { recursive: true });

  const criados = [];
  for (const file of files) {
    const ext = ALLOWED_RECEIPT_TYPES[file.type];
    const nomeArmazenado = `${crypto.randomUUID()}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(join(dir, nomeArmazenado), buffer);

    const comprovante = await prisma.aporteComprovante.create({
      data: {
        aporteId: id,
        nomeArquivo: file.name,
        caminho: nomeArmazenado,
        contentType: file.type,
        tamanho: file.size,
      },
    });
    criados.push(comprovante);
  }

  revalidatePath(`/admin/financeiro/aportes/${id}`);

  return NextResponse.json({ count: criados.length });
}
