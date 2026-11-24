import { describe, expect, it } from "vitest";
import { runTerminalCommand, type TerminalContext } from "../src/terminal";

const ctx: TerminalContext = {
  help: "Available commands: help, whoami, projects, contact, clear",
  whoami: "visitor@kelianc-portfolio",
  projects: ["parloir-blog", "bip-ai-study-coach"],
  contact: "Use the contact page form.",
  unknownCommand: "Unknown command: {cmd}. Type 'help'.",
  cleared: "__CLEAR__",
};

describe("runTerminalCommand", () => {
  it("returns help text for help", () => {
    expect(runTerminalCommand("help", ctx)).toEqual([ctx.help]);
  });
  it("is case-insensitive and trims input", () => {
    expect(runTerminalCommand("  WHOAMI ", ctx)).toEqual([ctx.whoami]);
  });
  it("lists projects", () => {
    expect(runTerminalCommand("projects", ctx)).toEqual(ctx.projects);
  });
  it("substitutes the unknown command name", () => {
    expect(runTerminalCommand("rm -rf /", ctx)).toEqual([
      "Unknown command: rm -rf /. Type 'help'.",
    ]);
  });
  it("returns nothing for empty input", () => {
    expect(runTerminalCommand("   ", ctx)).toEqual([]);
  });
  it("signals clear", () => {
    expect(runTerminalCommand("clear", ctx)).toEqual(["__CLEAR__"]);
  });
});
