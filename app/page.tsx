import Link from "next/link";
import { marked } from "marked";
import {
    getCollection,
    getPageContent,
    getSiteSettings,
    publicFileExists,
    type HomeContent,
    type Place,
} from "@/lib/content";
import HeroBanner from "@/components/HeroBanner";
import { AnimateIn, StaggerContainer, StaggerItem } from "@/components/AnimateIn";
import { ContinueExploring } from "@/components/ContinueExploring";
import MeaningfulMapClient from "@/components/MeaningfulMapClient";
import { Icon } from "@/components/Icons";

export const metadata = {
    title: "The Urban Planet Lab",
};

export default function Home() {
    const content = getPageContent<HomeContent>("home");
    // The lab office always leads the list; everyone else follows by year.
    const places = getCollection<Place>("places").sort((a, b) => {
        if (a.is_office !== b.is_office) return a.is_office ? -1 : 1;
        return (a.year ?? 0) - (b.year ?? 0);
    });
    const { sections } = getSiteSettings();
    const descriptionHtml = content.description ? (marked.parse(content.description) as string) : "";

    return (
        <div className="relative">
            <HeroBanner
                src={publicFileExists(content.hero_image) ? content.hero_image : null}
                alt={content.hero_image_alt || content.main_heading}
            />

            <section className="mx-auto max-w-6xl px-4 pt-10 pb-12 sm:px-6 sm:pt-12 sm:pb-14 lg:px-8 lg:pt-16 lg:pb-16">
                <div className="max-w-3xl">
                    {content.tagline ? (
                        <AnimateIn delay={0.1}>
                            <p className="inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase text-black/60 dark:text-white/60">
                                {content.tagline}
                            </p>
                        </AnimateIn>
                    ) : null}

                    {/* <AnimateIn delay={0.15}>
                        <div className="mt-3 inline-flex items-center rounded-lg border border-black/10 bg-white/90 px-3 py-1.5 shadow-[0_2px_10px_rgba(15,23,42,0.06)]">
                            <Image
                                src="/uploads/nyu-cusp-logo.png"
                                alt="NYU Center for Urban Science and Progress"
                                width={194}
                                height={32}
                                className="h-6 w-auto sm:h-7"
                            />
                        </div>
                    </AnimateIn> */}

                    <AnimateIn delay={0.2} y={32}>
                        <h1 className="mt-5 text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-[0.95] text-black dark:text-white">
                            {content.main_heading}
                        </h1>
                    </AnimateIn>
                </div>

                {descriptionHtml ? (
                    <AnimateIn delay={0.4}>
                        {/* Markdown so links (e.g. CUSP, MAE) can be written inline in the admin. */}
                        <div
                            className="mt-6 text-lg leading-relaxed text-black/80 dark:text-white/75 sm:text-xl [&_a]:text-inherit [&_a]:underline [&_a]:decoration-black/35 [&_a]:underline-offset-4 [&_a]:transition-colors hover:[&_a]:text-[#57068C] hover:[&_a]:decoration-[#57068C] dark:[&_a]:decoration-white/45 dark:hover:[&_a]:text-[#c39bec] dark:hover:[&_a]:decoration-[#c39bec] [&_p+p]:mt-4"
                            dangerouslySetInnerHTML={{ __html: descriptionHtml }}
                        />
                    </AnimateIn>
                ) : null}

                <AnimateIn delay={0.5}>
                    <div className="mt-8 flex flex-wrap gap-3">
                        <Link
                            href="/research"
                            className="rounded-full px-5 py-2.5 text-sm font-medium bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90 transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
                        >
                            Explore Research
                        </Link>
                        <Link
                            href="/people"
                            className="rounded-full px-5 py-2.5 text-sm font-medium border border-black/20 dark:border-white/25 text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/15 transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
                        >
                            Meet the Team
                        </Link>
                    </div>
                </AnimateIn>
            </section>

            {content.cards && content.cards.length > 0 ? (
                <section className="mx-auto max-w-6xl px-4 pb-14 sm:px-6 sm:pb-16 lg:px-8 lg:pb-20">
                    <StaggerContainer className="grid items-stretch gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {content.cards.map((card, index) => (
                            <StaggerItem key={index} className="h-full">
                                <div className="h-full rounded-2xl border border-black/10 dark:border-white/15 bg-white/70 dark:bg-black/60 backdrop-blur-xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_16px_50px_rgba(15,23,42,0.08)] dark:hover:shadow-[0_16px_50px_rgba(0,0,0,0.25)]">
                                    <h3 className="text-lg font-semibold text-black dark:text-white">
                                        {card.title}
                                    </h3>
                                    <p className="mt-2 text-sm text-black/75 dark:text-white/75">
                                        {card.description}
                                    </p>
                                </div>
                            </StaggerItem>
                        ))}
                    </StaggerContainer>
                </section>
            ) : null}

            {sections.home_places !== false ? (
                <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-20">
                    <AnimateIn>
                        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                            <div>
                                {/* <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/55 dark:text-white/55">
                                    Places that have shaped us
                                </p> */}
                                <h2 className="mt-2 text-3l font-semibold tracking-tight text-black dark:text-white sm:text-4xl">
                                    Cities that shaped us
                                </h2>
                                <p className="mt-3 max-w-2xl text-base leading-relaxed text-black/70 dark:text-white/65">
                                    The first pin is where you can find us — our office at NYU CUSP in Brooklyn.
                                    Beyond it, every member has a place that changed how they think about cities.
                                    Click a pin to read why
                                    {/* <a href="/admin" className="underline underline-offset-4 hover:text-black dark:hover:text-white">
                                        admin
                                    </a> */}
                                </p>
                            </div>
                        </div>
                    </AnimateIn>
                    <AnimateIn delay={0.1} y={16}>
                        <MeaningfulMapClient places={places} />
                    </AnimateIn>
                </section>
            ) : null}

            <ContinueExploring from="home" />
        </div>
    );
}
