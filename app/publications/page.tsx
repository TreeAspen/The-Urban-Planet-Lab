import { getCollection, type Publication } from "@/lib/content";
import { AnimateIn, StaggerContainer, StaggerItem } from "@/components/AnimateIn";

export const metadata = {
    title: "Publications — The Urban Planet Lab",
};

const PUB_TYPE_LABELS: Record<string, string> = {
    journal: "Journal",
    conference: "Conference",
    book_chapter: "Book Chapter",
    report: "Report",
};

function PublicationEntry({ pub }: { pub: Publication }) {
    const typeLabel = pub.pub_type ? PUB_TYPE_LABELS[pub.pub_type] : null;

    return (
        <div className="group relative py-7 first:pt-2">
            <div className="flex items-start gap-4">
                <div className="min-w-0 flex-1">
                    <p className="text-sm text-black/60 dark:text-white/55">{pub.authors}</p>

                    <h3 className="mt-1 text-base font-semibold leading-snug text-black dark:text-white sm:text-[1.05rem]">
                        {pub.doi_url ? (
                            <a
                                href={pub.doi_url}
                                target="_blank"
                                rel="noreferrer"
                                className="transition-colors duration-150 hover:text-black/70 dark:hover:text-white/80"
                            >
                                {pub.title}
                            </a>
                        ) : (
                            pub.title
                        )}
                    </h3>

                    <p className="mt-1 text-sm italic text-black/60 dark:text-white/55">
                        {pub.venue}
                        {pub.details ? <span className="not-italic">, {pub.details}</span> : null}
                    </p>

                    <div className="mt-2.5 flex flex-wrap items-center gap-2">
                        {typeLabel ? (
                            <span className="rounded-full border border-black/12 px-2.5 py-0.5 text-xs font-medium text-black/55 dark:border-white/18 dark:text-white/50">
                                {typeLabel}
                            </span>
                        ) : null}
                        {pub.tags?.map((tag) => (
                            <span
                                key={tag}
                                className="rounded-full bg-black/5 px-2.5 py-0.5 text-xs text-black/60 dark:bg-white/8 dark:text-white/55"
                            >
                                {tag}
                            </span>
                        ))}
                        {pub.pdf_url ? (
                            <a
                                href={pub.pdf_url}
                                target="_blank"
                                rel="noreferrer"
                                className="ml-auto rounded-full border border-black/15 px-3 py-0.5 text-xs font-medium text-black/65 transition-all duration-200 hover:border-black/30 hover:text-black hover:scale-[1.04] dark:border-white/20 dark:text-white/60 dark:hover:border-white/35 dark:hover:text-white"
                            >
                                PDF
                            </a>
                        ) : null}
                        {pub.doi_url ? (
                            <a
                                href={pub.doi_url}
                                target="_blank"
                                rel="noreferrer"
                                className={[
                                    "rounded-full border border-black/15 px-3 py-0.5 text-xs font-medium text-black/65 transition-all duration-200 hover:border-black/30 hover:text-black hover:scale-[1.04] dark:border-white/20 dark:text-white/60 dark:hover:border-white/35 dark:hover:text-white",
                                    pub.pdf_url ? "" : "ml-auto",
                                ].join(" ")}
                            >
                                DOI
                            </a>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function PublicationsPage() {
    const publications = getCollection<Publication>("publications").sort(
        (a, b) => b.year - a.year
    );

    const byYear = publications.reduce<Record<number, Publication[]>>((acc, pub) => {
        const year = pub.year ?? 0;
        if (!acc[year]) acc[year] = [];
        acc[year].push(pub);
        return acc;
    }, {});

    const years = Object.keys(byYear)
        .map(Number)
        .sort((a, b) => b - a);

    return (
        <div className="relative">
            <section className="mx-auto max-w-6xl px-4 pt-16 pb-8 sm:px-6 sm:pt-20 lg:px-8 lg:pt-24">
                <AnimateIn className="max-w-3xl" y={28}>
                    <h1 className="text-4xl font-semibold tracking-tight text-black dark:text-white sm:text-5xl lg:text-6xl">
                        Publications
                    </h1>
                    <p className="mt-4 text-lg leading-relaxed text-black/75 dark:text-white/72">
                        Peer-reviewed articles, conference papers, and working papers from The Urban Planet Lab.
                    </p>
                </AnimateIn>
            </section>

            <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
                {years.length > 0 ? (
                    <StaggerContainer className="space-y-10" staggerDelay={0.12}>
                        {years.map((year) => (
                            <StaggerItem key={year} y={16}>
                                <div className="grid gap-0 lg:grid-cols-[80px_minmax(0,1fr)] lg:gap-10">
                                    <div className="mb-3 lg:mb-0 lg:pt-5">
                                        <span className="text-2xl font-semibold text-black/25 dark:text-white/22">
                                            {year}
                                        </span>
                                    </div>

                                    <div className="divide-y divide-black/8 rounded-[1.75rem] border border-black/10 bg-white/70 px-6 backdrop-blur-xl dark:divide-white/10 dark:border-white/15 dark:bg-black/60 sm:px-7">
                                        {byYear[year].map((pub) => (
                                            <PublicationEntry key={pub.slug} pub={pub} />
                                        ))}
                                    </div>
                                </div>
                            </StaggerItem>
                        ))}
                    </StaggerContainer>
                ) : (
                    <AnimateIn>
                        <div className="rounded-[1.75rem] border border-dashed border-black/15 px-6 py-12 text-center dark:border-white/15">
                            <p className="text-black/50 dark:text-white/45">No publications yet.</p>
                        </div>
                    </AnimateIn>
                )}
            </section>
        </div>
    );
}
