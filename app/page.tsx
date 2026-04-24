import Image from "next/image";
import { getPageContent, type HomeContent } from "@/lib/content";
import { AnimateIn, StaggerContainer, StaggerItem } from "@/components/AnimateIn";

export const metadata = {
    title: "The Urban Planet Lab",
};

export default function Home() {
    const content = getPageContent<HomeContent>("home");

    return (
        <div className="relative">
            <section className="mx-auto max-w-6xl px-4 pt-16 pb-12 sm:px-6 sm:pt-20 sm:pb-14 lg:px-8 lg:pt-24 lg:pb-16">
                <div className="max-w-3xl">
                    {content.tagline ? (
                        <AnimateIn delay={0.1}>
                            <p className="inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase text-black/60 dark:text-white/60">
                                {content.tagline}
                            </p>
                        </AnimateIn>
                    ) : null}

                    <AnimateIn delay={0.2} y={32}>
                        <h1 className="mt-5 text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-[0.95] text-black dark:text-white">
                            {content.main_heading}
                        </h1>
                    </AnimateIn>
                </div>

                {content.hero_image ? (
                    <AnimateIn delay={0.35} y={20}>
                        <div className="mt-8 overflow-hidden rounded-[2rem] border border-black/10 bg-white/60 shadow-[0_22px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-white/15 dark:bg-black/50 dark:shadow-[0_26px_90px_rgba(0,0,0,0.28)]">
                            <Image
                                src={content.hero_image}
                                alt={content.hero_image_alt || content.main_heading}
                                width={1600}
                                height={900}
                                priority
                                sizes="(min-width: 1024px) 1120px, (min-width: 640px) 90vw, 100vw"
                                className="h-auto w-full object-cover"
                            />
                        </div>
                    </AnimateIn>
                ) : null}

                {content.description ? (
                    <AnimateIn delay={0.4}>
                        <p className="mt-6 text-lg sm:text-xl leading-relaxed text-black/80 dark:text-white/75">
                            {content.description}
                        </p>
                    </AnimateIn>
                ) : null}

                <AnimateIn delay={0.5}>
                    <div className="mt-8 flex flex-wrap gap-3">
                        <a
                            href="/research"
                            className="rounded-full px-5 py-2.5 text-sm font-medium bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90 transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
                        >
                            Explore Research
                        </a>
                        <a
                            href="/people"
                            className="rounded-full px-5 py-2.5 text-sm font-medium border border-black/20 dark:border-white/25 text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/15 transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
                        >
                            Meet the Team
                        </a>
                    </div>
                </AnimateIn>
            </section>

            {content.cards && content.cards.length > 0 ? (
                <section className="mx-auto max-w-6xl px-4 pb-14 sm:px-6 sm:pb-16 lg:px-8 lg:pb-20">
                    <StaggerContainer className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {content.cards.map((card, index) => (
                            <StaggerItem key={index}>
                                <div className="rounded-2xl border border-black/10 dark:border-white/15 bg-white/70 dark:bg-black/60 backdrop-blur-xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_16px_50px_rgba(15,23,42,0.08)] dark:hover:shadow-[0_16px_50px_rgba(0,0,0,0.25)]">
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
        </div>
    );
}
