import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Reply, Paperclip, Download } from "lucide-react";
import { getMessage, resolveFolder, folderParam } from "@/lib/mail";

export default async function EmailDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ uid: string }>;
  searchParams: Promise<{ folder?: string }>;
}) {
  const { uid: uidParam } = await params;
  const { folder: folderQuery } = await searchParams;
  const uid = Number(uidParam);
  const folder = resolveFolder(folderQuery);
  const folderQueryValue = folderParam(folder);

  if (!Number.isFinite(uid)) notFound();

  const message = await getMessage(folder, uid);
  if (!message) notFound();

  return (
    <div className="max-w-3xl">
      <Link
        href={`/admin/email?folder=${folderQueryValue}`}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-charcoal-500 hover:text-charcoal-700 mb-6"
      >
        <ArrowLeft size={16} />
        Voltar para {folderQueryValue === "enviados" ? "enviados" : "entrada"}
      </Link>

      <div className="flex items-start justify-between mb-6 gap-4">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold text-charcoal-800 break-words">
            {message.subject}
          </h1>
          <p className="text-sm text-charcoal-500 mt-1">
            De: {message.from}
          </p>
          {message.to && (
            <p className="text-sm text-charcoal-500">Para: {message.to}</p>
          )}
          <p className="text-xs text-charcoal-400 mt-1">
            {message.date.toLocaleString("pt-BR")}
          </p>
        </div>
        <Link
          href={`/admin/email/novo?replyTo=${message.uid}&folder=${folderQueryValue}`}
          className="shrink-0 inline-flex items-center gap-2 rounded-full bg-wood-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-wood-600 transition-colors"
        >
          <Reply size={16} />
          Responder
        </Link>
      </div>

      {message.attachments.length > 0 && (
        <div className="rounded-2xl border border-charcoal-100 bg-white p-4 shadow-sm mb-6">
          <p className="text-xs font-medium uppercase tracking-wide text-charcoal-400 mb-2 flex items-center gap-1.5">
            <Paperclip size={14} />
            Anexos
          </p>
          <ul className="space-y-1.5">
            {message.attachments.map((att) => (
              <li key={att.index}>
                <a
                  href={`/api/email/attachment?folder=${folderQueryValue}&uid=${message.uid}&index=${att.index}`}
                  className="inline-flex items-center gap-2 text-sm text-wood-600 hover:text-wood-700 font-medium"
                >
                  <Download size={14} />
                  {att.filename}
                  <span className="text-charcoal-400 font-normal">
                    ({(att.size / 1024).toFixed(0)} KB)
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="rounded-2xl border border-charcoal-100 bg-white shadow-sm overflow-hidden">
        {message.html ? (
          <iframe
            title={message.subject}
            srcDoc={message.html}
            sandbox=""
            className="w-full min-h-[500px] bg-white"
          />
        ) : (
          <pre className="p-6 text-sm text-charcoal-700 whitespace-pre-wrap font-sans">
            {message.text}
          </pre>
        )}
      </div>
    </div>
  );
}
