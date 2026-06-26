"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useTheme } from "next-themes";
import type { Place } from "@/lib/content";

type MeaningfulMapProps = {
    places: Place[];
};

// CARTO basemaps — swapped with the active theme so the map matches day/night.
const TILES = {
    light: "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png",
    dark: "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png",
};

// Glowing "heat-island" marker — on-theme and legible on both basemaps.
function makeIcon(active: boolean) {
    const size = active ? 22 : 14;
    const ring = active ? 5 : 3;
    const glow = active ? 18 : 10;
    return L.divIcon({
        className: "upl-pin",
        html: `<span style="
            display:block;width:${size}px;height:${size}px;border-radius:9999px;
            background:radial-gradient(circle at 50% 38%, #fde68a 0%, #fb923c 46%, #ef4444 100%);
            box-shadow: 0 0 0 ${ring}px rgba(249,115,22,${active ? 0.26 : 0.16}),
                        0 0 ${glow}px ${active ? 5 : 3}px rgba(239,68,68,${active ? 0.55 : 0.4}),
                        0 4px 12px rgba(0,0,0,0.28);
            transition: all 200ms ease;
        "></span>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
    });
}

function FlyTo({ target }: { target: [number, number] | null }) {
    const map = useMap();
    useEffect(() => {
        if (target) {
            map.flyTo(target, 6, { duration: 1.2 });
        }
    }, [target, map]);
    return null;
}

export default function MeaningfulMap({ places }: MeaningfulMapProps) {
    const [mounted, setMounted] = useState(false);
    const [activeSlug, setActiveSlug] = useState<string | null>(null);
    const [flyTarget, setFlyTarget] = useState<[number, number] | null>(null);
    const markerRefs = useRef<Record<string, L.Marker | null>>({});
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";

    useEffect(() => {
        setMounted(true);
    }, []);

    const center = useMemo<[number, number]>(() => {
        if (places.length === 0) return [20, 0];
        const avgLat = places.reduce((s, p) => s + p.lat, 0) / places.length;
        const avgLng = places.reduce((s, p) => s + p.lng, 0) / places.length;
        return [avgLat, avgLng];
    }, [places]);

    if (!mounted) {
        return (
            <div className="aspect-[16/9] w-full animate-pulse rounded-[1.75rem] bg-black/5 dark:bg-white/5" />
        );
    }

    return (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="relative overflow-hidden rounded-[1.75rem] border border-black/10 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.08)] dark:border-white/15 dark:bg-[#0b1622] dark:shadow-[0_18px_60px_rgba(0,0,0,0.4)]">
                <div className="aspect-[16/10] sm:aspect-[16/9] lg:aspect-[16/10]">
                    <MapContainer
                        center={center}
                        zoom={2}
                        minZoom={2}
                        maxZoom={10}
                        scrollWheelZoom={false}
                        worldCopyJump
                        zoomControl={false}
                        style={{ width: "100%", height: "100%", background: isDark ? "#0b1622" : "#eef1f4" }}
                    >
                        <TileLayer
                            key={isDark ? "dark" : "light"}
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
                            url={isDark ? TILES.dark : TILES.light}
                            subdomains="abcd"
                        />
                        <FlyTo target={flyTarget} />
                        {places.map((p) => (
                            <Marker
                                key={p.slug}
                                position={[p.lat, p.lng]}
                                icon={makeIcon(activeSlug === p.slug)}
                                ref={(ref) => {
                                    markerRefs.current[p.slug] = ref;
                                }}
                                eventHandlers={{
                                    click: () => setActiveSlug(p.slug),
                                    mouseover: () => setActiveSlug(p.slug),
                                }}
                            >
                                <Popup closeButton={false} className="upl-popup">
                                    <div className="min-w-[200px]">
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/55">
                                            {p.member_name}
                                        </p>
                                        <p className="mt-1 text-base font-semibold text-black">
                                            {p.place_name}
                                        </p>
                                        {p.location_label ? (
                                            <p className="text-xs text-black/55">
                                                {p.location_label}
                                                {p.year ? ` · ${p.year}` : ""}
                                            </p>
                                        ) : null}
                                        {p.story ? (
                                            <p className="mt-2 text-[13px] leading-relaxed text-black/75">
                                                {p.story}
                                            </p>
                                        ) : null}
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>
            </div>

            <div className="flex max-h-[440px] flex-col overflow-hidden rounded-[1.75rem] border border-black/10 bg-white/70 backdrop-blur-xl dark:border-white/15 dark:bg-black/60">
                <div className="border-b border-black/8 px-5 py-4 dark:border-white/10">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/55 dark:text-white/55">
                        Meaningful places
                    </p>
                    <p className="mt-1 text-sm text-black/65 dark:text-white/60">
                        Click a place to fly there.
                    </p>
                </div>
                <ul className="flex-1 divide-y divide-black/8 overflow-y-auto dark:divide-white/10">
                    {places.length === 0 ? (
                        <li className="px-5 py-6 text-sm text-black/55 dark:text-white/50">
                            No places yet — add one from /admin.
                        </li>
                    ) : (
                        places.map((p) => {
                            const isActive = activeSlug === p.slug;
                            return (
                                <li key={p.slug}>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setActiveSlug(p.slug);
                                            setFlyTarget([p.lat, p.lng]);
                                            const m = markerRefs.current[p.slug];
                                            if (m) {
                                                setTimeout(() => m.openPopup(), 1200);
                                            }
                                        }}
                                        className={[
                                            "flex w-full items-start gap-3 px-5 py-3.5 text-left transition-all duration-200",
                                            isActive
                                                ? "bg-black/[0.04] dark:bg-white/[0.06]"
                                                : "hover:bg-black/[0.03] dark:hover:bg-white/[0.04]",
                                        ].join(" ")}
                                    >
                                        <span
                                            className={[
                                                "mt-1.5 inline-block h-2 w-2 shrink-0 rounded-full transition-all",
                                                isActive
                                                    ? "scale-125 bg-black dark:bg-white"
                                                    : "bg-black/40 dark:bg-white/40",
                                            ].join(" ")}
                                        />
                                        <span className="min-w-0 flex-1">
                                            <span className="block text-sm font-semibold text-black dark:text-white">
                                                {p.place_name}
                                            </span>
                                            <span className="block text-xs text-black/55 dark:text-white/50">
                                                {p.member_name}
                                                {p.year ? ` · ${p.year}` : ""}
                                            </span>
                                        </span>
                                    </button>
                                </li>
                            );
                        })
                    )}
                </ul>
            </div>
        </div>
    );
}
