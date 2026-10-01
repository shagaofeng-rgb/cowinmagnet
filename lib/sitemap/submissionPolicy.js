export function shouldSubmitSitemap({ submit = false, changed = false, force = false, resubmitUnchanged = false, previewReadOnly = false, dryRun = false } = {}) {
  return !previewReadOnly && !dryRun && submit && (changed || force || resubmitUnchanged);
}
