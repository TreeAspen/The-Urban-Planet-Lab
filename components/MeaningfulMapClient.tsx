"use client";

import dynamic from "next/dynamic";
import type { Place } from "@/lib/content";

const MeaningfulMap = dynamic(() => import("./MeaningfulMap"), {
    ssr: false,
    loading: () => (
        <div className="aspect-[16/9] w-full animate-pulse rounded-[1.75rem] bg-black/5 dark:bg-white/5" />
    ),
});

export default function MeaningfulMapClient({ places }: { places: Place[] }) {
    return <MeaningfulMap places={places} />;
}
