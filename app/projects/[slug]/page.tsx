import Link from "next/link";
import { notFound } from "next/navigation";
import { marked } from "marked";
import { getSiteSettings, type Project, type Publication } from "@/lib/content";
import { getDirections, getPublications } from "@/lib/research";
import { accentFor, getProjects } from "@/lib/projects";
import { AnimateIn } from "@/components/AnimateIn";
import { Icon } from "@/components/Icons";
import { MediaTile } from "@/components/MediaTile";

/** Position matters: it drives the accent colour and the placeholder number. */
function findProject(slug: string): { project: Project; position: number } | null {
    const projects = getProjects();
    const position = projects.findIndex((p) => p.slug === slug);
    return position === -1 ? null : { project: projects[position], position };
}

export function generateStaticParams() {
    return getProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const found = findProject(slug);
    if (!found) return { title: "Project — The Urban Planet Lab" };
    return {
        title: `${found.project.title} — The Urban Planet Lab`,
        description: found.project.tagline || found.project.description,
    };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
    if (getSiteSettings().sections.projects === false) notFound();

    const { slug } = await params;
    const found = findProject(slug);
    if (!found) notFound();

    const { project, position } = found;
    const accent = accentFor(position);

    const direction = getDirections().find((d) => d.slug === project.direction) ?? null;
    const pubsBySlug = new Map(getPublications().map((pub) => [pub.slug, pub]));
    const publications = (project.publications ?? [])
        .map((pubSlug) => pubsBySlug.get(pubSlug))
        .filter((pub): pub is Publication => Boolean(pub));

    // The markdown body is the long write-up; the description is the summary
    // that also appears on the Projects list.
    const bodyHtml = project.body ? (marked.parse(project.body) as string) : "";

    return (
        <div className="relative">
            <section className="mx-auto max-w-5xl px-4 pt-16 pb-20 sm:px-6 sm:pt-20 lg:px-8 lg:pt-24">
                <AnimateIn>
                    <Link
                        href="/projects"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-black/60 transition-colors hover:text-black dark:text-white/55 dark:hover:text-white"
                    >
                        ← Back to Projects
                    </Link>
                </AnimateIn>

                <AnimateIn delay={0.1} y={20}>
                    <div className="mt-6 flex flex-wrap items-center gap-2.5">
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

                    <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight text-black dark:text-white sm:text-5xl">
                        {project.title}
                    </h1>

                    {project.tagline ? (
                        <p className="mt-3 text-xl italic leading-relaxed text-black/60 dark:text-white/55">
                            {project.tagline}
                        </p>
                    ) : null}
                </AnimateIn>

                <AnimateIn delay={0.15} y={16}>
                    <div className="mt-8">
                        <MediaTile
                            src={project.image}
                            alt={project.image_alt || project.title}
                            index={position + 1}
                            accent={accent.tile}
                            className="aspect-[16/9]"
                            sizes="(min-width: 1024px) 896px, 100vw"
                            priority
                        />
                    </div>
                </AnimateIn>

                <AnimateIn delay={0.2}>
                    {project.description ? (
                        <p className="mt-10 text-lg leading-8 text-black/80 dark:text-white/75">
                            {project.description}
                        </p>
                    ) : null}

                    {bodyHtml ? (
                        <div
                            className="prose prose-neutral mt-8 max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-black prose-a:underline-offset-4 dark:prose-invert dark:prose-a:text-white"
                            dangerouslySetInnerHTML={{ __html: bodyHtml }}
                        />
                    ) : null}
                </AnimateIn>

                <AnimateIn delay={0.25}>
                    <dl className="mt-12 grid gap-6 border-t border-black/10 pt-8 dark:border-white/12 sm:grid-cols-2">
                        {project.partners ? (
                            <div>
                                <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/45 dark:text-white/40">
                                    Partners
                                </dt>
                                <dd className="mt-2 text-sm leading-relaxed text-black/70 dark:text-white/65">
                                    {project.partners}
                                </dd>
                            </div>
                        ) : null}

                        {direction ? (
                            <div>
                                <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/45 dark:text-white/40">
                                    Research direction
                                </dt>
                                <dd className="mt-2 text-sm leading-relaxed">
                                    <Link
                                        href={`/research#${direction.slug}`}
                                        className="inline-flex items-center gap-1.5 text-black/70 underline underline-offset-4 transition-colors hover:text-black dark:text-white/65 dark:hover:text-white"
                                    >
                                        {direction.title.trim()}
                                        <Icon name="arrow" />
                                    </Link>
                                </dd>
                            </div>
                        ) : null}
                    </dl>
                </AnimateIn>

                {publications.length > 0 ? (
                    <AnimateIn delay={0.3}>
                        <div className="mt-10 border-t border-black/10 pt-8 dark:border-white/12">
                            <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/45 dark:text-white/40">
                                Publications from this project
                            </h2>
                            <ul className="mt-4 space-y-3">
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
                                                <span className="text-black/45 dark:text-white/40">
                                                    {pub.venue ? ` · ${pub.venue}` : ""}
                                                    {pub.year ? ` (${pub.year})` : ""}
                                                </span>
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </AnimateIn>
                ) : null}
            </section>
        </div>
    );
}
