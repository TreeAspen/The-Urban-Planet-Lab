"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useMotionTemplate, useScroll, useTransform } from "framer-motion";

/**
 * Full-bleed banner at the top of the homepage. As the page scrolls the image
 * drifts slower than the page (parallax), scales up, blurs, and fades out — so
 * it dissolves into the page background instead of just sliding away.
 *
 * `src` is null until a hero image is uploaded; a themed sunset-skyline
 * stand-in takes its place so the layout and motion still read correctly.
 */
/** Bottom third of the banner fades its own alpha out to nothing. */
const BOTTOM_FADE =
    "linear-gradient(to bottom, #000 0%, #000 62%, rgba(0,0,0,0.55) 82%, rgba(0,0,0,0.16) 93%, transparent 100%)";

/**
 * Height of the floating nav (its top margin plus the pill). The banner is
 * pulled up by exactly this much so the photo runs behind the nav instead of
 * starting under it, and grows by the same amount so nothing below shifts.
 *   mobile  16 (mt-4) + 32 (py-4) + 44 (menu button)  = 92
 *   sm and up 24 (mt-6) + 32 (py-4) + 40 (logo)       = 96
 */
const NAV_OFFSET = "-mt-[92px] sm:-mt-[96px]";

export default function HeroBanner({ src, alt }: { src: string | null; alt: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    // Holds full strength through the first third of the scroll, then dissolves.
    const opacity = useTransform(scrollYProgress, [0, 0.35, 1], [1, 0.85, 0]);
    const scale = useTransform(scrollYProgress, [0, 1], [1, 1.18]);
    const y = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
    const blurPx = useTransform(scrollYProgress, [0, 1], [0, 12]);
    const filter = useMotionTemplate`blur(${blurPx}px)`;
    const cueOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

    return (
        <div
            ref={ref}
            className={`relative h-[calc(46vh+92px)] min-h-[332px] w-full overflow-hidden sm:h-[calc(52vh+96px)] lg:max-h-[656px] ${NAV_OFFSET}`}
        >
            {/* The mask lives on this static wrapper, not on the moving layer, so
                the soft bottom edge stays put while the image scales and drifts.
                Fading the image's own alpha lets the page's textured background
                show through, rather than painting a flat band over it. */}
            <div className="absolute inset-0" style={{ maskImage: BOTTOM_FADE, WebkitMaskImage: BOTTOM_FADE }}>
                <motion.div
                    className="absolute inset-0 will-change-transform"
                    style={{ opacity, scale, y, filter }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
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
            </div>

            <motion.div
                style={{ opacity: cueOpacity }}
                className="pointer-events-none absolute inset-x-0 bottom-5 flex justify-center"
            >
                <motion.span
                    animate={{ y: [0, 7, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="text-black/35 dark:text-white/40"
                    aria-hidden="true"
                >
                    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m6 9 6 6 6-6" />
                    </svg>
                </motion.span>
            </motion.div>
        </div>
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
