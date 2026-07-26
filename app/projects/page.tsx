import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
    getCollection,
    getPageContent,
    getSiteSettings,
    type Project,
    type ProjectsContent,
    type Publication,
} from "@/lib/content";
import { getDirections, getPublications, MAX_DIRECTION_PUBLICATIONS } from "@/lib/research";
import { AnimateIn } from "@/components/AnimateIn";
import { ContinueExploring } from "@/components/ContinueExploring";
import { Icon } from "@/components/Icons";

export const metadata = {
    title: "Projects — The Urban Planet Lab",
    description:
        "Active projects at The Urban Planet Lab — the datasets, partners, and papers behind each of our research directions.",
};

/** One accent per project slot, reused if more projects are added. */
const ACCENTS = [
    { tile: "from-cyan-400/28 via-sky-400/16 to-indigo-500/24", dot: "bg-cyan-500 dark:bg-cyan-300" },
    { tile: "from-emerald-400/28 via-teal-400/16 to-cyan-500/24", dot: "bg-emerald-500 dark:bg-emerald-300" },
    { tile: "from-rose-400/28 via-orange-400/18 to-amber-400/26", dot: "bg-rose-500 dark:bg-rose-300" },
    { tile: "from-amber-400/30 via-orange-500/18 to-rose-500/24", dot: "bg-amber-500 dark:bg-amber-300" },
    { tile: "from-violet-400/28 via-fuchsia-400/16 to-sky-500/24", dot: "bg-violet-500 dark:bg-violet-300" },
];

/**
 * Stand-in visual until a real project image is uploaded: concentric thermal
 * rings over a grid, echoing the heat-islet imagery the lab works with.
 */
function PlaceholderTile({ index, accent }: { index: number; accent: string }) {
    return (
        <div
            className={`relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-[2rem] bg-gradient-to-br ${accent}`}
        >
            <svg
                aria-hidden="true"
                viewBox="0 0 400 300"
                className="absolute inset-0 h-full w-full text-black/25 dark:text-white/25"
                fill="none"
                stroke="currentColor"
            >
                <defs>
                    <pattern id={`grid-${index}`} width="25" height="25" patternUnits="userSpaceOnUse">
                        <path d="M25 0H0v25" strokeWidth="0.5" opacity="0.5" />
                    </pattern>
                </defs>
                <rect width="400" height="300" fill={`url(#grid-${index})`} stroke="none" />
                <g strokeWidth="1.2" opacity="0.85">
                    <ellipse cx="200" cy="150" rx="36" ry="28" />
                    <ellipse cx="200" cy="150" rx="66" ry="50" />
                    <ellipse cx="200" cy="150" rx="98" ry="72" />
                    <ellipse cx="200" cy="150" rx="132" ry="96" />
                </g>
            </svg>
            <span className="relative text-6xl font-semibold tracking-[-0.08em] text-black/22 dark:text-white/22 sm:text-7xl">
                {String(index).padStart(2, "0")}
            </span>
        </div>
    );
}

function ProjectRow({
    project,
    position,
    accent,
    directionTitle,
    publications,
}: {
    project: Project;
    position: number;
    accent: (typeof ACCENTS)[number];
    directionTitle: string | null;
    publications: Publication[];
}) {
    const flipped = position % 2 === 1;

    return (
        <article id={project.slug} className="scroll-mt-28">
            <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
                <div className={flipped ? "lg:order-2" : undefined}>
                    {project.image ? (
                        <div className="overflow-hidden rounded-[2rem] border border-black/10 bg-white/60 shadow-[0_20px_70px_rgba(15,23,42,0.08)] dark:border-white/15 dark:bg-black/50">
                            <Image
                                src={project.image}
                                alt={project.image_alt || project.title}
                                width={1200}
                                height={900}
                                sizes="(min-width: 1024px) 560px, 100vw"
                                className="h-auto w-full object-cover"
                            />
                        </div>
                    ) : (
                        <PlaceholderTile index={position + 1} accent={accent.tile} />
                    )}
                </div>

                <div className={flipped ? "lg:order-1" : undefined}>
                    <div className="flex flex-wrap items-center gap-2.5">
                        <span className={`inline-block h-2 w-2 rounded-full ${accent.dot}`} />
                        {project.status ? (
                            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-black/55 dark:text-white/50">
                                {project.status}
                            </span>
                        ) : null}
                        {project.period ? (
                            <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-black/40 dark:text-white/35">
                                {project.period}
                            </span>
                        ) : null}
                    </div>

                    <h2 className="mt-3 text-2xl font-semibold leading-tight tracking-tight text-black dark:text-white sm:text-3xl">
                        {project.title}
                    </h2>

                    {project.tagline ? (
                        <p className="mt-2 text-lg italic leading-relaxed text-black/60 dark:text-white/55">
                            {project.tagline}
                        </p>
                    ) : null}

                    {project.description ? (
                        <p className="mt-4 text-base leading-8 text-black/76 dark:text-white/72">
                            {project.description}
                        </p>
                    ) : null}

                    {project.partners ? (
                        <p className="mt-5 text-sm text-black/55 dark:text-white/50">
                            <span className="font-semibold uppercase tracking-[0.14em] text-black/45 dark:text-white/40">
                                Partners
                            </span>
                            <span className="ml-2">{project.partners}</span>
                        </p>
                    ) : null}

                    {publications.length > 0 ? (
                        <ul className="mt-5 space-y-2 border-t border-black/8 pt-4 dark:border-white/10">
                            {publications.map((pub) => (
                                <li key={pub.slug}>
                                    <Link
                                        href={`/publications#${pub.slug}`}
                                        className="group flex items-start gap-2.5 text-sm leading-relaxed text-black/70 transition-colors hover:text-black dark:text-white/65 dark:hover:text-white"
                                    >
                                        <Icon name="paper" className="mt-0.5 h-4 w-4 shrink-0 opacity-60" />
                                        <span>
                                            <span className="underline-offset-4 group-hover:underline">
                                                {pub.title}
                                            </span>
                                            {pub.year ? (
                                                <span className="text-black/45 dark:text-white/40"> ({pub.year})</span>
                                            ) : null}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : null}

                    {directionTitle ? (
                        <Link
                            href={`/research#${project.direction}`}
                            className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-black/15 px-3.5 py-1.5 text-xs font-medium text-black/65 transition-all duration-200 hover:scale-[1.04] hover:border-black/30 hover:text-black dark:border-white/20 dark:text-white/60 dark:hover:border-white/35 dark:hover:text-white"
                        >
                            Research direction: {directionTitle}
                            <Icon name="arrow" />
                        </Link>
                    ) : null}
                </div>
            </div>
        </article>
    );
}

export default function ProjectsPage() {
    if (getSiteSettings().sections.projects === false) notFound();

    const content = getPageContent<ProjectsContent>("projects");
    const projects = getCollection<Project>("projects").sort(
        (a, b) => (a.order ?? 99) - (b.order ?? 99)
    );

    const directionTitles = new Map(
        getDirections().map((direction) => [direction.slug, direction.title.trim()])
    );
    const pubsBySlug = new Map(getPublications().map((pub) => [pub.slug, pub]));

    return (
        <div className="relative">
            <section className="mx-auto max-w-6xl px-4 pt-16 pb-10 sm:px-6 sm:pt-20 lg:px-8 lg:pt-24">
                <AnimateIn y={28} duration={0.7}>
                    <h1 className="max-w-4xl text-balance text-4xl font-semibold tracking-tight text-black dark:text-white sm:text-5xl lg:text-6xl">
                        {content.main_heading}
                    </h1>
                    {content.description ? (
                        <p className="mt-6 max-w-3xl text-lg leading-8 text-black/78 dark:text-white/74">
                            {content.description}
                        </p>
                    ) : null}
                </AnimateIn>
            </section>

            <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 lg:px-8 lg:pb-16">
                {projects.length > 0 ? (
                    <div className="space-y-16 sm:space-y-20 lg:space-y-24">
                        {projects.map((project, index) => (
                            <AnimateIn key={project.slug} y={28}>
                                <ProjectRow
                                    project={project}
                                    position={index}
                                    accent={ACCENTS[index % ACCENTS.length]}
                                    directionTitle={directionTitles.get(project.direction) ?? null}
                                    publications={(project.publications ?? [])
                                        .map((slug) => pubsBySlug.get(slug))
                                        .filter((pub): pub is Publication => Boolean(pub))
                                        .slice(0, MAX_DIRECTION_PUBLICATIONS)}
                                />
                            </AnimateIn>
                        ))}
                    </div>
                ) : (
                    <AnimateIn>
                        <div className="rounded-[1.75rem] border border-dashed border-black/15 px-6 py-12 text-center dark:border-white/15">
                            <p className="text-black/50 dark:text-white/45">No projects yet.</p>
                        </div>
                    </AnimateIn>
                )}
            </section>

            {content.closing_statement ? (
                <AnimateIn>
                    <section className="mx-auto max-w-6xl px-4 pb-14 sm:px-6 sm:pb-16 lg:px-8 lg:pb-20">
                        <div className="border-t border-black/10 pt-8 dark:border-white/12 sm:pt-10">
                            <p className="max-w-4xl text-xl font-medium leading-8 text-black/78 dark:text-white/74 sm:text-2xl sm:leading-9">
                                {content.closing_statement}
                            </p>
                        </div>
                    </section>
                </AnimateIn>
            ) : null}

            <ContinueExploring from="projects" />
        </div>
    );
}
