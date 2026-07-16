import type { MetadataRoute } from "next";
import { getSiteSettings, type SectionKey } from "@/lib/content";

const SITE_URL = "https://the-urban-planet-lab.vercel.app";

const SECTION_ROUTES: { path: string; key: SectionKey }[] = [
    { path: "/research", key: "research" },
    { path: "/publications", key: "publications" },
    { path: "/people", key: "people" },
    { path: "/news", key: "news" },
    { path: "/teaching", key: "teaching" },
];

export default function sitemap(): MetadataRoute.Sitemap {
    const { sections } = getSiteSettings();
    const now = new Date();

    return [
        { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
        ...SECTION_ROUTES.filter(({ key }) => sections[key] !== false).map(({ path }) => ({
            url: `${SITE_URL}${path}`,
            lastModified: now,
            changeFrequency: "weekly" as const,
            priority: 0.8,
        })),
    ];
}
