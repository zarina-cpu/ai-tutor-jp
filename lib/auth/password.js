import { randomBytes, scrypt, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

export async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const derived = await scryptAsync(password, salt, 64);
  return `${salt}:${derived.toString("hex")}`;
}

export async function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(":");
  const derived = await scryptAsync(password, salt, 64);
  const left = Buffer.from(hash, "hex");
  const right = Buffer.from(derived);
  return left.length === right.length && timingSafeEqual(left, right);
}
