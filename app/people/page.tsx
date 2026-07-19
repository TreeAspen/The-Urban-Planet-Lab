import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCollection, getSiteSettings, type Person } from "@/lib/content";
import { CATEGORY_CONFIG, buildPersonLinks } from "@/lib/people";
import { AnimateIn, StaggerContainer, StaggerItem } from "@/components/AnimateIn";
import { ContinueExploring } from "@/components/ContinueExploring";

export const metadata = {
    title: "People — The Urban Planet Lab",
    description:
        "Faculty, students, and alumni of The Urban Planet Lab — researchers united by rigorous, equity-centered urban science.",
};

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
    const links = buildPersonLinks(person);

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
            <Link href={`/people/${person.slug}`} className="shrink-0">
                <PersonAvatar person={person} />
            </Link>
            <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold text-black dark:text-white">
                    <Link href={`/people/${person.slug}`} className="hover:underline underline-offset-4">
                        {person.name}
                    </Link>
                </h3>
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
            <Link href={`/people/${person.slug}`}>
                <PersonAvatar person={person} />
            </Link>
            <div className="mt-3 min-w-0 w-full">
                <h3 className="text-base font-semibold text-black dark:text-white">
                    <Link href={`/people/${person.slug}`} className="hover:underline underline-offset-4">
                        {person.name}
                    </Link>
                </h3>
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
    const links = buildPersonLinks(person);

    return (
        <div className="flex items-center justify-between gap-4 border-b border-black/8 py-3.5 last:border-0 transition-colors duration-200 hover:bg-black/[0.02] dark:border-white/10 dark:hover:bg-white/[0.02]">
            <div className="min-w-0">
                <Link href={`/people/${person.slug}`} className="font-medium text-black hover:underline underline-offset-4 dark:text-white">
                    {person.name}
                </Link>
                <span className="ml-2 text-sm text-black/60 dark:text-white/55">{person.role}</span>
                {person.bio ? (
                    <p className="mt-0.5 text-sm text-black/55 dark:text-white/50">{person.bio}</p>
                ) : null}
            </div>
            <div className="flex shrink-0 gap-2">
                {links.map((link) => (
                    <a
                        key={link.href}
                        href={link.href}
                        target={link.external ? "_blank" : undefined}
                        rel={link.external ? "noreferrer" : undefined}
                        className="rounded-full border border-black/15 px-3 py-1 text-xs font-medium text-black/65 transition-colors hover:border-black/30 hover:text-black dark:border-white/20 dark:text-white/60 dark:hover:border-white/35 dark:hover:text-white"
                    >
                        {link.label}
                    </a>
                ))}
            </div>
        </div>
    );
}

export default function PeoplePage() {
    if (getSiteSettings().sections.people === false) notFound();

    const allPeople = getCollection<Person>("people").sort(
        (a, b) => (a.sort_order ?? 99) - (b.sort_order ?? 99)
    );

    const groups = CATEGORY_CONFIG.map((config) => ({
        ...config,
        people: allPeople.filter((p) => p.category === config.key),
    })).filter((group) => group.people.length > 0);

    return (
        <div className="relative">
            <section className="mx-auto max-w-6xl px-4 pt-16 pb-8 sm:px-6 sm:pt-20 lg:px-8 lg:pt-24">
                <AnimateIn className="max-w-3xl" y={28}>
                    <h1 className="text-4xl font-semibold tracking-tight text-black dark:text-white sm:text-5xl lg:text-6xl">
                        People
                    </h1>
                    <p className="mt-4 text-lg leading-relaxed text-black/75 dark:text-white/72">
                        The Urban Planet Lab is its people. We bring together researchers at all career stages united by their interest in urban science and a passion for climate adaptation. 
                    </p>
                </AnimateIn>
            </section>

            {groups.map((group, i) => (
                <section
                    key={group.key}
                    className={[
                        "mx-auto max-w-6xl px-4 sm:px-6 lg:px-8",
                        i === groups.length - 1 ? "pb-16" : "pb-10",
                    ].join(" ")}
                >
                    <AnimateIn>
                        <h2 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-black/50 dark:text-white/45">
                            {group.label}
                        </h2>
                    </AnimateIn>

                    {group.layout === "faculty" ? (
                        <StaggerContainer className="grid gap-4 lg:grid-cols-2">
                            {group.people.map((person) => (
                                <StaggerItem key={person.slug}>
                                    <FacultyCard person={person} />
                                </StaggerItem>
                            ))}
                        </StaggerContainer>
                    ) : group.layout === "rows" ? (
                        <AnimateIn delay={0.1}>
                            <div className="rounded-2xl border border-black/10 bg-white/70 px-5 backdrop-blur-xl dark:border-white/15 dark:bg-black/60">
                                {group.people.map((person) => (
                                    <AlumniRow key={person.slug} person={person} />
                                ))}
                            </div>
                        </AnimateIn>
                    ) : (
                        <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {group.people.map((person) => (
                                <StaggerItem key={person.slug}>
                                    <StudentCard person={person} />
                                </StaggerItem>
                            ))}
                        </StaggerContainer>
                    )}
                </section>
            ))}

            <ContinueExploring from="people" />
        </div>
    );
}
