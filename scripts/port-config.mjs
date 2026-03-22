import { existsSync, readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * slot-based ポート設定
 *
 * PROJECT_SLOT から全ポートを deterministic に計算する。
 * slot 未指定時はデフォルト 33 を使用（後方互換）。
 *
 * 例: slot=33 → App 3300, Supabase API 55330, DB 55331, Shadow 55332, Studio 55333, Inbucket 55334, Analytics 55335
 */

const currentDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(currentDir, "..");

export function resolveProjectSlot(explicitSlot = process.env.PROJECT_SLOT, envLocalContent) {
  const persistedSlot = envLocalContent
    ?.split(/\r?\n/)
    .map((line) => line.trim())
    .find((line) => line.startsWith("PROJECT_SLOT="))
    ?.split("=", 2)?.[1]
    ?.trim();

  return Number(explicitSlot ?? persistedSlot ?? 33);
}

function readPersistedProjectSlot() {
  const envLocalPath = resolve(projectRoot, ".env.local");
  if (!existsSync(envLocalPath)) {
    return undefined;
  }

  return readFileSync(envLocalPath, "utf8");
}

const slot = resolveProjectSlot(process.env.PROJECT_SLOT, readPersistedProjectSlot());

export const ports = {
  app: slot * 100,
  supabaseApi: 55000 + slot * 10,
  supabaseDb: 55000 + slot * 10 + 1,
  supabaseDbShadow: 55000 + slot * 10 + 2,
  supabaseStudio: 55000 + slot * 10 + 3,
  supabaseInbucket: 55000 + slot * 10 + 4,
  supabaseAnalytics: 55000 + slot * 10 + 5,
};

export const urls = {
  app: `http://127.0.0.1:${ports.app}`,
  supabaseApi: `http://127.0.0.1:${ports.supabaseApi}`,
};

export { slot };
