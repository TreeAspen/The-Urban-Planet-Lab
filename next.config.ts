import type { NextConfig } from "next";

const supabaseHostname = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const isGithubPages = process.env.GITHUB_PAGES === "true";
const repoName = "The-Urban-Planet-Lab";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: isGithubPages ? `/${repoName}` : undefined,
  assetPrefix: isGithubPages ? `/${repoName}/` : undefined,
  images: {
    unoptimized: true,
    ...(supabaseHostname
      ? {
          remotePatterns: [
            {
              protocol: "https",
              hostname: supabaseHostname,
              pathname: "/storage/v1/object/public/**",
            },
          ],
        }
      : {}),
  },
};

export default nextConfig;
