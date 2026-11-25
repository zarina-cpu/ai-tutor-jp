import { readFileSync } from "fs";
import { resolve } from "path";
import { neon } from "@neondatabase/serverless";

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
const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
if (!url) {
  console.error("schema: DATABASE_URL_UNPOOLED missing");
  process.exit(1);
}

const sql = neon(url);
const statements = readFileSync(resolve(process.cwd(), "drizzle/0000_init.sql"), "utf8")
  .split(";")
  .map((item) => item.trim())
  .filter(Boolean);

for (const statement of statements) {
  await sql.query(statement);
}
await sql.query("alter table mistakes add column if not exists audio_key text");
const ping = await sql.query("select now() as now");
console.log(`schema: applied, now=${ping.rows?.[0]?.now || ping[0]?.now || "ok"}`);
