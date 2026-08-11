import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { sendMessage, resolveFolder } from "@/lib/mail";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const body = await request.json();
  const to = String(body.to ?? "").trim();
  const subject = String(body.subject ?? "").trim();
  const text = String(body.text ?? "").trim();
  const replyToUidRaw = String(body.replyToUid ?? "").trim();
  const replyToUid = replyToUidRaw ? Number(replyToUidRaw) : undefined;
  const replyFolder = replyToUid
    ? resolveFolder(String(body.replyFolder ?? ""))
    : undefined;

  if (!to || !subject || !text) {
    return NextResponse.json(
      { error: "Preencha destinatário, assunto e mensagem." },
      { status: 400 }
    );
  }

  try {
    await sendMessage({ to, subject, text, replyToUid, replyFolder });
  } catch {
    return NextResponse.json(
      { error: "Não foi possível enviar o e-mail. Tente novamente." },
      { status: 502 }
    );
  }

  revalidatePath("/admin/email");

  return NextResponse.json({ success: true });
}
