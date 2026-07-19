import type { MetadataRoute } from "next";
import { getCollection, getSiteSettings, type BlogPost, type Person, type SectionKey } from "@/lib/content";

const SITE_URL = "https://the-urban-planet-lab.vercel.app";

const SECTION_ROUTES: { path: string; key: SectionKey }[] = [
    { path: "/research", key: "research" },
    { path: "/publications", key: "publications" },
    { path: "/people", key: "people" },
    { path: "/news", key: "news" },
    { path: "/blog", key: "blog" },
    { path: "/teaching", key: "teaching" },
];

export default function sitemap(): MetadataRoute.Sitemap {
    const { sections } = getSiteSettings();
    const now = new Date();

    const entries: MetadataRoute.Sitemap = [
        { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
        ...SECTION_ROUTES.filter(({ key }) => sections[key] !== false).map(({ path }) => ({
            url: `${SITE_URL}${path}`,
            lastModified: now,
            changeFrequency: "weekly" as const,
            priority: 0.8,
        })),
    ];

    if (sections.people !== false) {
        // Only Faculty have an individual profile page.
        entries.push(
            ...getCollection<Person>("people")
                .filter((person) => person.category === "faculty")
                .map((person) => ({
                    url: `${SITE_URL}/people/${person.slug}`,
                    lastModified: now,
                    changeFrequency: "monthly" as const,
                    priority: 0.5,
                }))
        );
    }

    if (sections.blog !== false) {
        entries.push(
            ...getCollection<BlogPost>("blog")
                .filter((post) => post.post_type === "long")
                .map((post) => ({
                    url: `${SITE_URL}/blog/${post.slug}`,
                    lastModified: post.date ? new Date(post.date) : now,
                    changeFrequency: "monthly" as const,
                    priority: 0.6,
                }))
        );
    }

    return entries;
}
