import { BASE_URL } from "./api";

/**
 * Resolves media URLs (e.g., uploaded avatar headshots, static assets).
 * Handles relative paths, S3 URLs, and legacy hardcoded localhost:8000 URLs.
 */
export function resolveMediaUrl(url: string | null | undefined): string | null {
  if (!url) return null;

  const cleanBase = BASE_URL.endsWith("/") ? BASE_URL.slice(0, -1) : BASE_URL;

  // Fix legacy or dev localhost URLs when running on production/Amplify
  if (url.startsWith("http://localhost:8000")) {
    return url.replace("http://localhost:8000", cleanBase);
  }

  // Prepend backend API base URL only for backend uploads (/static/uploads/, /uploads/, /api/uploads/)
  if (url.startsWith("/static/") || url.startsWith("/uploads/") || url.startsWith("/api/uploads/")) {
    return `${cleanBase}${url}`;
  }

  // Frontend relative assets like /mentors/mentor_1.png should be loaded directly from the frontend host
  return url;
}
