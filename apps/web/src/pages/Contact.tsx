import { useState, type FormEvent } from "react";
import { useContent } from "../i18n/ContentContext";
import { api } from "../api/client";

type Status = "idle" | "sending" | "success" | "error";

export default function Contact() {
  const { t, settings } = useContent();
  const page = t<Record<string, string>>("contact.page");
  const [status, setStatus] = useState<Status>("idle");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    try {
      await api.contact({
        name: data.get("name"),
        email: data.get("email"),
        message: data.get("message"),
        website: data.get("website") ?? "", // honeypot
      });
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="page narrow">
      <h1>{page.title}</h1>
      <p className="lead">{page.intro}</p>
      <form className="contact-form" onSubmit={onSubmit}>
        <label>
          {page.nameLabel}
          <input type="text" name="name" required minLength={2} maxLength={120} autoComplete="name" />
        </label>
        <label>
          {page.emailLabel}
          <input type="email" name="email" required maxLength={254} autoComplete="email" />
        </label>
        <label>
          {page.messageLabel}
          <textarea name="message" required minLength={10} maxLength={5000} rows={6} />
        </label>
        {/* Honeypot: hidden from humans, filled by bots. Never remove. */}
        <label className="visually-hidden" aria-hidden="true">
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
        <button className="button button-primary" type="submit" disabled={status === "sending"}>
          {status === "sending" ? page.sending : page.submit}
        </button>
        {status === "success" && <p className="form-success" role="status">{page.success}</p>}
        {status === "error" && <p className="form-error" role="alert">{page.error}</p>}
        <p className="muted">{page.note}</p>
      </form>
      {settings && (
        <div className="socials">
          <a className="chip" href={settings.githubUrl} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a className="chip" href={settings.linkedinUrl} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        </div>
      )}
    </div>
  );
}
