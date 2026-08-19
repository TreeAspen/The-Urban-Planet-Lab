import type { Person } from "@/lib/content";
import type { IconName } from "@/components/Icons";

/**
 * Headings on the People page. A heading can cover several categories —
 * MS, undergrad and high-school members all sit under Research Assistants,
 * where each person's role line ("MS", "Undergrad", …) tells them apart.
 */
export const PEOPLE_GROUPS: {
    id: string;
    label: string;
    layout: "faculty" | "grid" | "rows";
    categories: Person["category"][];
}[] = [
    { id: "faculty", label: "Faculty", layout: "faculty", categories: ["faculty"] },
    { id: "phd", label: "PhD Students", layout: "grid", categories: ["phd"] },
    {
        id: "research-assistants",
        label: "Research Assistants",
        layout: "grid",
        categories: ["master", "undergrad", "highschool"],
    },
    { id: "external", label: "Lab Collaborators", layout: "grid", categories: ["external"] },
    { id: "alumni", label: "Alumni", layout: "rows", categories: ["alumni"] },
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
