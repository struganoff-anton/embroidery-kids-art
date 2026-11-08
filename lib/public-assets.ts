export const GITHUB_PAGES_BASE_PATH = "/embroidery-kids-art";

export function resolvePublicAssetPath(path: string): string {
  if (!path) return path;

  const normalized = path.trim();
  if (
    normalized.startsWith("http://") ||
    normalized.startsWith("https://") ||
    normalized.startsWith("data:") ||
    normalized.startsWith("blob:") ||
    normalized.startsWith("#") ||
    normalized.startsWith("mailto:")
  ) {
    return normalized;
  }

  const rootRelativePath = normalized.startsWith("/") ? normalized : `/${normalized}`;

  if (process.env.GITHUB_PAGES === "true") {
    if (rootRelativePath === GITHUB_PAGES_BASE_PATH || rootRelativePath.startsWith(`${GITHUB_PAGES_BASE_PATH}/`)) {
      return rootRelativePath;
    }

    return `${GITHUB_PAGES_BASE_PATH}${rootRelativePath}`;
  }

  return rootRelativePath;
}
