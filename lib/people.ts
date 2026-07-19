import type { Person } from "@/lib/content";

export const CATEGORY_CONFIG: {
    key: Person["category"];
    label: string;
    layout: "faculty" | "grid" | "rows";
}[] = [
    { key: "faculty", label: "Faculty", layout: "faculty" },
    { key: "phd", label: "PhD Students", layout: "grid" },
    { key: "master", label: "Master Students", layout: "grid" },
    { key: "undergrad", label: "Undergraduate Students", layout: "grid" },
    { key: "highschool", label: "High School Students", layout: "grid" },
    { key: "external", label: "External Friends", layout: "grid" },
    { key: "alumni", label: "Alumni", layout: "rows" },
];

export const CATEGORY_LABELS: Record<Person["category"], string> = Object.fromEntries(
    CATEGORY_CONFIG.map((c) => [c.key, c.label])
) as Record<Person["category"], string>;

export type PersonLink = { href: string; label: string; external?: boolean };

export const MAX_PERSON_LINKS = 3;

/** Priority order: whichever of these a person has filled in, the first three win. */
export function buildPersonLinks(person: Person, max = MAX_PERSON_LINKS): PersonLink[] {
    const candidates: (PersonLink | null)[] = [
        person.website ? { href: person.website, label: "Website", external: true } : null,
        person.email ? { href: `mailto:${person.email}`, label: "Email" } : null,
        person.linkedin ? { href: person.linkedin, label: "LinkedIn", external: true } : null,
        person.scholar ? { href: person.scholar, label: "Scholar", external: true } : null,
        person.twitter
            ? { href: `https://twitter.com/${person.twitter}`, label: `@${person.twitter}`, external: true }
            : null,
    ];

    return (candidates.filter(Boolean) as PersonLink[]).slice(0, max);
}
