import { execFileSync, spawnSync } from "node:child_process";
import { rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const nextCacheDir = resolve(projectRoot, ".next/cache");

function isSupabaseRunning() {
  const result = spawnSync("pnpm", ["supabase:status"], {
    cwd: projectRoot,
    stdio: "ignore"
  });

  return result.status === 0;
}

function ensureSupabaseRunning() {
  if (isSupabaseRunning()) {
    return;
  }

  console.log("Supabase local が停止しているため起動します。");
  execFileSync("pnpm", ["supabase:start"], {
    cwd: projectRoot,
    stdio: "inherit"
  });
}

function resetDatabase() {
  console.log("E2E 実行前にローカル DB を初期化します。");
  execFileSync("pnpm", ["db:reset"], {
    cwd: projectRoot,
    stdio: "inherit"
  });
}

function clearNextCache() {
  rmSync(nextCacheDir, {
    recursive: true,
    force: true
  });
}

function runPlaywright(args) {
  execFileSync("pnpm", ["exec", "playwright", "test", ...args], {
    cwd: projectRoot,
    stdio: "inherit"
  });
}

ensureSupabaseRunning();
resetDatabase();
clearNextCache();
runPlaywright(process.argv.slice(2));
