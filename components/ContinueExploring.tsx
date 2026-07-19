import Link from "next/link";
import { AnimateIn } from "./AnimateIn";
import { getSiteSettings, type SectionKey } from "@/lib/content";

const HREF_TO_SECTION: Record<string, SectionKey> = {
    "/research": "research",
    "/publications": "publications",
    "/people": "people",
    "/news": "news",
    "/blog": "blog",
    "/teaching": "teaching",
};

type Suggestion = {
    label: string;
    title: string;
    description: string;
    href: string;
};

const PAGE_MAP: Record<string, Suggestion[]> = {
    home: [
        {
            label: "Research",
            title: "Read what we work on",
            description: "Our directions across climate, equity, and computation.",
            href: "/research",
        },
        {
            label: "People",
            title: "Meet the team",
            description: "Faculty, students, and alumni who power the lab.",
            href: "/people",
        },
        {
            label: "News",
            title: "What's new",
            description: "Recent grants, talks, and lab life.",
            href: "/news",
        },
        {
            label: "Blog",
            title: "Longer reads",
            description: "Essays and deep dives from lab members.",
            href: "/blog",
        },
    ],
    research: [
        {
            label: "Publications",
            title: "See it in print",
            description: "Peer-reviewed papers and reports from each direction.",
            href: "/publications",
        },
        {
            label: "People",
            title: "Who's behind the work",
            description: "The researchers leading these directions.",
            href: "/people",
        },
        {
            label: "Teaching",
            title: "Learn with us",
            description: "Graduate and undergraduate courses we offer.",
            href: "/teaching",
        },
    ],
    people: [
        {
            label: "Research",
            title: "What they study",
            description: "Active research directions across the lab.",
            href: "/research",
        },
        {
            label: "Publications",
            title: "Their published work",
            description: "Articles, papers, and reports.",
            href: "/publications",
        },
        {
            label: "Teaching",
            title: "Where they teach",
            description: "Courses taught by lab faculty.",
            href: "/teaching",
        },
    ],
    publications: [
        {
            label: "Research",
            title: "The directions behind them",
            description: "How papers connect to ongoing research.",
            href: "/research",
        },
        {
            label: "People",
            title: "Meet the authors",
            description: "Researchers behind these publications.",
            href: "/people",
        },
        {
            label: "News",
            title: "Recent highlights",
            description: "What we've been up to lately.",
            href: "/news",
        },
    ],
    news: [
        {
            label: "Publications",
            title: "Dive deeper",
            description: "The papers behind the headlines.",
            href: "/publications",
        },
        {
            label: "People",
            title: "Meet the team",
            description: "The researchers in the news.",
            href: "/people",
        },
        {
            label: "Research",
            title: "Our ongoing work",
            description: "What drives these updates.",
            href: "/research",
        },
        {
            label: "Blog",
            title: "Longer reads",
            description: "Essays and deep dives from lab members.",
            href: "/blog",
        },
    ],
    blog: [
        {
            label: "News",
            title: "Quick updates",
            description: "Short highlights on grants, talks, and lab life.",
            href: "/news",
        },
        {
            label: "Publications",
            title: "The research behind it",
            description: "Peer-reviewed papers and reports.",
            href: "/publications",
        },
        {
            label: "People",
            title: "Meet the authors",
            description: "Who's writing and researching at the lab.",
            href: "/people",
        },
    ],
    teaching: [
        {
            label: "Research",
            title: "From classroom to lab",
            description: "How teaching connects to research.",
            href: "/research",
        },
        {
            label: "People",
            title: "Meet the instructors",
            description: "Faculty teaching these courses.",
            href: "/people",
        },
        {
            label: "Publications",
            title: "Suggested reading",
            description: "Lab papers used in our courses.",
            href: "/publications",
        },
    ],
};

export function ContinueExploring({ from }: { from: keyof typeof PAGE_MAP }) {
    const { sections } = getSiteSettings();
    const items = (PAGE_MAP[from] ?? []).filter((item) => {
        const key = HREF_TO_SECTION[item.href];
        return key ? sections[key] !== false : true;
    });
    if (items.length === 0) return null;

    return (
        <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
            <AnimateIn>
                <div className="mb-6 flex items-end justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/55 dark:text-white/55">
                            Continue exploring
                        </p>
                        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-black dark:text-white sm:text-3xl">
                            Where to go next
                        </h2>
                    </div>
                </div>
            </AnimateIn>

            <div className="grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item, i) => (
                    <AnimateIn key={item.href} className="h-full" delay={0.05 * i} y={20}>
                        <Link
                            href={item.href}
                            className="group block h-full rounded-[1.5rem] border border-black/10 bg-white/70 p-6 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:border-black/25 hover:shadow-[0_18px_60px_rgba(15,23,42,0.08)] dark:border-white/15 dark:bg-black/60 dark:hover:border-white/30 dark:hover:shadow-[0_18px_60px_rgba(0,0,0,0.28)]"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/55 dark:text-white/55">
                                    {item.label}
                                </span>
                                <span className="text-black/40 transition-all duration-300 group-hover:translate-x-1 group-hover:text-black dark:text-white/40 dark:group-hover:text-white">
                                    →
                                </span>
                            </div>
                            <h3 className="mt-4 text-lg font-semibold text-black dark:text-white">
                                {item.title}
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-black/65 dark:text-white/60">
                                {item.description}
                            </p>
                        </Link>
                    </AnimateIn>
                ))}
            </div>
        </section>
    );
}
