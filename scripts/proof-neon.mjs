import { readFileSync } from "fs";
import { resolve } from "path";
import { neon } from "@neondatabase/serverless";
import { Files } from "files-sdk";
import { neon as neonStorage } from "files-sdk/neon";

function loadEnvLocal() {
  const text = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const index = trimmed.indexOf("=");
    if (index < 0) continue;
    const key = trimmed.slice(0, index).trim();
    let value = trimmed.slice(index + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvLocal();

const sql = neon(process.env.DATABASE_URL);
const rows = await sql`select current_database() as db, count(*)::int as quotas from practice_quotas`;
const files = new Files({ adapter: neonStorage({ bucket: "recordings" }) });
const key = `proof/${Date.now()}.txt`;
await files.upload(key, "proof-ok", { contentType: "text/plain" });
const downloaded = await files.download(key);
const body =
  typeof downloaded.text === "function" ? await downloaded.text() : String(downloaded);
const exists = await files.exists(key);

console.log(
  JSON.stringify({
    postgres: rows[0].db,
    quotas: rows[0].quotas,
    storageExists: exists,
    storageBodyOk: body.includes("proof-ok"),
  }),
);
