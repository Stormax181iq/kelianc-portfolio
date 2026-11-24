import nodemailer from "nodemailer";
import type { Config } from "../config";

export interface MailMessage {
  to: string;
  from: string;
  subject: string;
  text: string;
  replyTo?: string;
}

export interface Mailer {
  readonly kind: string;
  send(msg: MailMessage): Promise<void>;
}

function createSmtpMailer(cfg: Config): Mailer | null {
  if (!cfg.SMTP_HOST) return null;
  const transport = nodemailer.createTransport({
    host: cfg.SMTP_HOST,
    port: cfg.SMTP_PORT,
    secure: cfg.SMTP_SECURE,
    auth: cfg.SMTP_USER ? { user: cfg.SMTP_USER, pass: cfg.SMTP_PASS ?? "" } : undefined,
  });
  return {
    kind: "smtp",
    async send(msg) {
      await transport.sendMail({
        from: msg.from,
        to: msg.to,
        subject: msg.subject,
        text: msg.text,
        replyTo: msg.replyTo,
      });
    },
  };
}

function createResendMailer(cfg: Config): Mailer | null {
  if (!cfg.RESEND_API_KEY || !cfg.RESEND_FROM) return null;
  return {
    kind: "resend",
    async send(msg) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${cfg.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: msg.from,
          to: [msg.to],
          subject: msg.subject,
          text: msg.text,
          reply_to: msg.replyTo,
        }),
      });
      if (!res.ok) {
        throw new Error(`Resend API responded ${res.status}: ${await res.text()}`);
      }
    },
  };
}

/** Self-hosted SMTP first (user's own mail server), transactional API as fallback. */
export function createMailer(cfg: Config): Mailer | null {
  return createSmtpMailer(cfg) ?? createResendMailer(cfg);
}
