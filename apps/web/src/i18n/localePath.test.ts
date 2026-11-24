import { describe, expect, it } from "vitest";
import { localeOfPath, swapLocaleInPath } from "./localePath";

describe("swapLocaleInPath", () => {
  it("swaps the locale prefix and keeps the rest of the path", () => {
    expect(swapLocaleInPath("/en/about", "fr")).toBe("/fr/about");
    expect(swapLocaleInPath("/fr/projects/sae-3a", "en")).toBe("/en/projects/sae-3a");
  });
  it("handles the bare locale root", () => {
    expect(swapLocaleInPath("/en", "fr")).toBe("/fr/");
    expect(swapLocaleInPath("/fr/", "en")).toBe("/en/");
  });
});

describe("localeOfPath", () => {
  it("reads the locale prefix, defaulting to en", () => {
    expect(localeOfPath("/fr/contact")).toBe("fr");
    expect(localeOfPath("/en")).toBe("en");
    expect(localeOfPath("/about")).toBe("en");
  });
});
