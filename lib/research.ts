import { getCollection, type Project, type Publication, type ResearchDirection } from "@/lib/content";

/** At most this many papers are listed alongside a project in a list view. */
export const MAX_LISTED_PUBLICATIONS = 3;

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
 * Reverse index: publication slug → the research directions it belongs to.
 *
 * Papers reach a direction two ways — listed on the direction itself, or listed
 * on one of its projects. The Research page links to projects rather than
 * papers, so the project route is the one that matters day to day; the direct
 * list stays supported for papers that predate a project.
 */
export function directionsByPublication(
    directions: ResearchDirection[],
    projects: Project[]
): Record<string, DirectionRef[]> {
    const map: Record<string, DirectionRef[]> = {};

    const add = (pubSlug: string, direction: ResearchDirection) => {
        const refs = (map[pubSlug] ??= []);
        if (refs.some((ref) => ref.slug === direction.slug)) return;
        refs.push({ slug: direction.slug, title: direction.title.trim(), index: direction.index });
    };

    for (const direction of directions) {
        for (const pubSlug of direction.publications ?? []) add(pubSlug, direction);

        for (const project of projects) {
            if (project.direction !== direction.slug) continue;
            for (const pubSlug of project.publications ?? []) add(pubSlug, direction);
        }
    }

    return map;
}
