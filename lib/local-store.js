import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), ".data", "store.json");

const empty = {
  users: [],
  sessions: [],
  subscriptions: {},
  quotas: {},
  progress: [],
  mistakes: [],
};

async function load() {
  try {
    const raw = await readFile(filePath, "utf8");
    return { ...empty, ...JSON.parse(raw) };
  } catch {
    return structuredClone(empty);
  }
}

async function save(data) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
}

export async function withStore(mutator) {
  const data = await load();
  const result = await mutator(data);
  await save(data);
  return result;
}

export async function readStore() {
  return load();
}
