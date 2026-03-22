import { describe, expect, it } from "vitest";
import { NextResponse } from "next/server";
import { applyResponseCookies } from "@/lib/supabase/middleware";
import { resolveProjectSlot } from "../../scripts/port-config.mjs";
import { resolveSupabaseCommand } from "../../scripts/supabase/cli.mjs";

describe("review regression guards", () => {
  it("middleware は複数 Supabase cookie をまとめて引き継ぐ", () => {
    const source = NextResponse.next();
    source.cookies.set("sb-access-token", "token-1");
    source.cookies.set("sb-refresh-token", "token-2");

    const target = applyResponseCookies(source, NextResponse.redirect(new URL("http://127.0.0.1:3300/login")));

    expect(target.cookies.get("sb-access-token")?.value).toBe("token-1");
    expect(target.cookies.get("sb-refresh-token")?.value).toBe("token-2");
  });

  it("persisted PROJECT_SLOT を読み、明示 env があればそちらを優先する", () => {
    expect(resolveProjectSlot(undefined, "PROJECT_SLOT=44\nNEXT_PUBLIC_APP_URL=http://127.0.0.1:4400\n")).toBe(44);
    expect(resolveProjectSlot("52", "PROJECT_SLOT=44\n")).toBe(52);
  });

  it("db-lint を Supabase の正しい subcommand へ変換する", () => {
    expect(resolveSupabaseCommand("db-lint", "--workdir /tmp/project")).toBe("supabase --workdir /tmp/project db lint");
    expect(resolveSupabaseCommand("start", "--workdir /tmp/project")).toBe("supabase --workdir /tmp/project start");
  });
});
