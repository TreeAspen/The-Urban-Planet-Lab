import Image from "next/image";
import { notFound } from "next/navigation";
import {
    getCollection,
    getPageContent,
    getSiteSettings,
    type NewsItem,
    type NewsPageContent,
} from "@/lib/content";
import { AnimateIn } from "@/components/AnimateIn";
import { ContinueExploring } from "@/components/ContinueExploring";

export const metadata = {
    title: "News — The Urban Planet Lab",
    description:
        "Updates on publications, grants, events, and lab life at The Urban Planet Lab.",
};

function formatDate(dateStr: string) {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function NewsRow({ item }: { item: NewsItem }) {
    const inner = (
        <div className="group flex flex-col gap-4 py-6 first:pt-2 sm:flex-row sm:items-center sm:gap-6">
            {item.cover_image ? (
                <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-xl sm:h-24 sm:w-40">
                    <Image
                        src={item.cover_image}
                        alt={item.cover_image_alt || item.title}
                        fill
                        sizes="(min-width: 640px) 160px, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                </div>
            ) : null}

            <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                    <time
                        dateTime={item.date}
                        className="text-xs font-medium uppercase tracking-[0.15em] text-black/50 dark:text-white/45"
                    >
                        {formatDate(item.date)}
                    </time>
                    {item.featured ? (
                        <span className="inline-flex rounded-full bg-black/8 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-widest text-black/60 dark:bg-white/10 dark:text-white/55">
                            Featured
                        </span>
                    ) : null}
                </div>

                <h2 className="mt-1.5 text-base font-semibold leading-snug text-black dark:text-white sm:text-lg">
                    {item.title}
                </h2>

                {item.summary ? (
                    <p className="mt-1.5 text-sm leading-relaxed text-black/70 dark:text-white/65">
                        {item.summary}
                    </p>
                ) : null}

                {item.link ? (
                    <span className="mt-2 inline-block text-xs font-semibold uppercase tracking-[0.12em] text-black/50 transition-colors group-hover:text-black dark:text-white/45 dark:group-hover:text-white">
                        Read more →
                    </span>
                ) : null}
            </div>
        </div>
    );

    if (item.link) {
        return (
            <a href={item.link} target="_blank" rel="noreferrer" className="block">
                {inner}
            </a>
        );
    }

    return inner;
}

/** Lab group photo. Until one is uploaded, a blank framed placeholder holds the spot. */
function LabPhoto({ content }: { content: NewsPageContent }) {
    return (
        <AnimateIn delay={0.1} y={16}>
            <figure className="mt-10">
                {content.lab_photo ? (
                    <div className="overflow-hidden rounded-[2rem] border border-black/10 bg-white/60 shadow-[0_22px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-white/15 dark:bg-black/50 dark:shadow-[0_26px_90px_rgba(0,0,0,0.28)]">
                        <Image
                            src={content.lab_photo}
                            alt={content.lab_photo_alt || "The Urban Planet Lab"}
                            width={1600}
                            height={900}
                            priority
                            sizes="(min-width: 1024px) 1120px, 100vw"
                            className="h-auto w-full object-cover"
                        />
                    </div>
                ) : (
                    <div className="flex aspect-[16/7] w-full items-center justify-center rounded-[2rem] border border-dashed border-black/15 bg-white/40 dark:border-white/15 dark:bg-black/30">
                        <span className="text-sm text-black/40 dark:text-white/35">
                            Lab photo — add one in the admin
                        </span>
                    </div>
                )}
                {content.lab_photo_caption ? (
                    <figcaption className="mt-3 text-sm text-black/55 dark:text-white/50">
                        {content.lab_photo_caption}
                    </figcaption>
                ) : null}
            </figure>
        </AnimateIn>
    );
}

export default function NewsPage() {
    if (getSiteSettings().sections.news === false) notFound();

    const pageContent = getPageContent<NewsPageContent>("news");
    const allNews = getCollection<NewsItem>("news").sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    return (
        <div className="relative">
            <section className="mx-auto max-w-6xl px-4 pt-16 pb-8 sm:px-6 sm:pt-20 lg:px-8 lg:pt-24">
                <AnimateIn className="max-w-3xl" y={28}>
                    <h1 className="text-4xl font-semibold tracking-tight text-black dark:text-white sm:text-5xl lg:text-6xl">
                        News
                    </h1>
                    <p className="mt-4 text-lg leading-relaxed text-black/75 dark:text-white/72">
                        Updates on publications, grants, events, and lab life.
                    </p>
                </AnimateIn>

                <LabPhoto content={pageContent} />
            </section>

            <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
                {allNews.length > 0 ? (
                    <AnimateIn delay={0.1} y={16}>
                        <div className="divide-y divide-black/8 rounded-[1.75rem] border border-black/10 bg-white/70 px-6 backdrop-blur-xl dark:divide-white/10 dark:border-white/15 dark:bg-black/60 sm:px-7">
                            {allNews.map((item) => (
                                <NewsRow key={item.slug} item={item} />
                            ))}
                        </div>
                    </AnimateIn>
                ) : (
                    <AnimateIn>
                        <div className="rounded-[1.75rem] border border-dashed border-black/15 px-6 py-12 text-center dark:border-white/15">
                            <p className="text-black/50 dark:text-white/45">No news items yet.</p>
                        </div>
                    </AnimateIn>
                )}
            </section>

            <ContinueExploring from="news" />
        </div>
    );
}
