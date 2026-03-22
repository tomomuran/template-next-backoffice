import { execSync } from "node:child_process";
import { ports, urls, slot } from "./port-config.mjs";

console.log(`Starting dev server on port ${ports.app} (slot ${slot})`);
console.log(`App:     ${urls.app}`);
console.log(`Supabase: ${urls.supabaseApi}`);

execSync(`next dev -p ${ports.app}`, {
  stdio: "inherit",
  env: {
    ...process.env,
    NEXT_PUBLIC_APP_URL: urls.app,
    NEXT_PUBLIC_SUPABASE_URL: urls.supabaseApi,
    PORT: String(ports.app),
  },
});
