import Image from "next/image";

/**
 * Stand-in visual until a real image is uploaded in the admin: concentric
 * thermal rings over a grid, echoing the heat-islet imagery the lab works with.
 * Shared by Research directions and Projects so the two pages look related.
 */
export function TilePlaceholder({
    index,
    accent,
    className = "aspect-[4/3]",
}: {
    index: number;
    accent: string;
    className?: string;
}) {
    const patternId = `tile-grid-${accent.replace(/[^a-z0-9]/gi, "")}-${index}`;

    return (
        <div
            className={`relative flex w-full items-center justify-center overflow-hidden rounded-[2rem] bg-gradient-to-br ${accent} ${className}`}
        >
            <svg
                aria-hidden="true"
                viewBox="0 0 400 300"
                preserveAspectRatio="xMidYMid slice"
                className="absolute inset-0 h-full w-full text-black/25 dark:text-white/25"
                fill="none"
                stroke="currentColor"
            >
                <defs>
                    <pattern id={patternId} width="25" height="25" patternUnits="userSpaceOnUse">
                        <path d="M25 0H0v25" strokeWidth="0.5" opacity="0.5" />
                    </pattern>
                </defs>
                <rect width="400" height="300" fill={`url(#${patternId})`} stroke="none" />
                <g strokeWidth="1.2" opacity="0.85">
                    <ellipse cx="200" cy="150" rx="36" ry="28" />
                    <ellipse cx="200" cy="150" rx="66" ry="50" />
                    <ellipse cx="200" cy="150" rx="98" ry="72" />
                    <ellipse cx="200" cy="150" rx="132" ry="96" />
                </g>
            </svg>
            <span className="relative text-5xl font-semibold tracking-[-0.08em] text-black/22 dark:text-white/22 sm:text-6xl">
                {String(index).padStart(2, "0")}
            </span>
        </div>
    );
}

/** The uploaded image when there is one, otherwise the placeholder. */
export function MediaTile({
    src,
    alt,
    index,
    accent,
    className = "aspect-[4/3]",
    sizes = "(min-width: 1024px) 560px, 100vw",
    priority = false,
}: {
    src: string;
    alt: string;
    index: number;
    accent: string;
    className?: string;
    sizes?: string;
    priority?: boolean;
}) {
    if (!src) {
        return <TilePlaceholder index={index} accent={accent} className={className} />;
    }

    return (
        <div
            className={`relative w-full overflow-hidden rounded-[2rem] border border-black/10 bg-white/60 shadow-[0_20px_70px_rgba(15,23,42,0.08)] dark:border-white/15 dark:bg-black/50 ${className}`}
        >
            <Image src={src} alt={alt} fill priority={priority} sizes={sizes} className="object-cover" />
        </div>
    );
}
