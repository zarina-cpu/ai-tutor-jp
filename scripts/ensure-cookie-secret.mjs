import { randomBytes } from "crypto";
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const file = resolve(process.cwd(), ".env.local");
const current = readFileSync(file, "utf8");
if (!/^NEON_AUTH_COOKIE_SECRET=\s*$/m.test(current) && /NEON_AUTH_COOKIE_SECRET=.+/.test(current)) {
  process.stdout.write("cookie-secret: already set\n");
  process.exit(0);
}
const secret = randomBytes(32).toString("base64");
const next = current.includes("NEON_AUTH_COOKIE_SECRET=")
  ? current.replace(/NEON_AUTH_COOKIE_SECRET=.*/m, `NEON_AUTH_COOKIE_SECRET=${secret}`)
  : `${current.trimEnd()}\nNEON_AUTH_COOKIE_SECRET=${secret}\n`;
writeFileSync(file, next);
process.stdout.write("cookie-secret: generated\n");
