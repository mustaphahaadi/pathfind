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

  // Prepend base URL for relative paths like /static/uploads/...
  if (url.startsWith("/")) {
    return `${cleanBase}${url}`;
  }

  return url;
}
