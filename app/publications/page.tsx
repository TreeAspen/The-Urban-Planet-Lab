import { notFound } from "next/navigation";
import { getSiteSettings } from "@/lib/content";
import { directionsByPublication, getDirections, getPublications } from "@/lib/research";
import { getProjects } from "@/lib/projects";
import { AnimateIn } from "@/components/AnimateIn";
import { ContinueExploring } from "@/components/ContinueExploring";
import PublicationList, { type PublicationEntry } from "@/components/PublicationList";

export const metadata = {
    title: "Publications — The Urban Planet Lab",
    description:
        "Peer-reviewed articles, conference papers, and reports from The Urban Planet Lab on urban heat, climate, and environmental justice.",
};

export default function PublicationsPage() {
    if (getSiteSettings().sections.publications === false) notFound();

    const directions = getDirections();
    // Papers reach a direction either directly or through one of its projects.
    const byPublication = directionsByPublication(directions, getProjects());

    // Papers are classified by research direction rather than free-form tags:
    // each direction's `publications:` list is what puts a paper in a bucket.
    const publications: PublicationEntry[] = getPublications().map((pub) => ({
        ...pub,
        directions: byPublication[pub.slug] ?? [],
    }));

    return (
        <div className="relative">
            <section className="mx-auto max-w-6xl px-4 pt-16 pb-8 sm:px-6 sm:pt-20 lg:px-8 lg:pt-24">
                <AnimateIn className="max-w-3xl" y={28}>
                    <h1 className="text-4xl font-semibold tracking-tight text-black dark:text-white sm:text-5xl lg:text-6xl">
                        Publications
                    </h1>
                    <p className="mt-4 text-lg leading-relaxed text-black/75 dark:text-white/72">
                        Peer-reviewed articles, conference papers, and working papers from The Urban Planet Lab.
                        Filter by research direction to see how each paper fits into our work.
                    </p>
                </AnimateIn>
            </section>

            <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
                {publications.length > 0 ? (
                    <PublicationList
                        publications={publications}
                        directions={directions.map((direction) => ({
                            slug: direction.slug,
                            title: direction.title.trim(),
                            index: direction.index,
                        }))}
                    />
                ) : (
                    <AnimateIn>
                        <div className="rounded-[1.75rem] border border-dashed border-black/15 px-6 py-12 text-center dark:border-white/15">
                            <p className="text-black/50 dark:text-white/45">No publications yet.</p>
                        </div>
                    </AnimateIn>
                )}
            </section>

            <ContinueExploring from="publications" />
        </div>
    );
}
