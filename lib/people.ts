import type { Person } from "@/lib/content";
import type { IconName } from "@/components/Icons";

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
    { key: "external", label: "Lab Collaborators", layout: "grid" },
    { key: "alumni", label: "Alumni", layout: "rows" },
];

export type PersonLink = { href: string; label: string; icon: IconName; external?: boolean };

export const MAX_PERSON_LINKS = 3;

/** Priority order: whichever of these a person has filled in, the first three win. */
export function buildPersonLinks(person: Person, max = MAX_PERSON_LINKS): PersonLink[] {
    const candidates: (PersonLink | null)[] = [
        person.website ? { href: person.website, label: "Website", icon: "globe", external: true } : null,
        person.email ? { href: `mailto:${person.email}`, label: "Email", icon: "mail" } : null,
        person.linkedin ? { href: person.linkedin, label: "LinkedIn", icon: "linkedin", external: true } : null,
        person.scholar ? { href: person.scholar, label: "Scholar", icon: "scholar", external: true } : null,
        person.twitter
            ? {
                  href: `https://twitter.com/${person.twitter}`,
                  label: `@${person.twitter}`,
                  icon: "twitter",
                  external: true,
              }
            : null,
    ];

    return (candidates.filter(Boolean) as PersonLink[]).slice(0, max);
}
