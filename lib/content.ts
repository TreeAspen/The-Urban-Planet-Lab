import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content");

export function getPageContent<T>(page: string): T {
    const filePath = path.join(CONTENT_DIR, "pages", `${page}.json`);
    return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
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
