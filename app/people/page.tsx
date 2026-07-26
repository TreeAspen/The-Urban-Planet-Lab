import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCollection, getSiteSettings, type Person } from "@/lib/content";
import { CATEGORY_CONFIG, buildPersonLinks } from "@/lib/people";
import { AnimateIn, StaggerContainer, StaggerItem } from "@/components/AnimateIn";
import { ContinueExploring } from "@/components/ContinueExploring";
import { Icon } from "@/components/Icons";

export const metadata = {
    title: "People — The Urban Planet Lab",
    description:
        "Faculty, students, and alumni of The Urban Planet Lab — researchers united by rigorous, equity-centered urban science.",
};

function PersonAvatar({ person, size = "sm" }: { person: Person; size?: "sm" | "lg" }) {
    const box =
        size === "lg"
            ? "h-28 w-28 sm:h-36 sm:w-36"
            : "h-20 w-20 sm:h-24 sm:w-24";

    if (person.photo) {
        return (
            <div
                className={`relative shrink-0 overflow-hidden rounded-full ring-2 ring-black/8 dark:ring-white/12 ${box}`}
            >
                <Image
                    src={person.photo}
                    alt={person.name}
                    fill
                    sizes={size === "lg" ? "144px" : "96px"}
                    className="object-cover"
                />
            </div>
        );
    }
    return (
        <div
            className={`flex shrink-0 items-center justify-center rounded-full bg-black/8 font-semibold text-black/50 ring-2 ring-black/8 dark:bg-white/10 dark:text-white/50 dark:ring-white/12 ${box} ${
                size === "lg" ? "text-4xl" : "text-2xl"
            }`}
        >
            {person.name.charAt(0)}
        </div>
    );
}

function PersonLinks({ person, size = "sm" }: { person: Person; size?: "sm" | "lg" }) {
    const links = buildPersonLinks(person);

    if (links.length === 0) return null;

    return (
        <div className={size === "lg" ? "mt-6 flex flex-wrap gap-2.5" : "mt-3 flex flex-wrap gap-2"}>
            {links.map((link) => (
                <a
                    key={link.href}
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noreferrer" : undefined}
                    className={[
                        "inline-flex items-center gap-1.5 rounded-full border border-black/15 font-medium text-black/70 transition-all duration-200 hover:border-black/30 hover:text-black hover:scale-[1.04] dark:border-white/20 dark:text-white/65 dark:hover:border-white/40 dark:hover:text-white",
                        size === "lg" ? "px-4 py-1.5 text-sm" : "px-3 py-1 text-xs",
                    ].join(" ")}
                >
                    <Icon name={link.icon} className={size === "lg" ? "h-4 w-4 shrink-0" : "h-3.5 w-3.5 shrink-0"} />
                    {link.label}
                </a>
            ))}
        </div>
    );
}

/**
 * Only Faculty get an individual profile page — and a full-width feature panel
 * here, with the short bio. The long bio lives on the profile page.
 */
function FacultyPanel({ person }: { person: Person }) {
    const href = `/people/${person.slug}`;

    return (
        <article className="group relative overflow-hidden rounded-[2.5rem] border border-black/10 bg-white/72 p-6 shadow-[0_20px_70px_rgba(15,23,42,0.06)] backdrop-blur-xl transition-all duration-300 hover:border-black/20 hover:shadow-[0_26px_90px_rgba(15,23,42,0.12)] dark:border-white/15 dark:bg-black/62 dark:shadow-[0_22px_80px_rgba(0,0,0,0.26)] dark:hover:border-white/30 sm:p-10 lg:p-12">
            <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(15,23,42,0.18),transparent)] dark:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent)]" />
            <div className="pointer-events-none absolute -left-16 -top-16 h-52 w-52 rounded-full bg-amber-400/12 blur-3xl dark:bg-amber-300/10" />
            <div className="pointer-events-none absolute -bottom-20 -right-12 h-60 w-60 rounded-full bg-sky-400/12 blur-3xl dark:bg-sky-300/10" />

            {/* Stretched link: the whole card navigates to the profile. It sits
                above the text but below the contact links, which are raised. */}
            <Link
                href={href}
                aria-label={`Read more about ${person.name}`}
                className="absolute inset-0 z-10 rounded-[2.5rem] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black dark:focus-visible:outline-white"
            />

            <div className="relative flex flex-col gap-7 sm:flex-row sm:items-start sm:gap-10">
                <div className="shrink-0">
                    <PersonAvatar person={person} size="lg" />
                </div>

                <div className="min-w-0 flex-1">
                    <span className="inline-flex rounded-full bg-black/6 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-black/55 dark:bg-white/10 dark:text-white/50">
                        Principal Investigator
                    </span>

                    <h3 className="mt-3 text-3xl font-semibold tracking-tight text-black underline-offset-[6px] group-hover:underline dark:text-white sm:text-4xl">
                        {person.name}
                    </h3>

                    <span className="mt-4 block h-1.5 w-16 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 dark:from-amber-300 dark:to-rose-400" />

                    <p className="mt-4 text-base text-black/65 dark:text-white/60">{person.role}</p>

                    {person.bio ? (
                        <p className="mt-5 max-w-3xl text-lg leading-8 text-black/78 dark:text-white/74">
                            {person.bio}
                        </p>
                    ) : null}

                    <span className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition-all duration-200 group-hover:gap-2.5 group-hover:bg-black/90 dark:bg-white dark:text-black dark:group-hover:bg-white/90">
                        Read more
                        <Icon name="arrow" className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </span>

                    {/* Raised above the stretched link so contact links still work. */}
                    <div className="relative z-20">
                        <PersonLinks person={person} size="lg" />
                    </div>
                </div>
            </div>
        </article>
    );
}

function StudentCard({ person }: { person: Person }) {
    return (
        <div className="flex h-full flex-col items-start rounded-2xl border border-black/10 bg-white/70 p-5 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_10px_35px_rgba(15,23,42,0.07)] dark:border-white/15 dark:bg-black/60 dark:hover:shadow-[0_10px_35px_rgba(0,0,0,0.22)]">
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
    const links = buildPersonLinks(person);

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
                {links.map((link) => (
                    <a
                        key={link.href}
                        href={link.href}
                        target={link.external ? "_blank" : undefined}
                        rel={link.external ? "noreferrer" : undefined}
                        className="inline-flex items-center gap-1.5 rounded-full border border-black/15 px-3 py-1 text-xs font-medium text-black/65 transition-colors hover:border-black/30 hover:text-black dark:border-white/20 dark:text-white/60 dark:hover:border-white/35 dark:hover:text-white"
                    >
                        <Icon name={link.icon} />
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
                        <StaggerContainer className="space-y-5">
                            {group.people.map((person) => (
                                <StaggerItem key={person.slug} y={24}>
                                    <FacultyPanel person={person} />
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
                        <StaggerContainer className="grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {group.people.map((person) => (
                                <StaggerItem key={person.slug} className="h-full">
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
