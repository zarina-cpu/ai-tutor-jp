import { Files } from "files-sdk";
import { neon } from "files-sdk/neon";

export const RECORDINGS_BUCKET = "recordings";

export function storageReady() {
  return Boolean(
    process.env.AWS_ACCESS_KEY_ID &&
      process.env.AWS_SECRET_ACCESS_KEY &&
      process.env.AWS_ENDPOINT_URL_S3,
  );
}

function files() {
  return new Files({ adapter: neon({ bucket: RECORDINGS_BUCKET }) });
}

export async function uploadObject(key, body, contentType) {
  await files().upload(key, body, { contentType });
  return { bucket: RECORDINGS_BUCKET, key };
}

export async function downloadObject(key) {
  return files().download(key);
}

export async function objectUrl(key) {
  return files().url(key, { expiresIn: 3600 });
}
