"use client";

import { useState, type FormEvent } from "react";

type EmailComposeFormProps = {
  to?: string;
  subject?: string;
  quotedText?: string;
  replyToUid?: number;
  replyFolder?: "inbox" | "enviados";
};

export default function EmailComposeForm({
  to,
  subject,
  quotedText,
  replyToUid,
  replyFolder,
}: EmailComposeFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setPending(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      to: String(formData.get("to") ?? "").trim(),
      subject: String(formData.get("subject") ?? "").trim(),
      text: String(formData.get("text") ?? "").trim(),
      replyToUid: replyToUid ? String(replyToUid) : "",
      replyFolder: replyFolder ?? "",
    };

    try {
      const res = await fetch("/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Não foi possível enviar o e-mail.");
        setPending(false);
        return;
      }

      window.location.href = "/admin/email?folder=enviados";
    } catch {
      setError("Não foi possível enviar o e-mail. Tente novamente.");
      setPending(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-charcoal-100 bg-white p-6 shadow-sm space-y-5"
    >
      <div>
        <label
          htmlFor="to"
          className="block text-sm font-medium text-charcoal-700 mb-1.5"
        >
          Para *
        </label>
        <input
          id="to"
          name="to"
          type="email"
          required
          defaultValue={to}
          className="w-full rounded-lg border border-charcoal-200 px-4 py-2.5 text-charcoal-800 focus:border-wood-500 focus:outline-none focus:ring-2 focus:ring-wood-200"
        />
      </div>

      <div>
        <label
          htmlFor="subject"
          className="block text-sm font-medium text-charcoal-700 mb-1.5"
        >
          Assunto *
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          required
          defaultValue={subject}
          className="w-full rounded-lg border border-charcoal-200 px-4 py-2.5 text-charcoal-800 focus:border-wood-500 focus:outline-none focus:ring-2 focus:ring-wood-200"
        />
      </div>

      <div>
        <label
          htmlFor="text"
          className="block text-sm font-medium text-charcoal-700 mb-1.5"
        >
          Mensagem *
        </label>
        <textarea
          id="text"
          name="text"
          rows={12}
          required
          defaultValue={quotedText}
          className="w-full rounded-lg border border-charcoal-200 px-4 py-2.5 text-charcoal-800 focus:border-wood-500 focus:outline-none focus:ring-2 focus:ring-wood-200"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-wood-500 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-wood-600 disabled:opacity-60 transition-colors"
      >
        {pending ? "Enviando..." : "Enviar e-mail"}
      </button>
    </form>
  );
}
