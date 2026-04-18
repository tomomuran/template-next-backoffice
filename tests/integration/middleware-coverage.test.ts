import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("middleware route protection", () => {
  const middlewareSrc = readFileSync(resolve(process.cwd(), "src/middleware.ts"), "utf-8");

  it("ホワイトリスト方式で保護する", () => {
    expect(middlewareSrc).toContain("publicPrefixes");
    expect(middlewareSrc).not.toContain("protectedPrefixes");
  });

  it("ログインページは公開ルートに含まれる", () => {
    expect(middlewareSrc).toContain('"/login"');
  });

  it("認証関連ページは公開ルートに含まれる", () => {
    expect(middlewareSrc).toContain('"/auth"');
  });

  it("エラーページは公開ルートに含まれる", () => {
    expect(middlewareSrc).toContain('"/error"');
  });

  it("ルートパス / は公開ルートとして扱われる", () => {
    expect(middlewareSrc).toContain('pathname === "/"');
  });
});
