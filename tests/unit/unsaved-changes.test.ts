import { describe, expect, it } from "vitest";
import { shouldWarnAboutUnsavedChanges } from "@/components/forms/unsaved-changes";

describe("shouldWarnAboutUnsavedChanges", () => {
  it("dirty かつ未送信時に警告する", () => {
    expect(shouldWarnAboutUnsavedChanges(true, false)).toBe(true);
  });

  it("送信中は警告しない", () => {
    expect(shouldWarnAboutUnsavedChanges(true, true)).toBe(false);
  });

  it("未変更なら警告しない", () => {
    expect(shouldWarnAboutUnsavedChanges(false, false)).toBe(false);
  });
});
