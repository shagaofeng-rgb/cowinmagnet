import { createHash } from "node:crypto";

export function adminVisitorCode(visitorId) {
  const id = String(visitorId || "").trim();
  if (!id) return "";
  const digest = createHash("sha256").update(id).digest("hex").slice(0, 12);
  return BigInt(`0x${digest}`).toString(36).toUpperCase().padStart(10, "0");
}
