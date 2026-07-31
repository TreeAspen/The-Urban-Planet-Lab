import type { SVGProps } from "react";

/**
 * Small inline icons used on every link/button across the site (contact links,
 * PDF/DOI buttons, syllabus buttons, footer). Stroke-based and `currentColor`
 * so they inherit whatever text colour the button already uses.
 */
export type IconName =
    | "globe"
    | "mail"
    | "linkedin"
    | "scholar"
    | "twitter"
    | "pdf"
    | "doi"
    | "syllabus"
    | "paper"
    | "project"
    | "pin"
    | "arrow";

const BASE: SVGProps<SVGSVGElement> = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
};

const PATHS: Record<IconName, React.ReactNode> = {
    globe: (
        <>
            <circle cx="12" cy="12" r="9" />
            <path d="M3 12h18M12 3c2.5 2.6 2.5 15.4 0 18M12 3c-2.5 2.6-2.5 15.4 0 18" />
        </>
    ),
    mail: (
        <>
            <rect x="3" y="5" width="18" height="14" rx="2.5" />
            <path d="m3.5 7.5 7.3 5.2a2 2 0 0 0 2.4 0l7.3-5.2" />
        </>
    ),
    // LinkedIn glyph reads better as a solid mark than as strokes.
    linkedin: (
        <g fill="currentColor" stroke="none">
            <path d="M4.98 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5ZM3 9.5h4v11H3v-11ZM9.5 9.5h3.8v1.5h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.76v5.69h-4v-5.05c0-1.2-.02-2.75-1.75-2.75-1.76 0-2.03 1.31-2.03 2.66v5.14h-4v-11Z" />
        </g>
    ),
    scholar: (
        <>
            <path d="M12 4 2.5 9 12 14l9.5-5L12 4Z" />
            <path d="M6.5 11.3V16c0 1.5 2.5 2.8 5.5 2.8s5.5-1.3 5.5-2.8v-4.7" />
        </>
    ),
    twitter: (
        <g fill="currentColor" stroke="none">
            <path d="M17.3 3h3.3l-7.2 8.2L21.8 21h-6.6l-4.6-6-5.3 6H2l7.7-8.8L2.2 3H9l4.2 5.5L17.3 3Zm-1.2 16h1.8L7.9 4.9H6l10.1 14.1Z" />
        </g>
    ),
    pdf: (
        <>
            <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
            <path d="M14 3v5h5M9 13h6M9 16.5h4" />
        </>
    ),
    doi: (
        <>
            <path d="M10.5 13.5a4 4 0 0 0 5.7 0l2.6-2.6a4 4 0 1 0-5.7-5.7L11.7 6.6" />
            <path d="M13.5 10.5a4 4 0 0 0-5.7 0l-2.6 2.6a4 4 0 1 0 5.7 5.7l1.4-1.4" />
        </>
    ),
    syllabus: (
        <>
            <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H10a2.5 2.5 0 0 1 2 1 2.5 2.5 0 0 1 2-1h4.5A1.5 1.5 0 0 1 20 5.5v12a1.5 1.5 0 0 1-1.5 1.5H14a2.5 2.5 0 0 0-2 1 2.5 2.5 0 0 0-2-1H5.5A1.5 1.5 0 0 1 4 17.5v-12Z" />
            <path d="M12 6v13" />
        </>
    ),
    paper: (
        <>
            <path d="M6 3h9l4 4v14H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
            <path d="M15 3v4h4M8.5 12h7M8.5 15.5h5" />
        </>
    ),
    project: (
        <>
            <rect x="3" y="7" width="18" height="13" rx="2" />
            <path d="M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7M3 12h18" />
        </>
    ),
    pin: (
        <>
            <path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11Z" />
            <circle cx="12" cy="10" r="2.6" />
        </>
    ),
    arrow: <path d="M5 12h13m-5-6 6 6-6 6" />,
};

export function Icon({
    name,
    className = "h-3.5 w-3.5 shrink-0",
}: {
    name: IconName;
    className?: string;
}) {
    return (
        <svg {...BASE} className={className}>
            {PATHS[name]}
        </svg>
    );
}
