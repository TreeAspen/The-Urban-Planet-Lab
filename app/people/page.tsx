import Image from "next/image";
import { getCollection, type Person } from "@/lib/content";
import { AnimateIn, StaggerContainer, StaggerItem } from "@/components/AnimateIn";

export const metadata = {
    title: "People — The Urban Planet Lab",
};

const CATEGORY_CONFIG = [
    { key: "faculty" as const, label: "Faculty" },
    { key: "phd" as const, label: "PhD Students" },
    { key: "master" as const, label: "Master Students" },
    { key: "alumni" as const, label: "Alumni" },
];

function PersonAvatar({ person }: { person: Person }) {
    if (person.photo) {
        return (
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full ring-2 ring-black/8 dark:ring-white/12 sm:h-24 sm:w-24">
                <Image
                    src={person.photo}
                    alt={person.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                />
            </div>
        );
    }
    return (
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-black/8 text-2xl font-semibold text-black/50 ring-2 ring-black/8 dark:bg-white/10 dark:text-white/50 dark:ring-white/12 sm:h-24 sm:w-24">
            {person.name.charAt(0)}
        </div>
    );
}

function PersonLinks({ person }: { person: Person }) {
    const links = [
        person.email && { href: `mailto:${person.email}`, label: "Email" },
        person.website && { href: person.website, label: "Website", external: true },
        person.scholar && { href: person.scholar, label: "Scholar", external: true },
        person.twitter && {
            href: `https://twitter.com/${person.twitter}`,
            label: `@${person.twitter}`,
            external: true,
        },
    ].filter(Boolean) as { href: string; label: string; external?: boolean }[];

    if (links.length === 0) return null;

    return (
        <div className="mt-3 flex flex-wrap gap-2">
            {links.map((link) => (
                <a
                    key={link.href}
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noreferrer" : undefined}
                    className="rounded-full border border-black/15 px-3 py-1 text-xs font-medium text-black/70 transition-all duration-200 hover:border-black/30 hover:text-black hover:scale-[1.04] dark:border-white/20 dark:text-white/65 dark:hover:border-white/40 dark:hover:text-white"
                >
                    {link.label}
                </a>
            ))}
        </div>
    );
}

function FacultyCard({ person }: { person: Person }) {
    return (
        <div className="flex gap-5 rounded-[1.75rem] border border-black/10 bg-white/70 p-5 backdrop-blur-xl transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_12px_40px_rgba(15,23,42,0.07)] dark:border-white/15 dark:bg-black/60 dark:hover:shadow-[0_12px_40px_rgba(0,0,0,0.22)] sm:gap-6 sm:p-6">
            <PersonAvatar person={person} />
            <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold text-black dark:text-white">{person.name}</h3>
                <p className="mt-0.5 text-sm text-black/60 dark:text-white/60">{person.role}</p>
                {person.bio ? (
                    <p className="mt-2 text-sm leading-relaxed text-black/75 dark:text-white/72">{person.bio}</p>
                ) : null}
                <PersonLinks person={person} />
            </div>
        </div>
    );
}

function StudentCard({ person }: { person: Person }) {
    return (
        <div className="flex flex-col items-start rounded-2xl border border-black/10 bg-white/70 p-5 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_10px_35px_rgba(15,23,42,0.07)] dark:border-white/15 dark:bg-black/60 dark:hover:shadow-[0_10px_35px_rgba(0,0,0,0.22)]">
            <PersonAvatar person={person} />
            <div className="mt-3 min-w-0 w-full">
                <h3 className="text-base font-semibold text-black dark:text-white">{person.name}</h3>
                <p className="mt-0.5 text-sm text-black/60 dark:text-white/60">{person.role}</p>
                {person.bio ? (
                    <p className="mt-2 text-sm leading-relaxed text-black/72 dark:text-white/68">{person.bio}</p>
                ) : null}
                <PersonLinks person={person} />
            </div>
        </div>
    );
}

function AlumniRow({ person }: { person: Person }) {
    return (
        <div className="flex items-center justify-between gap-4 border-b border-black/8 py-3.5 last:border-0 transition-colors duration-200 hover:bg-black/[0.02] dark:border-white/10 dark:hover:bg-white/[0.02]">
            <div className="min-w-0">
                <span className="font-medium text-black dark:text-white">{person.name}</span>
                <span className="ml-2 text-sm text-black/60 dark:text-white/55">{person.role}</span>
                {person.bio ? (
                    <p className="mt-0.5 text-sm text-black/55 dark:text-white/50">{person.bio}</p>
                ) : null}
            </div>
            <div className="flex shrink-0 gap-2">
                {person.website ? (
                    <a
                        href={person.website}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full border border-black/15 px-3 py-1 text-xs font-medium text-black/65 transition-colors hover:border-black/30 hover:text-black dark:border-white/20 dark:text-white/60 dark:hover:border-white/35 dark:hover:text-white"
                    >
                        Website
                    </a>
                ) : null}
                {person.scholar ? (
                    <a
                        href={person.scholar}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full border border-black/15 px-3 py-1 text-xs font-medium text-black/65 transition-colors hover:border-black/30 hover:text-black dark:border-white/20 dark:text-white/60 dark:hover:border-white/35 dark:hover:text-white"
                    >
                        Scholar
                    </a>
                ) : null}
            </div>
        </div>
    );
}

export default function PeoplePage() {
    const allPeople = getCollection<Person>("people").sort(
        (a, b) => (a.sort_order ?? 99) - (b.sort_order ?? 99)
    );

    const grouped = Object.fromEntries(
        CATEGORY_CONFIG.map(({ key }) => [
            key,
            allPeople.filter((p) => p.category === key),
        ])
    ) as Record<"faculty" | "phd" | "master" | "alumni", Person[]>;

    return (
        <div className="relative">
            <section className="mx-auto max-w-6xl px-4 pt-16 pb-8 sm:px-6 sm:pt-20 lg:px-8 lg:pt-24">
                <AnimateIn className="max-w-3xl" y={28}>
                    <h1 className="text-4xl font-semibold tracking-tight text-black dark:text-white sm:text-5xl lg:text-6xl">
                        People
                    </h1>
                    <p className="mt-4 text-lg leading-relaxed text-black/75 dark:text-white/72">
                        The Urban Planet Lab brings together researchers at all career stages united by a commitment to rigorous, equity-centered urban science.
                    </p>
                </AnimateIn>
            </section>

            {grouped.faculty.length > 0 ? (
                <section className="mx-auto max-w-6xl px-4 pb-10 sm:px-6 lg:px-8">
                    <AnimateIn>
                        <h2 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-black/50 dark:text-white/45">
                            Faculty
                        </h2>
                    </AnimateIn>
                    <StaggerContainer className="grid gap-4 lg:grid-cols-2">
                        {grouped.faculty.map((person) => (
                            <StaggerItem key={person.slug}>
                                <FacultyCard person={person} />
                            </StaggerItem>
                        ))}
                    </StaggerContainer>
                </section>
            ) : null}

            {grouped.phd.length > 0 ? (
                <section className="mx-auto max-w-6xl px-4 pb-10 sm:px-6 lg:px-8">
                    <AnimateIn>
                        <h2 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-black/50 dark:text-white/45">
                            PhD Students
                        </h2>
                    </AnimateIn>
                    <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {grouped.phd.map((person) => (
                            <StaggerItem key={person.slug}>
                                <StudentCard person={person} />
                            </StaggerItem>
                        ))}
                    </StaggerContainer>
                </section>
            ) : null}

            {grouped.master.length > 0 ? (
                <section className="mx-auto max-w-6xl px-4 pb-10 sm:px-6 lg:px-8">
                    <AnimateIn>
                        <h2 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-black/50 dark:text-white/45">
                            Master Students
                        </h2>
                    </AnimateIn>
                    <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {grouped.master.map((person) => (
                            <StaggerItem key={person.slug}>
                                <StudentCard person={person} />
                            </StaggerItem>
                        ))}
                    </StaggerContainer>
                </section>
            ) : null}

            {grouped.alumni.length > 0 ? (
                <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
                    <AnimateIn>
                        <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-black/50 dark:text-white/45">
                            Alumni
                        </h2>
                    </AnimateIn>
                    <AnimateIn delay={0.1}>
                        <div className="rounded-2xl border border-black/10 bg-white/70 px-5 backdrop-blur-xl dark:border-white/15 dark:bg-black/60">
                            {grouped.alumni.map((person) => (
                                <AlumniRow key={person.slug} person={person} />
                            ))}
                        </div>
                    </AnimateIn>
                </section>
            ) : null}
        </div>
    );
}
