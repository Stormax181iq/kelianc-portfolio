import { useEffect, useRef, useState } from "react";
import { runTerminalCommand, type TerminalContext } from "@kelianc/shared";
import { useContent } from "../i18n/ContentContext";
import { api, type ProjectSummaryDto } from "../api/client";

/**
 * Small interactive fake terminal (easter egg). Optional and discoverable:
 * every command has an equivalent real page, so it is never the only path to content.
 */
export default function TerminalEgg() {
  const { t, locale } = useContent();
  const term = t<Record<string, string>>("terminal");
  const nav = t<Record<string, string>>("nav");
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<string[]>([]);
  const [projects, setProjects] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      api.projects(locale).then((r) => setProjects(r.projects.map((p: ProjectSummaryDto) => p.title))).catch(() => {});
      setLines([term.welcome ?? ""]);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open, locale, term.welcome]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const run = (raw: string) => {
    const ctx: TerminalContext = {
      help: term.help ?? "",
      whoami: term.whoami ?? "",
      projects,
      contact: term.contact ?? "",
      unknownCommand: term.unknownCommand ?? "Unknown command: {cmd}",
      cleared: term.cleared ?? "",
    };
    const out = runTerminalCommand(raw, ctx);
    setLines((prev) => (out[0] === ctx.cleared ? [] : [...prev, `"$ ${raw}`, ...out]));
  };

  return (
    <>
      <button ref={triggerRef} className="terminal-trigger" onClick={() => setOpen(true)} aria-haspopup="dialog">
        {">_"} {nav.openTerminal}
      </button>
      {open && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="Terminal"
          className="terminal-dialog"
        >
          <div className="terminal-lines" aria-live="polite">
            {lines.map((l, i) => (
              <div key={i} className="terminal-line">
                {l}
              </div>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const input = inputRef.current;
              if (!input) return;
              run(input.value);
              input.value = "";
            }}
          >
            <label className="visually-hidden" htmlFor="terminal-input">
              Terminal command
            </label>
            <span aria-hidden="true">{term.prompt ?? "$"}</span>
            <input
              id="terminal-input"
              ref={inputRef}
              type="text"
              autoComplete="off"
              spellCheck={false}
            />
          </form>
        </div>
      )}
    </>
  );
}
