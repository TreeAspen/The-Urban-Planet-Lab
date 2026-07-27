import { getCollection, type Project } from "@/lib/content";

/** One accent per project slot, reused if more projects are added. */
export const PROJECT_ACCENTS = [
    { tile: "from-cyan-400/28 via-sky-400/16 to-indigo-500/24", dot: "bg-cyan-500 dark:bg-cyan-300" },
    { tile: "from-emerald-400/28 via-teal-400/16 to-cyan-500/24", dot: "bg-emerald-500 dark:bg-emerald-300" },
    { tile: "from-rose-400/28 via-orange-400/18 to-amber-400/26", dot: "bg-rose-500 dark:bg-rose-300" },
    { tile: "from-amber-400/30 via-orange-500/18 to-rose-500/24", dot: "bg-amber-500 dark:bg-amber-300" },
    { tile: "from-violet-400/28 via-fuchsia-400/16 to-sky-500/24", dot: "bg-violet-500 dark:bg-violet-300" },
];

export type ProjectAccent = (typeof PROJECT_ACCENTS)[number];

export function getProjects(): Project[] {
    return getCollection<Project>("projects").sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
}

/** Keeps the accent tied to a project's position, so it matches across pages. */
export function accentFor(index: number): ProjectAccent {
    return PROJECT_ACCENTS[index % PROJECT_ACCENTS.length];
}
