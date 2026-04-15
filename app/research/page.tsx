"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import useSupabaseRealtime, { useSupabaseRealtimeWithStatus } from "@/src/hooks/useSupabaseRealtime";

type ResearchContentRow = {
    key: string;
    value: string;
};

type Direction = {
    index: number;
    title: string;
    description: string;
};

type ImageRow = {
    page: string;
    slot: string;
    bucket_id: string;
    object_path: string;
    alt_text: string;
    sort_order: number;
    storage_updated_at: string;
    is_published: boolean;
};

type AccentTheme = {
    halo: string;
    hoverBorder: string;
    number: string;
    rule: string;
};

const directionKeyPattern = /^Research Direction (\d+) (Title|Description)$/;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

const accentThemes: AccentTheme[] = [
    {
        halo: "bg-cyan-500/12 dark:bg-cyan-400/14",
        hoverBorder: "hover:border-cyan-500/25 dark:hover:border-cyan-300/22",
        number: "text-cyan-700/18 dark:text-cyan-200/15",
        rule: "bg-cyan-500 dark:bg-cyan-300",
    },
    {
        halo: "bg-rose-500/12 dark:bg-rose-400/14",
        hoverBorder: "hover:border-rose-500/25 dark:hover:border-rose-300/22",
        number: "text-rose-700/18 dark:text-rose-200/15",
        rule: "bg-rose-500 dark:bg-rose-300",
    },
    {
        halo: "bg-emerald-500/12 dark:bg-emerald-400/14",
        hoverBorder: "hover:border-emerald-500/25 dark:hover:border-emerald-300/22",
        number: "text-emerald-700/18 dark:text-emerald-200/15",
        rule: "bg-emerald-500 dark:bg-emerald-300",
    },
    {
        halo: "bg-amber-500/12 dark:bg-amber-400/14",
        hoverBorder: "hover:border-amber-500/25 dark:hover:border-amber-300/22",
        number: "text-amber-700/18 dark:text-amber-200/15",
        rule: "bg-amber-500 dark:bg-amber-300",
    },
    {
        halo: "bg-violet-500/12 dark:bg-violet-400/14",
        hoverBorder: "hover:border-violet-500/25 dark:hover:border-violet-300/22",
        number: "text-violet-700/18 dark:text-violet-200/15",
        rule: "bg-violet-500 dark:bg-violet-300",
    },
];

function buildContentMap(rows: ResearchContentRow[]) {
    return rows.reduce<Record<string, string>>((accumulator, row) => {
        accumulator[row.key] = row.value;
        return accumulator;
    }, {});
}

function buildDirections(rows: ResearchContentRow[]) {
    const directions = new Map<number, Direction>();

    rows.forEach((row) => {
        const match = row.key.match(directionKeyPattern);

        if (!match) {
            return;
        }

        const index = Number(match[1]);
        const field = match[2];
        const direction = directions.get(index) ?? { index, title: "", description: "" };

        if (field === "Title") {
            direction.title = row.value;
        } else {
            direction.description = row.value;
        }

        directions.set(index, direction);
    });

    return Array.from(directions.values())
        .sort((left, right) => left.index - right.index)
        .filter((direction) => direction.title || direction.description);
}

function buildPublicImageUrl(bucketId: string, objectPath: string, storageUpdatedAt: string) {
    if (!supabaseUrl) {
        return "";
    }

    const encodedPath = objectPath
        .split("/")
        .map((segment) => encodeURIComponent(segment))
        .join("/");
    const version = encodeURIComponent(storageUpdatedAt);

    return `${supabaseUrl}/storage/v1/object/public/${bucketId}/${encodedPath}?v=${version}`;
}

function pickResearchHeroImage(rows: ImageRow[]) {
    const publishedRows = rows.filter((row) => row.is_published !== false && row.page === "research");

    const prioritizedRows = publishedRows
        .slice()
        .sort((left, right) => {
            const leftPriority = left.slot === "hero" ? 0 : 1;
            const rightPriority = right.slot === "hero" ? 0 : 1;

            if (leftPriority !== rightPriority) {
                return leftPriority - rightPriority;
            }

            return left.sort_order - right.sort_order;
        });

    return prioritizedRows[0] ?? null;
}

function DirectionPanel({
    direction,
    accent,
}: {
    direction: Direction;
    accent: AccentTheme;
}) {
    return (
        <article
            className={[
                "relative overflow-hidden rounded-[2rem] border border-black/10 bg-white/72 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.05)] backdrop-blur-xl transition duration-300 hover:scale-[1.01] hover:shadow-[0_24px_80px_rgba(15,23,42,0.10)] dark:border-white/15 dark:bg-black/62 dark:shadow-[0_20px_80px_rgba(0,0,0,0.22)] dark:hover:shadow-[0_26px_90px_rgba(0,0,0,0.3)] sm:p-8",
                accent.hoverBorder,
            ].join(" ")}
        >
            <div className={`pointer-events-none absolute right-5 top-5 h-24 w-24 rounded-full blur-3xl ${accent.halo}`} />

            <div className="relative grid gap-6 lg:grid-cols-[92px_minmax(0,1fr)] lg:gap-8">
                <div className="flex items-start justify-between lg:block">
                    <span className={`text-5xl font-semibold tracking-[-0.08em] sm:text-6xl ${accent.number}`}>
                        {String(direction.index).padStart(2, "0")}
                    </span>
                    <span className={`mt-3 block h-1.5 w-14 rounded-full ${accent.rule} lg:mt-6`} />
                </div>

                <div>
                    <h3 className="max-w-3xl text-2xl font-semibold leading-tight text-black dark:text-white sm:text-[1.9rem]">
                        {direction.title}
                    </h3>

                    <p className="mt-5 max-w-3xl text-base leading-8 text-black/76 dark:text-white/74">
                        {direction.description}
                    </p>
                </div>
            </div>
        </article>
    );
}

export default function ResearchPage() {
    const rows = useSupabaseRealtime<ResearchContentRow>("research");
    const { hasLoaded: hasLoadedImages, rows: imageRows } = useSupabaseRealtimeWithStatus<ImageRow>("images");
    const [failedHeroImageSrc, setFailedHeroImageSrc] = useState<string | null>(null);
    const content = buildContentMap(rows);
    const directions = buildDirections(rows);
    const heroImage = pickResearchHeroImage(imageRows);
    const heroImageSrc = heroImage
        ? buildPublicImageUrl(heroImage.bucket_id, heroImage.object_path, heroImage.storage_updated_at)
        : "";
    const heroImageAlt = heroImage?.alt_text ?? "";
    const showHeroImage = Boolean(heroImageSrc) && failedHeroImageSrc !== heroImageSrc;
    const showHeroPlaceholder = hasLoadedImages && !showHeroImage;

    useEffect(() => {
        document.title = "Research - The Urban Planet Lab";
    }, []);

    return (
        <div className="relative">
            <section className="mx-auto max-w-6xl px-4 pt-16 pb-12 sm:px-6 sm:pt-20 sm:pb-14 lg:px-8 lg:pt-24 lg:pb-16">
                <div className="relative overflow-hidden rounded-[2.75rem] border border-black/10 bg-white/68 px-6 py-10 shadow-[0_24px_90px_rgba(15,23,42,0.06)] backdrop-blur-xl dark:border-white/15 dark:bg-black/56 dark:shadow-[0_26px_100px_rgba(0,0,0,0.28)] sm:px-8 sm:py-12 lg:px-12 lg:py-16">
                    <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(15,23,42,0.18),transparent)] dark:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent)]" />
                    <div className="absolute left-0 top-0 h-44 w-44 -translate-x-1/3 -translate-y-1/3 rounded-full bg-sky-400/10 blur-3xl dark:bg-sky-400/12" />
                    <div className="absolute bottom-0 right-0 h-52 w-52 translate-x-1/3 translate-y-1/3 rounded-full bg-emerald-400/10 blur-3xl dark:bg-fuchsia-400/10" />

                    <div className="relative mx-auto max-w-4xl">
                        {content["Main Heading"] ? (
                            <h1 className="text-balance text-4xl font-semibold tracking-tight text-black dark:text-white sm:text-5xl lg:text-[4.4rem] lg:leading-[0.9]">
                                {content["Main Heading"]}
                            </h1>
                        ) : null}

                        {showHeroImage ? (
                            <div className="mt-8 overflow-hidden rounded-[2rem] border border-black/10 bg-white/60 shadow-[0_22px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-white/15 dark:bg-black/50 dark:shadow-[0_26px_90px_rgba(0,0,0,0.28)]">
                                <Image
                                    key={heroImageSrc}
                                    src={heroImageSrc}
                                    alt={heroImageAlt}
                                    width={1600}
                                    height={1000}
                                    priority
                                    sizes="(min-width: 1024px) 896px, (min-width: 640px) 90vw, 100vw"
                                    className="h-auto w-full object-cover"
                                    onError={() => {
                                        setFailedHeroImageSrc(heroImageSrc);
                                    }}
                                />
                            </div>
                        ) : showHeroPlaceholder ? (
                            <div className="mt-8 rounded-[2rem] border border-dashed border-black/15 bg-black/[0.03] px-6 py-14 text-center dark:border-white/15 dark:bg-white/[0.04]">
                                <p className="text-sm font-medium uppercase tracking-[0.2em] text-black/45 dark:text-white/45">
                                    Research Image
                                </p>
                                <p className="mt-3 text-lg leading-8 text-black/70 dark:text-white/70">
                                    Please upload <span className="font-semibold text-black dark:text-white">1.jpg</span> to the{" "}
                                    <a
                                        href="https://supabase.com/dashboard/project/eayhwklnkwismhacmsrm/storage/files/buckets/images"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="font-semibold text-black underline decoration-black/30 underline-offset-4 transition-colors duration-200 hover:text-black/70 hover:decoration-black/60 dark:text-white dark:decoration-white/30 dark:hover:text-white/80 dark:hover:decoration-white/60"
                                    >
                                        images bucket
                                    </a>
                                    , inside the <span className="font-semibold text-black dark:text-white">research</span> folder.
                                </p>
                            </div>
                        ) : null}

                        {content.Description ? (
                            <p className="mt-8 text-lg leading-8 text-black/78 dark:text-white/74 lg:text-[1.15rem]">
                                {content.Description}
                            </p>
                        ) : null}
                    </div>
                </div>
            </section>

            {(content["Section Title"] || content["Section Description"] || directions.length > 0) ? (
                <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 sm:pb-14 lg:px-8 lg:pb-16">
                    <div className="grid gap-8 lg:grid-cols-[minmax(240px,0.42fr)_minmax(0,1fr)] lg:gap-12">
                        <div className="lg:sticky lg:top-28 lg:self-start">
                            {content["Section Title"] ? (
                                <h2 className="text-3xl font-semibold tracking-tight text-black dark:text-white sm:text-4xl">
                                    {content["Section Title"]}
                                </h2>
                            ) : null}

                            {content["Section Description"] ? (
                                <p className="mt-4 max-w-sm text-base leading-8 text-black/74 dark:text-white/72 sm:text-lg">
                                    {content["Section Description"]}
                                </p>
                            ) : null}
                        </div>

                        {directions.length > 0 ? (
                            <div className="space-y-5">
                                {directions.map((direction, index) => (
                                    <DirectionPanel
                                        key={direction.index}
                                        direction={direction}
                                        accent={accentThemes[index % accentThemes.length]}
                                    />
                                ))}
                            </div>
                        ) : null}
                    </div>
                </section>
            ) : null}

            {content["Closing Statement"] ? (
                <section className="mx-auto max-w-6xl px-4 pb-14 sm:px-6 sm:pb-16 lg:px-8 lg:pb-20">
                    <div className="border-t border-black/10 pt-8 dark:border-white/12 sm:pt-10">
                        <p className="max-w-5xl text-xl font-medium leading-8 text-black/78 dark:text-white/74 sm:text-2xl sm:leading-9">
                            {content["Closing Statement"]}
                        </p>

                    </div>
                </section>
            ) : null}
        </div>
    );
}
