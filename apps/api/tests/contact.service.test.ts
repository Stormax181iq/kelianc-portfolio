import { describe, expect, it, vi } from "vitest";
import { createContactService } from "../src/services/contact.service";
import type { ContactRepository } from "../src/repositories/types";
import type { Mailer } from "../src/services/mailer.service";

function fakeRepo(): ContactRepository & { created: unknown[]; delivered: number[] } {
  const created: unknown[] = [];
  const delivered: number[] = [];
  return {
    created,
    delivered,
    async create(msg) {
      created.push(msg);
      return { id: created.length };
    },
    async markDelivered(id) {
      delivered.push(id);
    },
  };
}

const valid = { name: "Jane Doe", email: "jane@example.com", message: "Hello, this is a test message." };

describe("contact service", () => {
  it("stores the message and delivers it via the mailer", async () => {
    const repo = fakeRepo();
    const send = vi.fn().mockResolvedValue(undefined);
    const mailer: Mailer = { kind: "smtp", send };
    const svc = createContactService({ repo, mailer, contactTo: "me@example.com", fromAddress: "no-reply@kelianc.eu" });
    const res = await svc.submit(valid, { ip: "1.2.3.4", userAgent: "test" });
    expect(res).toEqual({ accepted: true, spam: false });
    expect(repo.created).toHaveLength(1);
    expect(send).toHaveBeenCalledOnce();
    expect(repo.delivered).toEqual([1]);
  });

  it("silently drops honeypot submissions without storing or sending", async () => {
    const repo = fakeRepo();
    const send = vi.fn();
    const mailer: Mailer = { kind: "smtp", send };
    const svc = createContactService({ repo, mailer, contactTo: "me@example.com", fromAddress: "x@y.z" });
    const res = await svc.submit({ ...valid, website: "http://spam.example" });
    expect(res).toEqual({ accepted: true, spam: true });
    expect(repo.created).toHaveLength(0);
    expect(send).not.toHaveBeenCalled();
  });

  it("rejects invalid input with a ZodError", async () => {
    const repo = fakeRepo();
    const svc = createContactService({ repo, mailer: null, contactTo: null, fromAddress: "x@y.z" });
    await expect(svc.submit({ name: "J", email: "not-an-email", message: "short" })).rejects.toThrow();
    expect(repo.created).toHaveLength(0);
  });

  it("still stores the message when delivery fails (never leaks to client)", async () => {
    const repo = fakeRepo();
    const send = vi.fn().mockRejectedValue(new Error("SMTP down"));
    const mailer: Mailer = { kind: "smtp", send };
    const svc = createContactService({ repo, mailer, contactTo: "me@example.com", fromAddress: "x@y.z" });
    const res = await svc.submit(valid);
    expect(res.accepted).toBe(true);
    expect(repo.created).toHaveLength(1);
    expect(repo.delivered).toHaveLength(0);
  });

  it("stores without delivering when no mailer is configured", async () => {
    const repo = fakeRepo();
    const svc = createContactService({ repo, mailer: null, contactTo: null, fromAddress: "x@y.z" });
    const res = await svc.submit(valid);
    expect(res.accepted).toBe(true);
    expect(repo.created).toHaveLength(1);
  });
});
