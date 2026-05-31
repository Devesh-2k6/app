/**
 * Safely validates an image URL against allowed remote patterns in next.config.ts.
 * If the hostname is not configured, it returns a fallback placeholder URL.
 */
export function getSafeImageUrl(url: string | null | undefined): string {
  if (!url) return "https://placehold.co/300x300?text=No+Image";

  try {
    // If it's a valid absolute URL, check the hostname
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase();

    const isAllowed =
      hostname === "images.unsplash.com" ||
      hostname === "placehold.co" ||
      hostname === "via.placeholder.com" ||
      hostname === "example.com" ||
      hostname === "supabase.co" ||
      hostname.endsWith(".supabase.co");

    if (isAllowed) {
      return url;
    }
  } catch {
    // If it's a relative path or local import path, it is safe
    if (url.startsWith("/") || url.startsWith("data:")) {
      return url;
    }
  }

  // Fallback to a configured domain (placehold.co is allowed in next.config.ts)
  return `https://placehold.co/300x300?text=${encodeURIComponent("Invalid Host")}`;
}
