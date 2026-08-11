import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getAttachment, resolveFolder } from "@/lib/mail";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const folder = resolveFolder(searchParams.get("folder") ?? undefined);
  const uid = Number(searchParams.get("uid"));
  const index = Number(searchParams.get("index"));

  if (!Number.isFinite(uid) || !Number.isFinite(index)) {
    return NextResponse.json({ error: "Parâmetros inválidos." }, { status: 400 });
  }

  const attachment = await getAttachment(folder, uid, index);
  if (!attachment) {
    return NextResponse.json({ error: "Anexo não encontrado." }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(attachment.content), {
    headers: {
      "Content-Type": attachment.contentType,
      "Content-Disposition": `attachment; filename="${encodeURIComponent(
        attachment.filename
      )}"`,
    },
  });
}
