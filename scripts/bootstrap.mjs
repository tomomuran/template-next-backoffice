import { execFileSync, spawnSync } from "node:child_process";
import { copyFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import os from "node:os";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(currentDir, "..");
const defaultLocalPublishableKey = "your-publishable-key";
const defaultLocalServiceRoleKey =
  "your-service-role-key";

export function buildBootstrapEnv(baseContent, slot) {
  const appPort = slot * 100;
  const supabasePort = 55000 + slot * 10;
  return upsertEnvValues(baseContent, {
    PROJECT_SLOT: String(slot),
    NEXT_PUBLIC_APP_URL: `http://127.0.0.1:${appPort}`,
    NEXT_PUBLIC_SUPABASE_URL: `http://127.0.0.1:${supabasePort}`,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: defaultLocalPublishableKey,
    SUPABASE_SERVICE_ROLE_KEY: defaultLocalServiceRoleKey
  });
}

export function buildTemplateAdoptionContent(currentContent, version, generatedDate, owner) {
  let nextContent = currentContent.replace(/- ベーステンプレート版: `.*`/, `- ベーステンプレート版: \`v${version}\``);
  nextContent = nextContent.replace(/^(- 生成日:)\s*$/m, `$1 ${generatedDate}`);
  nextContent = nextContent.replace(/^(- 担当者:)\s*$/m, `$1 ${owner}`);
  return nextContent;
}

export function upsertEnvValues(content, updates) {
  const lines = content.split(/\r?\n/);
  const seenKeys = new Set();
  const nextLines = lines.map((line) => {
    const equalIndex = line.indexOf("=");
    if (equalIndex === -1) {
      return line;
    }

    const key = line.slice(0, equalIndex);
    if (!(key in updates)) {
      return line;
    }

    seenKeys.add(key);
    const currentValue = line.slice(equalIndex + 1);
    if (currentValue.trim().length > 0) {
      return line;
    }

    return `${key}=${updates[key]}`;
  });

  Object.entries(updates).forEach(([key, value]) => {
    if (!seenKeys.has(key)) {
      nextLines.push(`${key}=${value}`);
    }
  });

  return nextLines.join("\n");
}

function assertNodeVersion() {
  const major = Number(process.versions.node.split(".")[0]);
  if (major !== 22) {
    throw new Error(`Node.js 22 が必要です。現在: ${process.versions.node}`);
  }
}

function assertCommandAvailable(command, args = ["--version"], hint = "") {
  const result = spawnSync(command, args, { stdio: "ignore" });
  if (result.status !== 0) {
    throw new Error(`${command} が見つからないか実行できません。${hint}`.trim());
  }
}

function assertDockerRuntime() {
  const result = spawnSync("docker", ["info"], { stdio: "ignore" });
  if (result.status !== 0) {
    throw new Error("Docker 互換ランタイムが起動していません。Docker Desktop または OrbStack を起動してください。");
  }
}

function ensureEnvLocal(slot) {
  const envExamplePath = resolve(projectRoot, ".env.example");
  const envLocalPath = resolve(projectRoot, ".env.local");

  if (!existsSync(envLocalPath)) {
    copyFileSync(envExamplePath, envLocalPath);
  }

  const currentContent = readFileSync(envLocalPath, "utf8");
  const nextContent = buildBootstrapEnv(currentContent, slot);
  if (nextContent !== currentContent) {
    writeFileSync(envLocalPath, nextContent);
  }
}

function initializeTemplateAdoption(version) {
  const adoptionPath = resolve(projectRoot, "docs/template-adoption.md");
  if (!existsSync(adoptionPath)) {
    return;
  }

  const owner = process.env.BOOTSTRAP_OWNER ?? process.env.GIT_AUTHOR_NAME ?? process.env.USER ?? os.userInfo().username;
  const generatedDate = new Date().toISOString().slice(0, 10);
  const currentContent = readFileSync(adoptionPath, "utf8");
  const nextContent = buildTemplateAdoptionContent(currentContent, version, generatedDate, owner);

  if (nextContent !== currentContent) {
    writeFileSync(adoptionPath, nextContent);
  }
}

function runBootstrap() {
  assertNodeVersion();
  assertCommandAvailable("pnpm");
  assertCommandAvailable("supabase");
  assertDockerRuntime();

  const slot = Number(process.env.PROJECT_SLOT ?? 33);
  if (!Number.isInteger(slot) || slot <= 0) {
    throw new Error(`PROJECT_SLOT は正の整数で指定してください。現在: ${process.env.PROJECT_SLOT ?? "undefined"}`);
  }

  const packageJson = JSON.parse(readFileSync(resolve(projectRoot, "package.json"), "utf8"));
  ensureEnvLocal(slot);
  initializeTemplateAdoption(packageJson.version);
  execFileSync("pnpm", ["supabase:start"], { cwd: projectRoot, stdio: "inherit" });
  execFileSync("pnpm", ["db:reset"], { cwd: projectRoot, stdio: "inherit" });
  console.log("bootstrap が完了しました。次は pnpm dev を実行してください。");
}

const isDirectExecution = process.argv[1] ? resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url)) : false;

if (isDirectExecution) {
  try {
    runBootstrap();
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}
