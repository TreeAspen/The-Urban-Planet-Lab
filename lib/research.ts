import { getCollection, type Publication, type ResearchDirection } from "@/lib/content";

/** At most this many papers are listed under a research direction. */
export const MAX_DIRECTION_PUBLICATIONS = 3;

export type DirectionRef = { slug: string; title: string; index: number };

export function getDirections(): ResearchDirection[] {
    return getCollection<ResearchDirection>("research-directions").sort(
        (a, b) => (a.index ?? 99) - (b.index ?? 99)
    );
}

export function getPublications(): Publication[] {
    return getCollection<Publication>("publications").sort((a, b) => b.year - a.year);
}

/**
 * Papers listed in a direction's `publications:` frontmatter, in that order.
 * Slugs with no matching file are skipped, and the list is capped at three —
 * a direction with fewer simply shows fewer.
 */
export function resolveDirectionPublications(
    direction: ResearchDirection,
    publications: Publication[],
    max = MAX_DIRECTION_PUBLICATIONS
): Publication[] {
    const bySlug = new Map(publications.map((pub) => [pub.slug, pub]));
    return (direction.publications ?? [])
        .map((slug) => bySlug.get(slug))
        .filter((pub): pub is Publication => Boolean(pub))
        .slice(0, max);
}

/**
 * Reverse index: publication slug → the research directions that claim it.
 * This is what the Publications page groups by, replacing free-form tags.
 */
export function directionsByPublication(
    directions: ResearchDirection[]
): Record<string, DirectionRef[]> {
    const map: Record<string, DirectionRef[]> = {};
    for (const direction of directions) {
        for (const pubSlug of direction.publications ?? []) {
            (map[pubSlug] ??= []).push({
                slug: direction.slug,
                title: direction.title.trim(),
                index: direction.index,
            });
        }
    }
    return map;
}
