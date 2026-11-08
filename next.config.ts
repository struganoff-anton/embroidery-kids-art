import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: isGitHubPages ? "export" : undefined,
  basePath: isGitHubPages ? "/embroidery-kids-art" : undefined,
  // Inline the deployment flag so public asset paths match after hydration.
  env: {
    GITHUB_PAGES: isGitHubPages ? "true" : "false",
  },
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
