import { ImapFlow } from "imapflow";
import nodemailer from "nodemailer";
import MailComposer from "nodemailer/lib/mail-composer";
import { simpleParser } from "mailparser";

export const INBOX_FOLDER = "INBOX";
export const SENT_FOLDER = "Sent";

export type MailFolder = typeof INBOX_FOLDER | typeof SENT_FOLDER;

export function resolveFolder(param: string | undefined): MailFolder {
  return param === "enviados" ? SENT_FOLDER : INBOX_FOLDER;
}

export function folderParam(folder: MailFolder): "inbox" | "enviados" {
  return folder === SENT_FOLDER ? "enviados" : "inbox";
}

const PAGE_SIZE = 20;

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Variável de ambiente ${name} não configurada. Adicione as credenciais de e-mail no .env do servidor.`
    );
  }
  return value;
}

function imapConfig() {
  return {
    host: requiredEnv("IMAP_HOST"),
    port: Number(process.env.IMAP_PORT ?? 993),
    secure: true,
    auth: {
      user: requiredEnv("IMAP_USER"),
      pass: requiredEnv("IMAP_PASSWORD"),
    },
    logger: false as const,
  };
}

async function withImap<T>(fn: (client: ImapFlow) => Promise<T>): Promise<T> {
  const client = new ImapFlow(imapConfig());
  await client.connect();
  try {
    return await fn(client);
  } finally {
    await client.logout();
  }
}

export type EmailSummary = {
  uid: number;
  subject: string;
  from: string;
  date: Date;
  seen: boolean;
};

export async function listMessages(
  folder: MailFolder,
  { beforeSeq }: { beforeSeq?: number } = {}
): Promise<{ messages: EmailSummary[]; hasMore: boolean; oldestSeq: number | null }> {
  return withImap(async (client) => {
    const lock = await client.getMailboxLock(folder);
    try {
      const mailbox = client.mailbox;
      const exists = mailbox ? mailbox.exists : 0;
      if (exists === 0) {
        return { messages: [], hasMore: false, oldestSeq: null };
      }

      const end = beforeSeq ? beforeSeq - 1 : exists;
      if (end < 1) {
        return { messages: [], hasMore: false, oldestSeq: null };
      }
      const start = Math.max(1, end - PAGE_SIZE + 1);

      const messages: EmailSummary[] = [];
      for await (const msg of client.fetch(`${start}:${end}`, {
        envelope: true,
        uid: true,
        flags: true,
      })) {
        const sender = msg.envelope?.from?.[0];
        messages.push({
          uid: msg.uid,
          subject: msg.envelope?.subject || "(sem assunto)",
          from: sender
            ? `${sender.name ? `${sender.name} ` : ""}<${sender.address}>`
            : "—",
          date: msg.envelope?.date ? new Date(msg.envelope.date) : new Date(0),
          seen: msg.flags?.has("\\Seen") ?? false,
        });
      }
      messages.reverse();

      return { messages, hasMore: start > 1, oldestSeq: start };
    } finally {
      lock.release();
    }
  });
}

export type EmailAttachmentMeta = {
  index: number;
  filename: string;
  contentType: string;
  size: number;
};

export type EmailDetail = {
  uid: number;
  subject: string;
  from: string;
  to: string;
  date: Date;
  text: string;
  html: string | null;
  messageId: string | null;
  references: string | null;
  attachments: EmailAttachmentMeta[];
};

export async function getMessage(
  folder: MailFolder,
  uid: number
): Promise<EmailDetail | null> {
  return withImap(async (client) => {
    const lock = await client.getMailboxLock(folder);
    try {
      let raw: Buffer | null = null;
      for await (const msg of client.fetch(uid, { source: true }, { uid: true })) {
        raw = msg.source ?? null;
      }
      if (!raw) return null;

      const parsed = await simpleParser(raw);

      await client.messageFlagsAdd(uid, ["\\Seen"], { uid: true });

      const to = parsed.to
        ? Array.isArray(parsed.to)
          ? parsed.to.map((a) => a.text).join(", ")
          : parsed.to.text
        : "";

      const references = parsed.references
        ? Array.isArray(parsed.references)
          ? parsed.references.join(" ")
          : parsed.references
        : null;

      return {
        uid,
        subject: parsed.subject || "(sem assunto)",
        from: parsed.from?.text || "—",
        to,
        date: parsed.date ?? new Date(0),
        text: parsed.text || "",
        html: typeof parsed.html === "string" ? parsed.html : null,
        messageId: parsed.messageId || null,
        references,
        attachments: parsed.attachments.map((att, index) => ({
          index,
          filename: att.filename || `anexo-${index + 1}`,
          contentType: att.contentType,
          size: att.size,
        })),
      };
    } finally {
      lock.release();
    }
  });
}

export async function getAttachment(
  folder: MailFolder,
  uid: number,
  index: number
): Promise<{ filename: string; contentType: string; content: Buffer } | null> {
  return withImap(async (client) => {
    const lock = await client.getMailboxLock(folder);
    try {
      let raw: Buffer | null = null;
      for await (const msg of client.fetch(uid, { source: true }, { uid: true })) {
        raw = msg.source ?? null;
      }
      if (!raw) return null;

      const parsed = await simpleParser(raw);
      const attachment = parsed.attachments[index];
      if (!attachment) return null;

      return {
        filename: attachment.filename || `anexo-${index + 1}`,
        contentType: attachment.contentType,
        content: attachment.content,
      };
    } finally {
      lock.release();
    }
  });
}

export async function sendMessage({
  to,
  subject,
  text,
  replyToUid,
  replyFolder,
}: {
  to: string;
  subject: string;
  text: string;
  replyToUid?: number;
  replyFolder?: MailFolder;
}): Promise<void> {
  let inReplyTo: string | undefined;
  let references: string | undefined;

  if (replyToUid && replyFolder) {
    const original = await getMessage(replyFolder, replyToUid);
    if (original?.messageId) {
      inReplyTo = original.messageId;
      references = original.references
        ? `${original.references} ${original.messageId}`
        : original.messageId;
    }
  }

  const smtpUser = requiredEnv("SMTP_USER");

  const composer = new MailComposer({
    from: smtpUser,
    to,
    subject,
    text,
    inReplyTo,
    references,
  });

  const message: Buffer = await new Promise((resolve, reject) => {
    composer.compile().build((err, msg) => {
      if (err) reject(err);
      else resolve(msg);
    });
  });

  const transporter = nodemailer.createTransport({
    host: requiredEnv("SMTP_HOST"),
    port: Number(process.env.SMTP_PORT ?? 465),
    secure: Number(process.env.SMTP_PORT ?? 465) === 465,
    auth: {
      user: smtpUser,
      pass: requiredEnv("SMTP_PASSWORD"),
    },
  });

  await transporter.sendMail({
    raw: message,
    envelope: { from: smtpUser, to },
  });

  await withImap(async (client) => {
    await client.append(SENT_FOLDER, message, ["\\Seen"]);
  });
}
