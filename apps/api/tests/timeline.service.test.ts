import { describe, expect, it } from "vitest";
import { createTimelineService } from "../src/services/timeline.service";
import type { TimelineRepository } from "../src/repositories/types";
import type { TimelineEvent } from "@kelianc/shared";

const events: TimelineEvent[] = [
  {
    id: 1,
    kind: "education",
    startDate: "2025-09",
    endDate: "2028-06",
    title: { en: "BUT Computer Science", fr: "BUT Informatique" },
    organization: { en: "IUT Montpellier-Sète", fr: "IUT Montpellier-Sète" },
    description: { en: "Third year", fr: "Troisième année" },
    order: 1,
  },
];

const repo: TimelineRepository = {
  async list() { return events; },
  async upsert() {},
  async delete(id) { return id === 1; },
};

describe("timeline service", () => {
  it("localizes events to the requested locale", async () => {
    const svc = createTimelineService(repo);
    const fr = await svc.listLocalized("fr");
    expect(fr[0]?.title).toBe("BUT Informatique");
    expect(fr[0]?.description).toBe("Troisième année");
    const en = await svc.listLocalized("en");
    expect(en[0]?.title).toBe("BUT Computer Science");
  });

  it("passes upsert through with an optional id", async () => {
    let captured: (Omit<TimelineEvent, "id"> & { id?: number }) | null = null;
    const capturing: TimelineRepository = {
      ...repo,
      async upsert(e) { captured = e; },
    };
    const svc = createTimelineService(capturing);
    const { id: _id, ...rest } = events[0]!;
    await svc.upsert(rest, 7);
    expect(captured!.id).toBe(7);
  });
});
