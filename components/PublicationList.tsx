"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimateIn, StaggerContainer, StaggerItem } from "@/components/AnimateIn";
import { Icon } from "@/components/Icons";
import type { Publication } from "@/lib/content";
import type { DirectionRef } from "@/lib/research";

export type PublicationEntry = Publication & { directions: DirectionRef[] };

const PUB_TYPE_LABELS: Record<string, string> = {
    journal: "Journal",
    conference: "Conference",
    book_chapter: "Book Chapter",
    report: "Report",
};

/** Papers not listed under any research direction land in this bucket. */
const UNGROUPED = "__ungrouped__";

function DirectionBadges({ directions }: { directions: DirectionRef[] }) {
    if (directions.length === 0) return null;

    return (
        <>
            {directions.map((direction) => (
                <Link
                    key={direction.slug}
                    href={`/research#${direction.slug}`}
                    className="rounded-full bg-black/5 px-2.5 py-0.5 text-xs text-black/60 transition-colors hover:bg-black/10 hover:text-black dark:bg-white/8 dark:text-white/55 dark:hover:bg-white/15 dark:hover:text-white"
                >
                    {direction.title}
                </Link>
            ))}
        </>
    );
}

function PublicationRow({ pub, anchor = true }: { pub: PublicationEntry; anchor?: boolean }) {
    const typeLabel = pub.pub_type ? PUB_TYPE_LABELS[pub.pub_type] : null;

    // Grouping by topic can list the same paper twice; only the first copy
    // carries the id so incoming `#slug` links stay unambiguous.
    return (
        <div id={anchor ? pub.slug : undefined} className="group relative scroll-mt-28 py-7 first:pt-2">
            <div className="flex items-start gap-4">
                <div className="min-w-0 flex-1">
                    <p className="text-sm text-black/60 dark:text-white/55">{pub.authors}</p>

                    <h3 className="mt-1 text-base font-semibold leading-snug text-black dark:text-white sm:text-[1.05rem]">
                        {pub.doi_url ? (
                            <a
                                href={pub.doi_url}
                                target="_blank"
                                rel="noreferrer"
                                className="transition-colors duration-150 hover:text-black/70 dark:hover:text-white/80"
                            >
                                {pub.title}
                            </a>
                        ) : (
                            pub.title
                        )}
                    </h3>

                    <p className="mt-1 text-sm italic text-black/60 dark:text-white/55">
                        {pub.venue}
                        {pub.details ? <span className="not-italic">, {pub.details}</span> : null}
                    </p>

                    <div className="mt-2.5 flex flex-wrap items-center gap-2">
                        {typeLabel ? (
                            <span className="rounded-full border border-black/12 px-2.5 py-0.5 text-xs font-medium text-black/55 dark:border-white/18 dark:text-white/50">
                                {typeLabel}
                            </span>
                        ) : null}
                        <DirectionBadges directions={pub.directions} />
                        {pub.pdf_url ? (
                            <a
                                href={pub.pdf_url}
                                target="_blank"
                                rel="noreferrer"
                                className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-black/15 px-3 py-0.5 text-xs font-medium text-black/65 transition-all duration-200 hover:scale-[1.04] hover:border-black/30 hover:text-black dark:border-white/20 dark:text-white/60 dark:hover:border-white/35 dark:hover:text-white"
                            >
                                <Icon name="pdf" />
                                PDF
                            </a>
                        ) : null}
                        {pub.doi_url ? (
                            <a
                                href={pub.doi_url}
                                target="_blank"
                                rel="noreferrer"
                                className={[
                                    "inline-flex items-center gap-1.5 rounded-full border border-black/15 px-3 py-0.5 text-xs font-medium text-black/65 transition-all duration-200 hover:scale-[1.04] hover:border-black/30 hover:text-black dark:border-white/20 dark:text-white/60 dark:hover:border-white/35 dark:hover:text-white",
                                    pub.pdf_url ? "" : "ml-auto",
                                ].join(" ")}
                            >
                                <Icon name="doi" />
                                DOI
                            </a>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
}

type GroupBy = "year" | "topic";

export default function PublicationList({
    publications,
    directions,
}: {
    publications: PublicationEntry[];
    directions: DirectionRef[];
}) {
    const [groupBy, setGroupBy] = useState<GroupBy>("year");

    /** Same papers either way — only the headings change. */
    const groups = useMemo(() => {
        if (groupBy === "year") {
            const byYear: Record<number, PublicationEntry[]> = {};
            for (const pub of publications) (byYear[pub.year ?? 0] ??= []).push(pub);
            return Object.keys(byYear)
                .map(Number)
                .sort((a, b) => b - a)
                .map((year) => ({ key: String(year), label: String(year), items: byYear[year] }));
        }

        const byTopic: Record<string, PublicationEntry[]> = {};
        for (const pub of publications) {
            if (pub.directions.length === 0) {
                (byTopic[UNGROUPED] ??= []).push(pub);
                continue;
            }
            // A paper listed under two directions shows up under both.
            for (const direction of pub.directions) (byTopic[direction.slug] ??= []).push(pub);
        }

        const ordered = directions
            .filter((direction) => byTopic[direction.slug])
            .map((direction) => ({
                key: direction.slug,
                label: direction.title,
                items: byTopic[direction.slug],
            }));
        if (byTopic[UNGROUPED]) {
            ordered.push({ key: UNGROUPED, label: "Other", items: byTopic[UNGROUPED] });
        }
        return ordered;
    }, [publications, directions, groupBy]);

    const anchorOwner = useMemo(() => {
        const owner: Record<string, string> = {};
        for (const group of groups) {
            for (const pub of group.items) owner[pub.slug] ??= group.key;
        }
        return owner;
    }, [groups]);

    return (
        <>
            <AnimateIn>
                <div className="mb-8 flex flex-wrap items-center gap-3">
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-black/45 dark:text-white/40">
                        Sort by
                    </span>
                    <div className="inline-flex rounded-full border border-black/12 p-0.5 dark:border-white/18">
                        <ModeButton
                            label="Year"
                            active={groupBy === "year"}
                            onClick={() => setGroupBy("year")}
                        />
                        <ModeButton
                            label="Topic"
                            active={groupBy === "topic"}
                            onClick={() => setGroupBy("topic")}
                        />
                    </div>
                </div>
            </AnimateIn>

            {groups.length > 0 ? (
                <StaggerContainer className="space-y-10" staggerDelay={0.12}>
                    {groups.map((group) => (
                        <StaggerItem key={group.key} y={16}>
                            <div
                                className={[
                                    "grid gap-0 lg:gap-10",
                                    groupBy === "year"
                                        ? "lg:grid-cols-[80px_minmax(0,1fr)]"
                                        : "lg:grid-cols-[200px_minmax(0,1fr)]",
                                ].join(" ")}
                            >
                                <div className="mb-3 lg:mb-0 lg:pt-5">
                                    <span
                                        className={[
                                            "font-semibold text-black/30 dark:text-white/25",
                                            groupBy === "year"
                                                ? "text-2xl"
                                                : "block text-base leading-snug lg:sticky lg:top-28",
                                        ].join(" ")}
                                    >
                                        {group.label}
                                    </span>
                                </div>

                                <div className="divide-y divide-black/8 rounded-[1.75rem] border border-black/10 bg-white/70 px-6 backdrop-blur-xl dark:divide-white/10 dark:border-white/15 dark:bg-black/60 sm:px-7">
                                    {group.items.map((pub) => (
                                        <PublicationRow
                                            key={`${group.key}-${pub.slug}`}
                                            pub={pub}
                                            anchor={anchorOwner[pub.slug] === group.key}
                                        />
                                    ))}
                                </div>
                            </div>
                        </StaggerItem>
                    ))}
                </StaggerContainer>
            ) : (
                <div className="rounded-[1.75rem] border border-dashed border-black/15 px-6 py-12 text-center dark:border-white/15">
                    <p className="text-black/50 dark:text-white/45">No publications yet.</p>
                </div>
            )}
        </>
    );
}

function ModeButton({
    label,
    active,
    onClick,
}: {
    label: string;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={active}
            className={[
                "rounded-full px-4 py-1 text-xs font-medium transition-colors duration-200",
                active
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "text-black/60 hover:text-black dark:text-white/55 dark:hover:text-white",
            ].join(" ")}
        >
            {label}
        </button>
    );
}
