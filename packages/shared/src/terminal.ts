/**
 * Pure engine for the terminal easter egg. Kept free of React/DOM so it is
 * unit-testable; the web app feeds it strings fetched from the DB.
 */
export interface TerminalContext {
  help: string;
  whoami: string;
  projects: string[];
  contact: string;
  unknownCommand: string;
  cleared: string;
}

export const TERMINAL_COMMANDS = ["help", "whoami", "projects", "contact", "clear"] as const;

export function runTerminalCommand(rawInput: string, ctx: TerminalContext): string[] {
  const input = rawInput.trim().toLowerCase();
  if (input === "") return [];
  switch (input) {
    case "help":
      return [ctx.help];
    case "whoami":
      return [ctx.whoami];
    case "projects":
      return ctx.projects.length > 0 ? ctx.projects : [ctx.unknownCommand];
    case "contact":
      return [ctx.contact];
    case "clear":
      return [ctx.cleared];
    default:
      return [ctx.unknownCommand.replace("{cmd}", input)];
  }
}
