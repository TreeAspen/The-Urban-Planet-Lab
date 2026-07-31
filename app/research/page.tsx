import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPageContent, getSiteSettings, type Project, type ResearchContent, type ResearchDirection } from "@/lib/content";
import { getDirections } from "@/lib/research";
import { getProjects, projectsByDirection } from "@/lib/projects";
import { AnimateIn, StaggerContainer, StaggerItem } from "@/components/AnimateIn";
import { ContinueExploring } from "@/components/ContinueExploring";
import { Icon } from "@/components/Icons";
import { MediaTile } from "@/components/MediaTile";

export const metadata = {
    title: "Research — The Urban Planet Lab",
    description:
        "Research directions of The Urban Planet Lab, spanning urban heat, climate resilience, environmental justice, and urban data science.",
};

type AccentTheme = {
    halo: string;
    hoverBorder: string;
    number: string;
    rule: string;
    /** Gradient behind the placeholder tile when no image is uploaded. */
    tile: string;
};

const accentThemes: AccentTheme[] = [
    {
        halo: "bg-cyan-500/12 dark:bg-cyan-400/14",
        hoverBorder: "hover:border-cyan-500/25 dark:hover:border-cyan-300/22",
        number: "text-cyan-700/18 dark:text-cyan-200/15",
        rule: "bg-cyan-500 dark:bg-cyan-300",
        tile: "from-cyan-400/28 via-sky-400/16 to-indigo-500/24",
    },
    {
        halo: "bg-rose-500/12 dark:bg-rose-400/14",
        hoverBorder: "hover:border-rose-500/25 dark:hover:border-rose-300/22",
        number: "text-rose-700/18 dark:text-rose-200/15",
        rule: "bg-rose-500 dark:bg-rose-300",
        tile: "from-rose-400/28 via-orange-400/18 to-amber-400/26",
    },
    {
        halo: "bg-emerald-500/12 dark:bg-emerald-400/14",
        hoverBorder: "hover:border-emerald-500/25 dark:hover:border-emerald-300/22",
        number: "text-emerald-700/18 dark:text-emerald-200/15",
        rule: "bg-emerald-500 dark:bg-emerald-300",
        tile: "from-emerald-400/28 via-teal-400/16 to-cyan-500/24",
    },
    {
        halo: "bg-amber-500/12 dark:bg-amber-400/14",
        hoverBorder: "hover:border-amber-500/25 dark:hover:border-amber-300/22",
        number: "text-amber-700/18 dark:text-amber-200/15",
        rule: "bg-amber-500 dark:bg-amber-300",
        tile: "from-amber-400/30 via-orange-500/18 to-rose-500/24",
    },
    {
        halo: "bg-violet-500/12 dark:bg-violet-400/14",
        hoverBorder: "hover:border-violet-500/25 dark:hover:border-violet-300/22",
        number: "text-violet-700/18 dark:text-violet-200/15",
        rule: "bg-violet-500 dark:bg-violet-300",
        tile: "from-violet-400/28 via-fuchsia-400/16 to-sky-500/24",
    },
];

/**
 * A direction links to its projects; the papers hang off the projects, so the
 * chain reads direction → project → publication.
 */
function DirectionProjects({ projects }: { projects: Project[] }) {
    if (projects.length === 0) return null;

    return (
        <div className="mt-6 border-t border-black/8 pt-5 dark:border-white/10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/45 dark:text-white/40">
                {projects.length > 1 ? "Projects" : "Project"}
            </p>
            <ul className="mt-3 space-y-2">
                {projects.map((project) => (
                    <li key={project.slug}>
                        <Link
                            href={`/projects/${project.slug}`}
                            className="group flex items-start gap-2.5 text-sm leading-relaxed text-black/70 transition-colors hover:text-black dark:text-white/65 dark:hover:text-white"
                        >
                            <Icon name="project" className="mt-0.5 h-4 w-4 shrink-0 opacity-55" />
                            <span>
                                <span className="font-medium underline-offset-4 group-hover:underline">
                                    {project.title}
                                </span>
                                {project.tagline ? (
                                    <span className="text-black/45 dark:text-white/40"> — {project.tagline}</span>
                                ) : null}
                            </span>
                            <Icon
                                name="arrow"
                                className="mt-0.5 h-4 w-4 shrink-0 opacity-0 transition-opacity duration-200 group-hover:opacity-55"
                            />
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function DirectionPanel({
    direction,
    accent,
    projects,
    showImage,
}: {
    direction: ResearchDirection;
    accent: AccentTheme;
    projects: Project[];
    showImage: boolean;
}) {
    return (
        <article
            id={direction.slug}
            className={[
                "scroll-mt-28",
                "relative overflow-hidden rounded-[2rem] border border-black/10 bg-white/72 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.05)] backdrop-blur-xl transition duration-300 hover:scale-[1.01] hover:shadow-[0_24px_80px_rgba(15,23,42,0.10)] dark:border-white/15 dark:bg-black/62 dark:shadow-[0_20px_80px_rgba(0,0,0,0.22)] dark:hover:shadow-[0_26px_90px_rgba(0,0,0,0.3)] sm:p-8",
                accent.hoverBorder,
            ].join(" ")}
        >
            <div className={`pointer-events-none absolute right-5 top-5 h-24 w-24 rounded-full blur-3xl ${accent.halo}`} />

            {showImage ? (
                <div className="relative mb-6 sm:mb-8">
                    <MediaTile
                        src={direction.image}
                        alt={direction.image_alt || direction.title}
                        index={direction.index}
                        accent={accent.tile}
                        className="aspect-[16/7]"
                        sizes="(min-width: 1024px) 660px, 100vw"
                    />
                </div>
            ) : null}

            <div className="relative grid gap-6 lg:grid-cols-[92px_minmax(0,1fr)] lg:gap-8">
                <div className="flex items-start justify-between lg:block">
                    <span className={`text-5xl font-semibold tracking-[-0.08em] sm:text-6xl ${accent.number}`}>
                        {String(direction.index).padStart(2, "0")}
                    </span>
                    <span className={`mt-3 block h-1.5 w-14 rounded-full ${accent.rule} lg:mt-6`} />
                </div>

                <div>
                    <h3 className="max-w-3xl text-2xl font-semibold leading-tight text-black dark:text-white sm:text-[1.9rem]">
                        {direction.title}
                    </h3>
                    <p className="mt-5 max-w-3xl text-base leading-8 text-black/76 dark:text-white/74">
                        {direction.description}
                    </p>
                    <DirectionProjects projects={projects} />
                </div>
            </div>
        </article>
    );
}

export default function ResearchPage() {
    const settings = getSiteSettings();
    if (settings.sections.research === false) notFound();

    const content = getPageContent<ResearchContent>("research");
    const directions = getDirections();
    const byDirection = projectsByDirection(getProjects());

    return (
        <div className="relative">
            {/* Plain page header, matching Projects and People — no panel. */}
            <section className="mx-auto max-w-6xl px-4 pt-16 pb-10 sm:px-6 sm:pt-20 lg:px-8 lg:pt-24">
                <AnimateIn y={28} duration={0.7}>
                    {content.main_heading ? (
                        <h1 className="max-w-4xl text-balance text-4xl font-semibold tracking-tight text-black dark:text-white sm:text-5xl lg:text-6xl">
                            {content.main_heading}
                        </h1>
                    ) : null}

                    {content.description ? (
                        <p className="mt-6 max-w-3xl text-lg leading-8 text-black/78 dark:text-white/74">
                            {content.description}
                        </p>
                    ) : null}

                    {content.hero_image ? (
                        <div className="mt-8 overflow-hidden rounded-[2rem] border border-black/10 bg-white/60 dark:border-white/15 dark:bg-black/50">
                            <Image
                                src={content.hero_image}
                                alt={content.hero_image_alt || content.main_heading}
                                width={1600}
                                height={900}
                                priority
                                sizes="(min-width: 1024px) 1120px, 100vw"
                                className="h-auto w-full object-cover"
                            />
                        </div>
                    ) : null}
                </AnimateIn>
            </section>

            {(content.section_title || content.section_description || directions.length > 0) ? (
                <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 sm:pb-14 lg:px-8 lg:pb-16">
                    <div className="grid gap-8 lg:grid-cols-[minmax(240px,0.42fr)_minmax(0,1fr)] lg:gap-12">
                        <AnimateIn className="lg:sticky lg:top-28 lg:self-start">
                            {content.section_title ? (
                                <h2 className="text-3xl font-semibold tracking-tight text-black dark:text-white sm:text-4xl">
                                    {content.section_title}
                                </h2>
                            ) : null}
                            {content.section_description ? (
                                <p className="mt-4 max-w-sm text-base leading-8 text-black/74 dark:text-white/72 sm:text-lg">
                                    {content.section_description}
                                </p>
                            ) : null}
                        </AnimateIn>

                        {directions.length > 0 ? (
                            <StaggerContainer className="space-y-5">
                                {directions.map((direction, index) => (
                                    <StaggerItem key={direction.slug} y={24}>
                                        <DirectionPanel
                                            direction={direction}
                                            accent={accentThemes[index % accentThemes.length]}
                                            projects={byDirection[direction.slug] ?? []}
                                            showImage={settings.research_images}
                                        />
                                    </StaggerItem>
                                ))}
                            </StaggerContainer>
                        ) : null}
                    </div>
                </section>
            ) : null}

            {content.closing_statement ? (
                <AnimateIn>
                    <section className="mx-auto max-w-6xl px-4 pb-14 sm:px-6 sm:pb-16 lg:px-8 lg:pb-20">
                        <div className="border-t border-black/10 pt-8 dark:border-white/12 sm:pt-10">
                            <p className="max-w-5xl text-xl font-medium leading-8 text-black/78 dark:text-white/74 sm:text-2xl sm:leading-9">
                                {content.closing_statement}
                            </p>
                        </div>
                    </section>
                </AnimateIn>
            ) : null}

            <ContinueExploring from="research" />
        </div>
    );
}
