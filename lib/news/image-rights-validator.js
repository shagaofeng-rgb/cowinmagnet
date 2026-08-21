const ALLOWED_LICENSES = new Set(["owned", "public-domain", "creative-commons", "press-use-approved", "commercial-license"]);

export function validateExternalImageRights(image = {}) {
  const complete = Boolean(image.originalUrl && image.publisher && image.licenseBasis && image.rightsVerifiedAt);
  const allowed = complete && image.allowedForReuse === true && ALLOWED_LICENSES.has(image.licenseBasis);
  return {
    passed: allowed,
    reason: allowed ? null : "source_image_unavailable_or_unlicensed",
    asset: allowed ? { ...image, allowedForReuse: true } : null
  };
}
