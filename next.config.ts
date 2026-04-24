import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";
const repoName = "The-Urban-Planet-Lab";

const nextConfig: NextConfig = {
  ...(isGithubPages
    ? {
        output: "export" as const,
        trailingSlash: true,
        basePath: `/${repoName}`,
        assetPrefix: `/${repoName}/`,
      }
    : {}),
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
