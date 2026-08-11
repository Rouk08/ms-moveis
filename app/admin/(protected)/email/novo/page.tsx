import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getMessage, resolveFolder } from "@/lib/mail";
import EmailComposeForm from "@/components/admin/EmailComposeForm";

function extractAddress(from: string): string {
  const match = from.match(/<([^>]+)>/);
  return match ? match[1] : from;
}

function quote(text: string): string {
  return text
    .split("\n")
    .map((line) => `> ${line}`)
    .join("\n");
}

export default async function NovoEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ replyTo?: string; folder?: string }>;
}) {
  const { replyTo, folder: folderQuery } = await searchParams;

  let to = "";
  let subject = "";
  let quotedText = "";
  let replyToUid: number | undefined;
  let replyFolder: "inbox" | "enviados" | undefined;

  if (replyTo) {
    const uid = Number(replyTo);
    const folder = resolveFolder(folderQuery);
    const original = Number.isFinite(uid)
      ? await getMessage(folder, uid)
      : null;

    if (original) {
      to = extractAddress(original.from);
      subject = original.subject.toLowerCase().startsWith("re:")
        ? original.subject
        : `Re: ${original.subject}`;
      quotedText = `\n\nEm ${original.date.toLocaleString("pt-BR")}, ${
        original.from
      } escreveu:\n${quote(original.text)}`;
      replyToUid = original.uid;
      replyFolder = folderQuery === "enviados" ? "enviados" : "inbox";
    }
  }

  return (
    <div className="max-w-xl">
      <Link
        href="/admin/email"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-charcoal-500 hover:text-charcoal-700 mb-6"
      >
        <ArrowLeft size={16} />
        Voltar para e-mail
      </Link>

      <h1 className="text-2xl font-semibold text-charcoal-800 mb-1">
        {replyToUid ? "Responder e-mail" : "Novo e-mail"}
      </h1>
      <p className="text-sm text-charcoal-500 mb-6">
        Enviado por comercial@msmoveissobmedida.com.br
      </p>

      <EmailComposeForm
        to={to}
        subject={subject}
        quotedText={quotedText}
        replyToUid={replyToUid}
        replyFolder={replyFolder}
      />
    </div>
  );
}
