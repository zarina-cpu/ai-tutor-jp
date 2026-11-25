import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { downloadObject, storageReady, uploadObject } from "@/lib/storage";

export const runtime = "nodejs";

export async function GET() {
  const result = {
    postgres: false,
    storage: false,
    branch: process.env.NEON_BRANCH || null,
  };

  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { ...result, error: "DATABASE_URL отсутствует" },
      { status: 503 },
    );
  }

  try {
    const sql = neon(process.env.DATABASE_URL);
    const rows = await sql`select now() as now, current_database() as db`;
    result.postgres = Boolean(rows[0]?.db);
    result.database = rows[0]?.db;
  } catch (error) {
    result.postgresError = error.message;
  }

  if (!storageReady()) {
    result.storageError = "Нет AWS_* переменных Object Storage";
    return NextResponse.json(result, { status: result.postgres ? 200 : 503 });
  }

  try {
    const key = `health/ping-${Date.now()}.txt`;
    const payload = "iroha-ok";
    await uploadObject(key, payload, "text/plain");
    const file = await downloadObject(key);
    const text = typeof file.text === "function" ? await file.text() : String(file);
    result.storage = text.includes("iroha-ok");
    result.objectKey = key;
  } catch (error) {
    result.storageError = error.message;
  }

  const ok = result.postgres && result.storage;
  return NextResponse.json(result, { status: ok ? 200 : 503 });
}
