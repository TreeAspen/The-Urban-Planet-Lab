"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * Full-viewport cover photo with the lab name over it. Sharp edges — the photo
 * fills the first screen edge to edge and simply scrolls away, drifting slower
 * than the page so it reads as a background rather than a picture in the flow.
 *
 * The nav sits above it (the header is sticky), so the lab name in the nav bar
 * stays on screen once the cover has scrolled past.
 *
 * `src` is null until a hero image is uploaded, in which case a drawn sunset
 * skyline stands in so the layout and motion still read correctly.
 */
export default function HeroCover({
    src,
    alt,
    title,
    tagline,
}: {
    src: string | null;
    alt: string;
    title: string;
    tagline?: string;
}) {
    const ref = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    // The photo lags the page and pushes in slightly, so it recedes rather than
    // slides. The title leads it and dims out before the content arrives.
    const photoY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
    const photoScale = useTransform(scrollYProgress, [0, 1], [1, 1.14]);
    const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "-28%"]);
    const titleOpacity = useTransform(scrollYProgress, [0, 0.55, 0.9], [1, 0.9, 0]);
    const cueOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

    return (
        <section
            ref={ref}
            // Pulled up by the height of the floating nav (margin + pill) so the
            // photo starts at the very top of the page, behind the nav.
            className="relative -mt-[92px] h-[100svh] w-full overflow-hidden sm:-mt-[96px]"
        >
            <motion.div className="absolute inset-0" style={{ y: photoY, scale: photoScale }}>
                {src ? (
                    <Image
                        src={src}
                        alt={alt}
                        fill
                        priority
                        sizes="100vw"
                        className="object-cover object-center"
                    />
                ) : (
                    <SkylineStandIn />
                )}
            </motion.div>

            {/* Legibility scrim — heaviest across the middle, where the title
                sits, so the sky at the top stays open. */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-black/45 to-black/45" />

            <motion.div
                style={{ y: titleY, opacity: titleOpacity }}
                className="relative flex h-full flex-col items-center justify-center px-6 text-center"
            >
                <motion.h1
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="max-w-5xl text-balance text-5xl font-semibold leading-[1.05] tracking-tight text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.45)] sm:text-6xl lg:text-7xl"
                >
                    {title}
                </motion.h1>

                {tagline ? (
                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="mt-5 max-w-2xl text-base tracking-[0.18em] uppercase text-white/85 drop-shadow-[0_1px_10px_rgba(0,0,0,0.5)] sm:text-lg"
                    >
                        {tagline}
                    </motion.p>
                ) : null}
            </motion.div>

            <motion.div
                style={{ opacity: cueOpacity }}
                className="pointer-events-none absolute inset-x-0 bottom-7 flex justify-center"
            >
                <motion.span
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="text-white/75 drop-shadow-[0_1px_8px_rgba(0,0,0,0.6)]"
                    aria-hidden="true"
                >
                    <svg
                        viewBox="0 0 24 24"
                        className="h-7 w-7"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="m6 9 6 6 6-6" />
                    </svg>
                </motion.span>
            </motion.div>
        </section>
    );
}

/** Placeholder sunset skyline, drawn in CSS/SVG — no image file needed. */
function SkylineStandIn() {
    return (
        <div className="relative h-full w-full bg-gradient-to-b from-[#1e2a5a] via-[#a8434f] to-[#f0a24b]">
            <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_100%,rgba(255,190,90,0.85),transparent_60%)]" />
            <svg
                viewBox="0 0 1200 300"
                preserveAspectRatio="xMidYMax slice"
                className="absolute inset-x-0 bottom-0 h-full w-full text-[#0b1016]"
                aria-hidden="true"
            >
                <path
                    fill="currentColor"
                    d="M0 300V232h38v-24h26v24h44v-40h30v40h34v-58h22v58h40v-30h28v30h30V150h20v122h34V196h30v76h26v-92h18v92h34v-34h30v34h28V128h16v144h30v-58h26v58h38v-96h20v96h30v-40h28v40h34V108h14v164h30v-72h28v72h32v-44h26v44h36V166h22v106h30v-30h28v30h34V190h20v82h30v-56h26v56h38v-38h28v38h30V146h18v126h32v-64h26v64h34v-28h30v28h28V210h20v62h34v-46h26v46h40V300z"
                />
            </svg>
        </div>
    );
}
