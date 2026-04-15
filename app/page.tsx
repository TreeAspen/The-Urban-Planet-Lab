"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import useSupabaseRealtime, { useSupabaseRealtimeWithStatus } from "@/src/hooks/useSupabaseRealtime";

type HomeContentRow = {
    key: string;
    value: string;
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

type HomeCard = {
    index: number;
    title: string;
    description: string;
};

const cardKeyPattern = /^Card (\d+) (Title|Description)$/;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

function buildContentMap(rows: HomeContentRow[]) {
    return rows.reduce<Record<string, string>>((accumulator, row) => {
        accumulator[row.key] = row.value;
        return accumulator;
    }, {});
}

function buildCards(rows: HomeContentRow[]) {
    const cards = new Map<number, HomeCard>();

    rows.forEach((row) => {
        const match = row.key.match(cardKeyPattern);

        if (!match) {
            return;
        }

        const index = Number(match[1]);
        const field = match[2];
        const card = cards.get(index) ?? { index, title: "", description: "" };

        if (field === "Title") {
            card.title = row.value;
        } else {
            card.description = row.value;
        }

        cards.set(index, card);
    });

    return Array.from(cards.values())
        .sort((left, right) => left.index - right.index)
        .filter((card) => card.title || card.description);
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

function pickHomeHeroImage(rows: ImageRow[]) {
    const publishedRows = rows.filter((row) => row.is_published !== false && row.page === "home");

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

export default function Home() {
    // Subscribe to the table in Supabase and receive live updates whenever its data changes
    const data = useSupabaseRealtime<HomeContentRow>("home");
    const { hasLoaded: hasLoadedImages, rows: imageRows } = useSupabaseRealtimeWithStatus<ImageRow>("images");
    const [failedHeroImageSrc, setFailedHeroImageSrc] = useState<string | null>(null);
    const content = buildContentMap(data);
    const cards = buildCards(data);
    const heroImage = pickHomeHeroImage(imageRows);
    const heroImageSrc = heroImage
        ? buildPublicImageUrl(heroImage.bucket_id, heroImage.object_path, heroImage.storage_updated_at)
        : "";
    const heroImageAlt = heroImage?.alt_text ?? "";
    const showHeroImage = Boolean(heroImageSrc) && failedHeroImageSrc !== heroImageSrc;
    const showHeroPlaceholder = hasLoadedImages && !showHeroImage;

    useEffect(() => {
        document.title = "The Urban Planet Lab";
    }, []);

    return (
        <div className="relative">
            <section className="mx-auto max-w-6xl px-4 pt-16 pb-12 sm:px-6 sm:pt-20 sm:pb-14 lg:px-8 lg:pt-24 lg:pb-16">
                <div className="max-w-3xl">
                    <p className="inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase text-black/60 dark:text-white/60">
                        {content["Tagline"]}
                    </p>

                    <h1 className="mt-5 text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-[0.95] text-black dark:text-white">
                        {content["Main Heading"]}
                    </h1>
                </div>

                {showHeroImage ? (
                    <div className="mt-8 overflow-hidden rounded-[2rem] border border-black/10 bg-white/60 shadow-[0_22px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-white/15 dark:bg-black/50 dark:shadow-[0_26px_90px_rgba(0,0,0,0.28)]">
                        <Image
                            key={heroImageSrc}
                            src={heroImageSrc}
                            alt={heroImageAlt}
                            width={1600}
                            height={1000}
                            priority
                            sizes="(min-width: 1024px) 1120px, (min-width: 640px) 90vw, 100vw"
                            className="h-auto w-full object-cover"
                            onError={() => {
                                setFailedHeroImageSrc(heroImageSrc);
                            }}
                        />
                    </div>
                ) : showHeroPlaceholder ? (
                    <div className="mt-8 rounded-[2rem] border border-dashed border-black/15 bg-black/[0.03] px-6 py-14 text-center dark:border-white/15 dark:bg-white/[0.04]">
                        <p className="text-sm font-medium uppercase tracking-[0.2em] text-black/45 dark:text-white/45">
                            Homepage Image
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
                            , inside the <span className="font-semibold text-black dark:text-white">home</span> folder.
                        </p>
                    </div>
                ) : null}

                <p className="mt-6 text-lg sm:text-xl leading-relaxed text-black/80 dark:text-white/75">
                    {content["Description"]}
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                    <a
                        href="/research"
                        className="rounded-full px-5 py-2.5 text-sm font-medium bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90 transition-colors duration-200"
                    >
                        Explore Research
                    </a>

                    <a
                        href="/people"
                        className="rounded-full px-5 py-2.5 text-sm font-medium border border-black/20 dark:border-white/25 text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/15 transition-colors duration-200"
                    >
                        Meet the Team
                    </a>
                </div>
            </section>

            {cards.length > 0 ? (
                <section className="mx-auto max-w-6xl px-4 pb-14 sm:px-6 sm:pb-16 lg:px-8 lg:pb-20">
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {cards.map((card) => (
                            <div
                                key={card.index}
                                className="rounded-2xl border border-black/10 dark:border-white/15 bg-white/70 dark:bg-black/60 backdrop-blur-xl p-6"
                            >
                                <h3 className="text-lg font-semibold text-black dark:text-white">
                                    {card.title}
                                </h3>
                                <p className="mt-2 text-sm text-black/75 dark:text-white/75">
                                    {card.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            ) : null}
        </div>
    );
}
