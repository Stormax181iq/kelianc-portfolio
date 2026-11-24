import { contactFormSchema } from "@kelianc/shared";
import type { ContactRepository } from "../repositories/types";
import type { Mailer } from "./mailer.service";

export interface ContactMeta {
  ip?: string;
  userAgent?: string;
}

export type ContactResult = { accepted: true; spam: boolean };

export interface ContactServiceDeps {
  repo: ContactRepository;
  mailer: Mailer | null;
  contactTo: string | null;
  fromAddress: string;
}

export function createContactService(deps: ContactServiceDeps) {
  return {
    async submit(raw: unknown, meta: ContactMeta = {}): Promise<ContactResult> {
      const parsed = contactFormSchema.parse(raw);
      // Honeypot: bots fill the hidden field. Acknowledge silently so they learn nothing.
      if (parsed.website.trim() !== "") {
        return { accepted: true, spam: true };
      }
      const { id } = await deps.repo.create({
        name: parsed.name,
        email: parsed.email,
        message: parsed.message,
        ip: meta.ip,
        userAgent: meta.userAgent,
      });
      if (deps.mailer && deps.contactTo) {
        try {
          await deps.mailer.send({
            to: deps.contactTo,
            from: deps.fromAddress,
            subject: `[portfolio] New message from ${parsed.name}`,
            text: [
              `Name: ${parsed.name}`,
              `Email: ${parsed.email}`,
              "",
              parsed.message,
              "",
              `---`,
              `IP: ${meta.ip ?? "unknown"}`,
              `User-Agent: ${meta.userAgent ?? "unknown"}`,
            ].join("\n"),
            replyTo: parsed.email,
          });
          await deps.repo.markDelivered(id);
        } catch (err) {
          // Message is stored in the DB even if delivery fails; never leak this to the client.
          console.error("Contact delivery failed:", (err as Error).message);
        }
      } else {
        console.warn("No mailer configured or CONTACT_TO missing; message stored but not delivered.");
      }
      return { accepted: true, spam: false };
    },
  };
}
