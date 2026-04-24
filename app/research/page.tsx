import Image from "next/image";
import { getPageContent, getCollection, type ResearchContent, type ResearchDirection } from "@/lib/content";
import { AnimateIn, StaggerContainer, StaggerItem } from "@/components/AnimateIn";

export const metadata = {
    title: "Research — The Urban Planet Lab",
};

type AccentTheme = {
    halo: string;
    hoverBorder: string;
    number: string;
    rule: string;
};

const accentThemes: AccentTheme[] = [
    {
        halo: "bg-cyan-500/12 dark:bg-cyan-400/14",
        hoverBorder: "hover:border-cyan-500/25 dark:hover:border-cyan-300/22",
        number: "text-cyan-700/18 dark:text-cyan-200/15",
        rule: "bg-cyan-500 dark:bg-cyan-300",
    },
    {
        halo: "bg-rose-500/12 dark:bg-rose-400/14",
        hoverBorder: "hover:border-rose-500/25 dark:hover:border-rose-300/22",
        number: "text-rose-700/18 dark:text-rose-200/15",
        rule: "bg-rose-500 dark:bg-rose-300",
    },
    {
        halo: "bg-emerald-500/12 dark:bg-emerald-400/14",
        hoverBorder: "hover:border-emerald-500/25 dark:hover:border-emerald-300/22",
        number: "text-emerald-700/18 dark:text-emerald-200/15",
        rule: "bg-emerald-500 dark:bg-emerald-300",
    },
    {
        halo: "bg-amber-500/12 dark:bg-amber-400/14",
        hoverBorder: "hover:border-amber-500/25 dark:hover:border-amber-300/22",
        number: "text-amber-700/18 dark:text-amber-200/15",
        rule: "bg-amber-500 dark:bg-amber-300",
    },
    {
        halo: "bg-violet-500/12 dark:bg-violet-400/14",
        hoverBorder: "hover:border-violet-500/25 dark:hover:border-violet-300/22",
        number: "text-violet-700/18 dark:text-violet-200/15",
        rule: "bg-violet-500 dark:bg-violet-300",
    },
];

function DirectionPanel({
    direction,
    accent,
}: {
    direction: ResearchDirection;
    accent: AccentTheme;
}) {
    return (
        <article
            className={[
                "relative overflow-hidden rounded-[2rem] border border-black/10 bg-white/72 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.05)] backdrop-blur-xl transition duration-300 hover:scale-[1.01] hover:shadow-[0_24px_80px_rgba(15,23,42,0.10)] dark:border-white/15 dark:bg-black/62 dark:shadow-[0_20px_80px_rgba(0,0,0,0.22)] dark:hover:shadow-[0_26px_90px_rgba(0,0,0,0.3)] sm:p-8",
                accent.hoverBorder,
            ].join(" ")}
        >
            <div className={`pointer-events-none absolute right-5 top-5 h-24 w-24 rounded-full blur-3xl ${accent.halo}`} />

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
                </div>
            </div>
        </article>
    );
}

export default function ResearchPage() {
    const content = getPageContent<ResearchContent>("research");
    const directions = getCollection<ResearchDirection>("research-directions")
        .sort((a, b) => a.index - b.index);

    return (
        <div className="relative">
            <section className="mx-auto max-w-6xl px-4 pt-16 pb-12 sm:px-6 sm:pt-20 sm:pb-14 lg:px-8 lg:pt-24 lg:pb-16">
                <AnimateIn y={28} duration={0.7}>
                    <div className="relative overflow-hidden rounded-[2.75rem] border border-black/10 bg-white/68 px-6 py-10 shadow-[0_24px_90px_rgba(15,23,42,0.06)] backdrop-blur-xl dark:border-white/15 dark:bg-black/56 dark:shadow-[0_26px_100px_rgba(0,0,0,0.28)] sm:px-8 sm:py-12 lg:px-12 lg:py-16">
                        <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(15,23,42,0.18),transparent)] dark:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent)]" />
                        <div className="absolute left-0 top-0 h-44 w-44 -translate-x-1/3 -translate-y-1/3 rounded-full bg-sky-400/10 blur-3xl dark:bg-sky-400/12" />
                        <div className="absolute bottom-0 right-0 h-52 w-52 translate-x-1/3 translate-y-1/3 rounded-full bg-emerald-400/10 blur-3xl dark:bg-fuchsia-400/10" />

                        <div className="relative mx-auto max-w-4xl">
                            {content.main_heading ? (
                                <h1 className="text-balance text-4xl font-semibold tracking-tight text-black dark:text-white sm:text-5xl lg:text-[4.4rem] lg:leading-[0.9]">
                                    {content.main_heading}
                                </h1>
                            ) : null}

                            {content.hero_image ? (
                                <div className="mt-8 overflow-hidden rounded-[2rem] border border-black/10 bg-white/60 shadow-[0_22px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-white/15 dark:bg-black/50 dark:shadow-[0_26px_90px_rgba(0,0,0,0.28)]">
                                    <Image
                                        src={content.hero_image}
                                        alt={content.hero_image_alt || content.main_heading}
                                        width={1600}
                                        height={900}
                                        priority
                                        sizes="(min-width: 1024px) 896px, (min-width: 640px) 90vw, 100vw"
                                        className="h-auto w-full object-cover"
                                    />
                                </div>
                            ) : null}

                            {content.description ? (
                                <p className="mt-8 text-lg leading-8 text-black/78 dark:text-white/74 lg:text-[1.15rem]">
                                    {content.description}
                                </p>
                            ) : null}
                        </div>
                    </div>
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
        </div>
    );
}
