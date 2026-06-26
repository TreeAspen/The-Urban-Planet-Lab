import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content");

export function getPageContent<T>(page: string): T {
    const filePath = path.join(CONTENT_DIR, "pages", `${page}.json`);
    return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

// ── Site-wide settings (background + section visibility) ───────────────────────

export type BackgroundVariant =
    | "urbanheat"
    | "aurora"
    | "mesh"
    | "dots"
    | "grid"
    | "glow"
    | "plain";

export type SectionKey =
    | "research"
    | "publications"
    | "people"
    | "news"
    | "teaching"
    | "home_places";

export type SiteSettings = {
    background: BackgroundVariant;
    sections: Record<SectionKey, boolean>;
};

const DEFAULT_SETTINGS: SiteSettings = {
    background: "urbanheat",
    sections: {
        research: true,
        publications: true,
        people: true,
        news: false,
        teaching: true,
        home_places: true,
    },
};

/**
 * Reads content/pages/settings.json, merging over sensible defaults so a
 * missing file or partial config never breaks the build.
 */
export function getSiteSettings(): SiteSettings {
    try {
        const filePath = path.join(CONTENT_DIR, "pages", "settings.json");
        const raw = JSON.parse(fs.readFileSync(filePath, "utf8")) as Partial<SiteSettings>;
        return {
            background: raw.background ?? DEFAULT_SETTINGS.background,
            sections: { ...DEFAULT_SETTINGS.sections, ...(raw.sections ?? {}) },
        };
    } catch {
        return DEFAULT_SETTINGS;
    }
}

export function getCollection<T>(collectionDir: string): (T & { slug: string })[] {
    const dir = path.join(CONTENT_DIR, collectionDir);
    if (!fs.existsSync(dir)) return [];
    return fs
        .readdirSync(dir)
        .filter((f) => f.endsWith(".md"))
        .map((filename) => {
            const raw = fs.readFileSync(path.join(dir, filename), "utf8");
            const { data } = matter(raw);
            return { ...(data as T), slug: filename.replace(/\.md$/, "") };
        });
}

// ── Typed helpers ─────────────────────────────────────────────────────────────

export type HomeContent = {
    tagline: string;
    main_heading: string;
    description: string;
    hero_image: string;
    hero_image_alt: string;
    cards: { title: string; description: string }[];
};

export type ResearchContent = {
    main_heading: string;
    description: string;
    hero_image: string;
    hero_image_alt: string;
    section_title: string;
    section_description: string;
    closing_statement: string;
};

export type ResearchDirection = {
    index: number;
    title: string;
    description: string;
    slug: string;
};

export type Person = {
    name: string;
    role: string;
    category: "faculty" | "phd" | "master" | "alumni";
    photo: string;
    bio: string;
    email: string;
    website: string;
    scholar: string;
    twitter: string;
    sort_order: number;
    slug: string;
};

export type Publication = {
    title: string;
    authors: string;
    venue: string;
    year: number;
    details: string;
    doi_url: string;
    pdf_url: string;
    abstract: string;
    tags: string[];
    pub_type: string;
    slug: string;
};

export type NewsItem = {
    title: string;
    date: string;
    summary: string;
    cover_image: string;
    cover_image_alt: string;
    link: string;
    featured: boolean;
    slug: string;
};

export type Course = {
    code: string;
    name: string;
    semester: string;
    description: string;
    syllabus_url: string;
    sort_order: number;
    slug: string;
};

export type Place = {
    member_name: string;
    place_name: string;
    location_label: string;
    lat: number;
    lng: number;
    year: number;
    story: string;
    photo: string;
    slug: string;
};
