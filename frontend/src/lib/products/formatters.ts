export function formatExpiryDisplay(dateString: string, nowMs?: number) {
  const expiryDate = new Date(dateString);
  const now = nowMs ?? Date.now();
  const diffMs = expiryDate.getTime() - now;

  const isExpired = diffMs <= 0;

  if (isExpired) {
    return { isExpired: true, compact: "0h", full: "Expired" };
  }

  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  let compact = "";
  let full = "";

  if (diffDays > 0) {
    compact = `${diffDays}d`;
    full = `${diffDays} day${diffDays > 1 ? "s" : ""}`;
  } else {
    compact = `${diffHours}h`;
    full = `${diffHours} hour${diffHours !== 1 ? "s" : ""}`;
  }

  return { isExpired: false, compact, full };
}

/** True if product expires within the next `hours` (and is not already expired). */
export function isExpiringWithinHours(
  dateString: string,
  hours: number,
  nowMs: number
): boolean {
  const diffMs = new Date(dateString).getTime() - nowMs;
  return diffMs > 0 && diffMs < hours * 3600 * 1000;
}
