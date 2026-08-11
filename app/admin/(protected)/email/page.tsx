import Link from "next/link";
import { Inbox, Send, PenSquare } from "lucide-react";
import { listMessages, resolveFolder, folderParam } from "@/lib/mail";

export default async function EmailPage({
  searchParams,
}: {
  searchParams: Promise<{ folder?: string; before?: string }>;
}) {
  const { folder: folderQuery, before } = await searchParams;
  const folder = resolveFolder(folderQuery);
  const beforeSeq = before ? Number(before) : undefined;

  const { messages, hasMore, oldestSeq } = await listMessages(folder, {
    beforeSeq,
  });

  const tabs = [
    { label: "Entrada", value: "inbox", icon: Inbox },
    { label: "Enviados", value: "enviados", icon: Send },
  ] as const;
  const activeTab = folderParam(folder);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-charcoal-800">E-mail</h1>
          <p className="text-sm text-charcoal-500">
            comercial@msmoveissobmedida.com.br
          </p>
        </div>
        <Link
          href="/admin/email/novo"
          className="inline-flex items-center gap-2 rounded-full bg-wood-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-wood-600 transition-colors"
        >
          <PenSquare size={16} />
          Novo e-mail
        </Link>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Link
              key={tab.value}
              href={
                tab.value === "inbox"
                  ? "/admin/email"
                  : `/admin/email?folder=${tab.value}`
              }
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.value
                  ? "bg-charcoal-800 text-white"
                  : "bg-white text-charcoal-600 border border-charcoal-200 hover:bg-charcoal-50"
              }`}
            >
              <Icon size={14} />
              {tab.label}
            </Link>
          );
        })}
      </div>

      <div className="rounded-2xl border border-charcoal-100 bg-white shadow-sm overflow-hidden">
        {messages.length === 0 ? (
          <p className="px-6 py-10 text-sm text-charcoal-400 text-center">
            Nenhum e-mail encontrado.
          </p>
        ) : (
          <ul className="divide-y divide-charcoal-100">
            {messages.map((message) => (
              <li key={message.uid}>
                <Link
                  href={`/admin/email/${message.uid}?folder=${activeTab}`}
                  className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-charcoal-50/60 transition-colors"
                >
                  <div className="min-w-0">
                    <p
                      className={`truncate text-sm ${
                        message.seen
                          ? "text-charcoal-600"
                          : "font-semibold text-charcoal-800"
                      }`}
                    >
                      {message.subject}
                    </p>
                    <p className="truncate text-xs text-charcoal-500">
                      {message.from}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-charcoal-400">
                    {message.date.toLocaleDateString("pt-BR")}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {hasMore && oldestSeq && (
        <div className="mt-6 flex justify-center">
          <Link
            href={`/admin/email?folder=${activeTab}&before=${oldestSeq}`}
            className="rounded-full bg-white border border-charcoal-200 px-5 py-2.5 text-sm font-medium text-charcoal-700 hover:bg-charcoal-50 transition-colors"
          >
            Carregar mais
          </Link>
        </div>
      )}
    </div>
  );
}
