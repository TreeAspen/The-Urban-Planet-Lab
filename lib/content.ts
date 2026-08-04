import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content");

/**
 * True when a `/uploads/...` style path actually exists in `public/`. Lets a
 * page fall back to a placeholder instead of rendering a broken image.
 */
export function publicFileExists(publicPath: string): boolean {
    if (!publicPath) return false;
    return fs.existsSync(path.join(process.cwd(), "public", publicPath.replace(/^\//, "")));
}

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
    | "projects"
    | "publications"
    | "people"
    | "news"
    | "blog"
    | "teaching"
    | "home_places"
    | "news_lab_photo";

export type SiteSettings = {
    background: BackgroundVariant;
    /** Off by default: the Research page reads as text, figures live on Projects. */
    research_images: boolean;
    sections: Record<SectionKey, boolean>;
};

const DEFAULT_SETTINGS: SiteSettings = {
    background: "urbanheat",
    research_images: false,
    sections: {
        research: true,
        projects: true,
        publications: true,
        people: true,
        news: false,
        blog: true,
        teaching: true,
        home_places: true,
        news_lab_photo: true,
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
            research_images: raw.research_images ?? DEFAULT_SETTINGS.research_images,
            sections: { ...DEFAULT_SETTINGS.sections, ...(raw.sections ?? {}) },
        };
    } catch {
        return DEFAULT_SETTINGS;
    }
}

/** `body` is the markdown content below the frontmatter (empty string if none). */
export function getCollection<T>(collectionDir: string): (T & { slug: string; body: string })[] {
    const dir = path.join(CONTENT_DIR, collectionDir);
    if (!fs.existsSync(dir)) return [];
    return fs
        .readdirSync(dir)
        .filter((f) => f.endsWith(".md"))
        .map((filename) => {
            const raw = fs.readFileSync(path.join(dir, filename), "utf8");
            const { data, content } = matter(raw);
            return { ...(data as T), slug: filename.replace(/\.md$/, ""), body: content.trim() };
        });
}

// ── Dates ─────────────────────────────────────────────────────────────────────

/**
 * YAML turns an unquoted `date: 2026-06-22` into a Date but leaves a quoted
 * one as a string, and the CMS writes both. Every date field is therefore
 * either — never assume a string.
 */
export type DateValue = string | Date;

/** Parses to UTC midnight so the calendar day never shifts by timezone. */
function toDate(value: DateValue | null | undefined): Date | null {
    if (!value) return null;
    const date =
        value instanceof Date
            ? value
            : /^\d{4}-\d{2}-\d{2}$/.test(value)
              ? new Date(`${value}T00:00:00Z`)
              : new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
}

/** e.g. "June 22, 2026". Empty string when the date is missing or unparseable. */
export function formatDate(value: DateValue | null | undefined): string {
    const date = toDate(value);
    if (!date) return "";
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
    });
}

/** "2026-06-22" for the machine-readable `datetime` attribute. */
export function toISODate(value: DateValue | null | undefined): string | undefined {
    return toDate(value)?.toISOString().slice(0, 10);
}

/** Newest first; entries without a usable date sort last. */
export function byDateDesc(a: DateValue, b: DateValue): number {
    return (toDate(b)?.getTime() ?? 0) - (toDate(a)?.getTime() ?? 0);
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

export type NewsPageContent = {
    lab_photo: string;
    lab_photo_alt: string;
    lab_photo_caption: string;
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

export type ProjectsContent = {
    main_heading: string;
    description: string;
    closing_statement: string;
};

export type ResearchDirection = {
    index: number;
    title: string;
    description: string;
    tagline: string;
    status: string;
    partners: string;
    image: string;
    image_alt: string;
    /** Slugs of publications in content/publications — at most 3 are shown. */
    publications: string[];
    slug: string;
};

export type Project = {
    /** Display order on the Projects page (1 = first). */
    order: number;
    title: string;
    tagline: string;
    status: string;
    period: string;
    description: string;
    /** Slug of the research direction this project belongs to. */
    direction: string;
    partners: string;
    image: string;
    image_alt: string;
    publications: string[];
    /** Optional long write-up (markdown) shown on the project's own page. */
    body: string;
    slug: string;
};

export type Person = {
    name: string;
    role: string;
    category: "faculty" | "phd" | "master" | "undergrad" | "highschool" | "external" | "alumni";
    photo: string;
    /** Short bio shown on the People list. The markdown `body` is the long
     *  version shown on the individual profile page. */
    bio: string;
    body: string;
    email: string;
    website: string;
    scholar: string;
    linkedin: string;
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
    date: DateValue;
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
    /** External syllabus link; `syllabus_file` is an uploaded PDF. Either one
     *  activates the syllabus button — with neither, it renders inert. */
    syllabus_url: string;
    syllabus_file: string;
    sort_order: number;
    slug: string;
};

export type BlogPost = {
    title: string;
    date: DateValue;
    author: string;
    summary: string;
    cover_image: string;
    cover_image_alt: string;
    /** "long" = has its own page rendering the markdown body; "card" = list entry only, like News. */
    post_type: "long" | "card";
    external_link: string;
    featured: boolean;
    slug: string;
    body: string;
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
    /** The lab's own office — pinned first and styled differently on the map. */
    is_office: boolean;
    slug: string;
};
