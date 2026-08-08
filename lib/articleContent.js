const UNSAFE_BLOCK_TAGS = "script|style|iframe|object|embed|form|textarea|button|input|svg";

export function sanitizeArticleContent(value = "") {
  return String(value)
    .replace(/```[\s\S]*?```/g, "")
    .replace(/```[\s\S]*$/g, "")
    .replace(new RegExp(`<(${UNSAFE_BLOCK_TAGS})\\b[^>]*>[\\s\\S]*?<\\/\\1\\s*>`, "gi"), "")
    .replace(new RegExp(`<\\/?(?:${UNSAFE_BLOCK_TAGS})\\b[^>]*>`, "gi"), "")
    .replace(/<\/?[a-z][^>]*>/gi, " ")
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function hasUnsafeArticleMarkup(value = "") {
  return /```|<\/?(?:script|style|iframe|object|embed|form|textarea|button|input|svg)\b/i.test(String(value));
}
