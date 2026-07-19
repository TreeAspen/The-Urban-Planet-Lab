import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCollection, getSiteSettings, type Person } from "@/lib/content";
import { buildPersonLinks } from "@/lib/people";
import { AnimateIn } from "@/components/AnimateIn";

// Only Faculty get an individual profile page — everyone else stays plain text
// on the People list.
function getFacultyPeople(): Person[] {
    return getCollection<Person>("people").filter((p) => p.category === "faculty");
}

export function generateStaticParams() {
    return getFacultyPeople().map((person) => ({ slug: person.slug }));
}

function getPerson(slug: string): Person | null {
    return getFacultyPeople().find((p) => p.slug === slug) ?? null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const person = getPerson(slug);
    if (!person) return { title: "Person — The Urban Planet Lab" };
    return {
        title: `${person.name} — The Urban Planet Lab`,
        description: person.bio || `${person.name}, ${person.role} at The Urban Planet Lab.`,
    };
}

function ProfileAvatar({ person }: { person: Person }) {
    if (person.photo) {
        return (
            <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-full ring-4 ring-black/8 dark:ring-white/12 sm:h-40 sm:w-40">
                <Image src={person.photo} alt={person.name} fill sizes="160px" className="object-cover" />
            </div>
        );
    }
    return (
        <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-full bg-black/8 text-4xl font-semibold text-black/50 ring-4 ring-black/8 dark:bg-white/10 dark:text-white/50 dark:ring-white/12 sm:h-40 sm:w-40">
            {person.name.charAt(0)}
        </div>
    );
}

export default async function PersonPage({ params }: { params: Promise<{ slug: string }> }) {
    if (getSiteSettings().sections.people === false) notFound();

    const { slug } = await params;
    const person = getPerson(slug);
    if (!person) notFound();

    const links = buildPersonLinks(person, 10);

    return (
        <div className="relative">
            <section className="mx-auto max-w-4xl px-4 pt-16 pb-20 sm:px-6 sm:pt-20 lg:px-8 lg:pt-24">
                <AnimateIn>
                    <Link
                        href="/people"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-black/60 transition-colors hover:text-black dark:text-white/55 dark:hover:text-white"
                    >
                        ← Back to People
                    </Link>
                </AnimateIn>

                <AnimateIn delay={0.1} y={20}>
                    <div className="mt-6 rounded-[2rem] border border-black/10 bg-white/70 p-6 backdrop-blur-xl dark:border-white/15 dark:bg-black/60 sm:p-10">
                        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-8">
                            <ProfileAvatar person={person} />
                            <div className="min-w-0">
                                <span className="inline-flex rounded-full bg-black/6 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-[0.14em] text-black/55 dark:bg-white/10 dark:text-white/50">
                                    Faculty
                                </span>
                                <h1 className="mt-3 text-3xl font-semibold tracking-tight text-black dark:text-white sm:text-4xl">
                                    {person.name}
                                </h1>
                                <p className="mt-1.5 text-base text-black/60 dark:text-white/60">{person.role}</p>

                                {links.length > 0 ? (
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {links.map((link) => (
                                            <a
                                                key={link.href}
                                                href={link.href}
                                                target={link.external ? "_blank" : undefined}
                                                rel={link.external ? "noreferrer" : undefined}
                                                className="rounded-full border border-black/15 px-3.5 py-1.5 text-xs font-medium text-black/70 transition-all duration-200 hover:border-black/30 hover:text-black hover:scale-[1.04] dark:border-white/20 dark:text-white/65 dark:hover:border-white/40 dark:hover:text-white"
                                            >
                                                {link.label}
                                            </a>
                                        ))}
                                    </div>
                                ) : null}
                            </div>
                        </div>

                        {person.bio ? (
                            <p className="mt-8 max-w-2xl text-base leading-relaxed text-black/78 dark:text-white/74 sm:text-lg">
                                {person.bio}
                            </p>
                        ) : null}
                    </div>
                </AnimateIn>
            </section>
        </div>
    );
}
