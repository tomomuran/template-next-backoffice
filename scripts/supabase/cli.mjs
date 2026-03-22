import { execSync } from "node:child_process";
import { copyFileSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { ports, urls, slot } from "../port-config.mjs";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const baseConfig = resolve(projectRoot, "supabase/config.toml");
const runtimeDir = resolve(projectRoot, `.supabase-runtime/slot-${slot}/supabase`);
const runtimeConfig = resolve(runtimeDir, "config.toml");
const runtimeWorkdir = resolve(runtimeDir, "..");
const runtimeSeed = resolve(runtimeDir, "seed.sql");
const runtimeMigrationsDir = resolve(runtimeDir, "migrations");

function generateRuntimeConfig() {
  mkdirSync(runtimeDir, { recursive: true });
  mkdirSync(runtimeMigrationsDir, { recursive: true });

  let config = readFileSync(baseConfig, "utf-8");

  // project_id
  config = config.replace(
    /^project_id\s*=\s*".*"/m,
    `project_id = "park-poc-slot-${slot}"`
  );

  // [api] port
  config = config.replace(
    /^(port\s*=\s*)\d+/m,
    `$1${ports.supabaseApi}`
  );

  // [db] port & shadow_port
  config = config.replace(
    /(\[db\][\s\S]*?port\s*=\s*)\d+/,
    `$1${ports.supabaseDb}`
  );
  config = config.replace(
    /(shadow_port\s*=\s*)\d+/,
    `$1${ports.supabaseDbShadow}`
  );

  // [studio] port
  config = config.replace(
    /(\[studio\][\s\S]*?port\s*=\s*)\d+/,
    `$1${ports.supabaseStudio}`
  );

  // [inbucket] port
  config = config.replace(
    /(\[inbucket\][\s\S]*?port\s*=\s*)\d+/,
    `$1${ports.supabaseInbucket}`
  );

  // [analytics] port
  config = config.replace(
    /(\[analytics\][\s\S]*?port\s*=\s*)\d+/,
    `$1${ports.supabaseAnalytics}`
  );

  // [auth] site_url & additional_redirect_urls
  config = config.replace(
    /(site_url\s*=\s*)"[^"]*"/,
    `$1"${urls.app}"`
  );
  config = config.replace(
    /(additional_redirect_urls\s*=\s*)\[.*\]/,
    `$1["${urls.app}", "http://localhost:${ports.app}"]`
  );

  // seed.sql と migrations の相対パスを修正
  config = config.replace(
    /sql_paths\s*=\s*\["\.\/seed\.sql"\]/,
    `sql_paths = ["./seed.sql"]`
  );

  rmSync(runtimeMigrationsDir, { recursive: true, force: true });
  mkdirSync(runtimeMigrationsDir, { recursive: true });
  readdirSync(resolve(projectRoot, "supabase/migrations"))
    .filter((fileName) => fileName.endsWith(".sql"))
    .forEach((fileName) => {
      copyFileSync(resolve(projectRoot, "supabase/migrations", fileName), resolve(runtimeMigrationsDir, fileName));
    });
  writeFileSync(runtimeSeed, readFileSync(resolve(projectRoot, "supabase/seed.sql"), "utf-8"));
  writeFileSync(runtimeConfig, config);
  console.log(`Runtime config generated: ${runtimeConfig}`);
  console.log(`  API:      ${ports.supabaseApi}`);
  console.log(`  DB:       ${ports.supabaseDb}`);
  console.log(`  Shadow:   ${ports.supabaseDbShadow}`);
  console.log(`  Studio:   ${ports.supabaseStudio}`);
  console.log(`  Inbucket: ${ports.supabaseInbucket}`);
  console.log(`  Analytics:${ports.supabaseAnalytics}`);
}

export function resolveSupabaseCommand(commandName, workdirFlag) {
  if (commandName === "db-lint") {
    return `supabase ${workdirFlag} db lint`;
  }

  if (commandName === "db-reset") {
    return `supabase ${workdirFlag} db reset`;
  }

  return `supabase ${workdirFlag} ${commandName}`;
}

const isDirectExecution = process.argv[1] ? resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url)) : false;

if (isDirectExecution) {
  const command = process.argv[2];
  if (!command) {
    console.error("Usage: node scripts/supabase/cli.mjs <start|stop|status|db-reset>");
    process.exit(1);
  }

  generateRuntimeConfig();

  const workdir = runtimeWorkdir;
  const migrationsFlag = `--workdir ${workdir}`;

  try {
    execSync(resolveSupabaseCommand(command, migrationsFlag), { stdio: "inherit" });
  } catch {
    process.exit(1);
  }
}
