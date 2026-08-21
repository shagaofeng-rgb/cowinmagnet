import crypto from "node:crypto";
import { validateExternalImageRights } from "./image-rights-validator.js";

export async function syncApprovedExternalMedia(image, { fetcher = fetch } = {}) {
  const rights = validateExternalImageRights(image);
  if (!rights.passed) return { synced: false, reason: rights.reason };
  if (!process.env.OBJECT_STORAGE_BUCKET || !process.env.OBJECT_STORAGE_PUBLIC_BASE_URL) return { synced: false, reason: "object-storage-not-configured" };
  // The project does not yet include a configured storage SDK. Keep an explicit hard stop
  // rather than downloading a licensed asset into a serverless temporary filesystem.
  return { synced: false, reason: "object-storage-adapter-not-configured", contentHash: crypto.createHash("sha256").update(image.originalUrl).digest("hex") };
}
