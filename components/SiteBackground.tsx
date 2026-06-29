import type { ReactElement } from "react";
import type { BackgroundVariant } from "@/lib/content";

/**
 * Decorative site-wide background. Pick a variant from the Site Settings page
 * in the CMS. Every variant supports both light and dark themes and sits behind
 * all page content (fixed, pointer-events-none, -z-10).
 */
export default function SiteBackground({
    variant = "mesh",
}: {
    variant?: BackgroundVariant;
}) {
    return (
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
            {VARIANTS[variant]?.() ?? VARIANTS.mesh()}
        </div>
    );
}

const VARIANTS: Record<BackgroundVariant, () => ReactElement> = {
    urbanheat: UrbanHeatBackground,
    mesh: MeshBackground,
    aurora: AuroraBackground,
    dots: DotsBackground,
    grid: GridBackground,
    glow: GlowBackground,
    plain: PlainBackground,
};

/** Shared base fill so the body colour never shows a hard seam. */
function BaseFill() {
    return <div className="absolute inset-0 bg-[#f3f1ea] dark:bg-[#06121a]" />;
}

/** Soft top/bottom fades that keep text legible over busier variants. */
function EdgeFades() {
    return (
        <>
            <div className="absolute inset-x-0 top-0 h-44 bg-[linear-gradient(180deg,rgba(243,241,234,0.85),transparent)] dark:bg-[linear-gradient(180deg,rgba(6,18,26,0.9),transparent)]" />
            <div className="absolute inset-x-0 bottom-0 h-48 bg-[linear-gradient(0deg,rgba(243,241,234,0.92),transparent)] dark:bg-[linear-gradient(0deg,rgba(6,18,26,0.96),transparent)]" />
        </>
    );
}

/* ── Urban Heat: signature day/night thermal identity (default) ─────────────────
   Day  — a warm city baking under the sun: amber sky dome, orange heat plumes,
          a cool teal "cooling corridor", over faint isotherm contour rings.
   Night — a thermal-infrared satellite view: deep blue base with glowing red /
          orange urban heat-island hotspots and ember-coloured isotherms.        */
function UrbanHeatBackground() {
    // Angled downtown grid — short blocks inside the ring road
    const gridV = [720, 775, 830, 885, 940, 995, 1050];
    const gridH = [400, 455, 510, 565, 620, 675];

    return (
        <>
            <div className="absolute inset-0 bg-[#f8f3e9] dark:bg-[#05080f]" />

            {/* Sky dome — warm sun glow by day, cool night sky by dark */}
            <div className="absolute inset-0 bg-[radial-gradient(95%_62%_at_50%_-10%,rgba(255,209,128,0.62),rgba(255,236,196,0.2)_42%,transparent_74%)] dark:bg-[radial-gradient(95%_62%_at_50%_-12%,rgba(30,64,104,0.7),rgba(10,24,44,0.32)_45%,transparent_74%)]" />

            {/* Real road-network map: river, arteries, ring road, angled downtown grid */}
            <div
                className="absolute inset-0 opacity-[0.5] dark:opacity-[0.48]"
                style={{
                    maskImage: "radial-gradient(132% 108% at 50% 30%, #000 50%, transparent 90%)",
                    WebkitMaskImage: "radial-gradient(132% 108% at 50% 30%, #000 50%, transparent 90%)",
                }}
            >
                <svg
                    aria-hidden="true"
                    viewBox="0 0 1600 1000"
                    preserveAspectRatio="xMidYMid slice"
                    className="h-full w-full text-[#26334a] dark:text-[#86b0ec]"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    {/* River */}
                    <g className="text-sky-700/35 dark:text-sky-500/25">
                        <path d="M-60,560 C 240,490 360,690 620,632 C 880,576 1000,724 1260,660 C 1440,616 1540,684 1680,640" strokeWidth="26" />
                    </g>
                    {/* Major arteries */}
                    <g strokeOpacity="0.5" strokeWidth="3.4">
                        <path d="M-60,300 C 300,228 580,404 900,344 C 1180,292 1430,388 1680,332" />
                        <path d="M-60,792 C 360,752 700,860 1060,800 C 1330,756 1520,816 1680,788" />
                        <path d="M360,-60 C 430,260 300,520 470,820 C 560,980 520,1020 600,1060" />
                        <path d="M1190,-60 C 1120,260 1320,520 1170,880" />
                    </g>
                    {/* Diagonal highway */}
                    <path d="M-60,1000 C 520,640 1000,420 1680,110" strokeOpacity="0.42" strokeWidth="3.6" />
                    {/* Ring road around downtown */}
                    <ellipse cx="885" cy="540" rx="250" ry="182" strokeOpacity="0.45" strokeWidth="2.6" />
                    {/* Secondary connectors */}
                    <g strokeOpacity="0.4" strokeWidth="1.6">
                        <path d="M520,210 C 620,330 700,430 770,520" />
                        <path d="M1060,250 C 1000,360 940,460 905,540" />
                        <path d="M690,900 C 770,800 830,740 880,712" />
                        <path d="M300,560 C 470,585 580,592 645,600" />
                        <path d="M1180,648 C 1340,612 1430,588 1520,560" />
                    </g>
                    {/* Angled downtown grid */}
                    <g transform="rotate(13 885 540)" strokeOpacity="0.32" strokeWidth="1">
                        {gridV.map((x) => (
                            <line key={`v${x}`} x1={x} y1={382} x2={x} y2={700} />
                        ))}
                        {gridH.map((y) => (
                            <line key={`h${y}`} x1={702} y1={y} x2={1072} y2={y} />
                        ))}
                    </g>
                </svg>
            </div>

            {/* Fractal-noise grain (soft-light) for a printed-map texture */}
            <svg aria-hidden="true" className="absolute h-0 w-0">
                <defs>
                    <filter id="uhNoise">
                        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
                    </filter>
                </defs>
            </svg>
            <div
                className="absolute inset-0 opacity-[0.16] mix-blend-soft-light dark:opacity-[0.1]"
                style={{ filter: "url(#uhNoise)" }}
            />

            {/* Organic morphing heat blobs (liquid drift) */}
            <div className="animate-blob-a absolute -left-[8%] top-[2%] h-[42vw] w-[42vw] opacity-[0.22] blur-[80px] bg-[#f97316] dark:opacity-[0.28] dark:bg-[#7a2f12]" />
            <div className="animate-blob-b absolute right-[-6%] top-[10%] h-[38vw] w-[38vw] opacity-[0.2] blur-[80px] bg-[#fbbf24] dark:opacity-[0.24] dark:bg-[#8a4b14]" style={{ animationDelay: "-6s" }} />
            <div className="animate-blob-a absolute bottom-[6%] left-[16%] h-[40vw] w-[40vw] opacity-[0.16] blur-[80px] bg-[#fb7185] dark:opacity-[0.22] dark:bg-[#5c2330]" style={{ animationDelay: "-3s" }} />
            <div className="animate-blob-b absolute bottom-[8%] right-[8%] h-[32vw] w-[32vw] opacity-[0.15] blur-[80px] bg-[#2dd4bf] dark:opacity-[0.2] dark:bg-[#14414d]" style={{ animationDelay: "-9s" }} />

            {/* Moving thermal scan band */}
            <div className="animate-thermal-sweep absolute -top-[10%] left-0 h-[120%] w-[26vw] bg-[linear-gradient(90deg,transparent,rgba(251,146,60,0.1),transparent)] blur-2xl dark:bg-[linear-gradient(90deg,transparent,rgba(248,113,113,0.14),transparent)]" />

            {/* Top fade only — keep the skyline crisp at the bottom */}
            <div className="absolute inset-x-0 top-0 h-44 bg-[linear-gradient(180deg,rgba(243,241,234,0.85),transparent)] dark:bg-[linear-gradient(180deg,rgba(5,8,15,0.92),transparent)]" />

            {/* City skyline + heat haze rising from it */}
            <div className="absolute inset-x-0 bottom-0 h-[36vh] sm:h-[42vh]">
                {/* Rising heat haze — soft, warm, multi-stop so there is no hard band */}
                <div className="animate-heat-haze absolute inset-x-0 bottom-0 h-full bg-[linear-gradient(0deg,rgba(251,146,60,0.34),rgba(251,146,60,0.2)_24%,rgba(251,191,36,0.1)_46%,rgba(251,191,36,0.04)_66%,transparent_88%)] blur-[64px] dark:bg-[linear-gradient(0deg,rgba(249,115,22,0.4),rgba(244,114,60,0.22)_24%,rgba(245,158,11,0.1)_46%,rgba(245,158,11,0.04)_66%,transparent_88%)]" />
                {/* Soft glowing rim near the rooftops */}
                <div className="absolute inset-x-0 bottom-[42%] h-1 bg-[linear-gradient(90deg,transparent,rgba(251,146,60,0.3),rgba(249,115,22,0.26),transparent)] blur-[6px] dark:bg-[linear-gradient(90deg,transparent,rgba(249,115,22,0.38),rgba(248,113,113,0.3),transparent)]" />

                {/* Far skyline — line drawing (lighter, depth) */}
                <svg
                    aria-hidden="true"
                    viewBox="0 0 1440 400"
                    preserveAspectRatio="none"
                    className="absolute inset-x-0 bottom-0 h-[82%] w-full text-[#26334a] dark:text-[#86b0ec]"
                    fill="none"
                    stroke="currentColor"
                    strokeOpacity="0.26"
                    strokeWidth="1.3"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                >
                    <path d="M0,400 L0,330 L70,330 L70,300 L120,300 L120,338 L165,338 L165,288 L210,288 L210,322 L270,322 L270,296 L330,296 L330,330 L395,330 L395,300 L455,300 L455,334 L520,334 L520,304 L585,304 L585,330 L650,330 L650,298 L715,298 L715,332 L785,332 L785,306 L855,306 L855,330 L925,330 L925,300 L995,300 L995,334 L1065,334 L1065,302 L1135,302 L1135,330 L1205,330 L1205,300 L1275,300 L1275,336 L1350,336 L1350,308 L1440,308" vectorEffect="non-scaling-stroke" />
                </svg>

                {/* Near skyline — line drawing (taller, detailed setbacks) */}
                <svg
                    aria-hidden="true"
                    viewBox="0 0 1440 400"
                    preserveAspectRatio="none"
                    className="absolute inset-x-0 bottom-0 h-full w-full text-[#26334a] dark:text-[#9cc4ff]"
                    fill="none"
                    stroke="currentColor"
                    strokeOpacity="0.5"
                    strokeWidth="1.7"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                >
                    <path d="M0,400 L0,312 L66,312 L66,282 L112,282 L112,330 L150,330 L150,232 L176,232 L176,210 L206,210 L206,232 L232,232 L232,300 L272,300 L272,262 L332,262 L332,300 L362,300 L362,182 L382,182 L382,150 L412,150 L412,182 L432,182 L432,252 L472,252 L472,300 L522,300 L522,222 L562,222 L562,300 L602,300 L602,142 L617,142 L617,110 L647,110 L647,142 L662,142 L662,240 L702,240 L702,290 L762,290 L762,202 L802,202 L802,262 L842,262 L842,162 L862,162 L862,130 L892,130 L892,162 L912,162 L912,252 L952,252 L952,300 L1002,300 L1002,212 L1042,212 L1042,300 L1082,300 L1082,172 L1102,172 L1102,150 L1132,150 L1132,172 L1152,172 L1152,262 L1202,262 L1202,300 L1257,300 L1257,232 L1302,232 L1302,300 L1342,300 L1342,252 L1402,252 L1402,290 L1440,290" vectorEffect="non-scaling-stroke" />
                </svg>
            </div>
        </>
    );
}

/* ── Mesh: layered colour fields, soft and modern ───────────────────────────── */
function MeshBackground() {
    return (
        <>
            <BaseFill />
            <div className="animate-aurora-1 absolute -left-[15%] -top-[10%] h-[70vh] w-[70vw] rounded-full bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.22),transparent_68%)] blur-3xl dark:bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.16),transparent_68%)]" />
            <div className="animate-aurora-2 absolute -right-[12%] top-[4%] h-[62vh] w-[60vw] rounded-full bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.16),transparent_68%)] blur-3xl dark:bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.15),transparent_68%)]" />
            <div className="animate-aurora-3 absolute bottom-[-12%] left-[8%] h-[60vh] w-[58vw] rounded-full bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.16),transparent_68%)] blur-3xl dark:bg-[radial-gradient(circle_at_center,rgba(52,211,153,0.13),transparent_68%)]" />
            <div className="animate-aurora-1 absolute bottom-[-8%] right-[6%] h-[52vh] w-[52vw] rounded-full bg-[radial-gradient(circle_at_center,rgba(250,204,21,0.14),transparent_68%)] blur-3xl dark:bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.14),transparent_68%)]" style={{ animationDelay: "6s" }} />
            <EdgeFades />
        </>
    );
}

/* ── Aurora: a few slow drifting colour blobs over a calm base ──────────────── */
function AuroraBackground() {
    return (
        <>
            <BaseFill />
            <div className="absolute inset-0 bg-[radial-gradient(78%_54%_at_50%_0%,rgba(255,255,255,0.55),transparent_70%)] dark:bg-[radial-gradient(78%_54%_at_50%_0%,rgba(18,31,39,0.7),transparent_70%)]" />
            <div className="animate-aurora-1 absolute -left-[10%] top-[6%] h-[55vh] w-[55vw] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(14,165,233,0.15),transparent_70%)] blur-3xl dark:bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.12),transparent_70%)]" />
            <div className="animate-aurora-2 absolute right-[-8%] top-[24%] h-[50vh] w-[48vw] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.1),transparent_70%)] blur-3xl dark:bg-[radial-gradient(ellipse_at_center,rgba(251,191,36,0.08),transparent_70%)]" />
            <div className="animate-aurora-3 absolute bottom-[8%] left-[22%] h-[48vh] w-[52vw] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(34,197,94,0.09),transparent_70%)] blur-3xl dark:bg-[radial-gradient(ellipse_at_center,rgba(52,211,153,0.08),transparent_70%)]" />
            <EdgeFades />
        </>
    );
}

/* ── Dots: subtle dotted texture over a faint top glow ──────────────────────── */
function DotsBackground() {
    return (
        <>
            <BaseFill />
            <div className="absolute inset-0 bg-[radial-gradient(70%_50%_at_50%_0%,rgba(56,189,248,0.1),transparent_72%)] dark:bg-[radial-gradient(70%_50%_at_50%_0%,rgba(34,211,238,0.1),transparent_72%)]" />
            <div
                className="absolute inset-0 dark:hidden"
                style={{
                    backgroundImage: "radial-gradient(rgba(15,23,32,0.13) 1px, transparent 1.6px)",
                    backgroundSize: "24px 24px",
                }}
            />
            <div
                className="absolute inset-0 hidden dark:block"
                style={{
                    backgroundImage: "radial-gradient(rgba(226,232,240,0.12) 1px, transparent 1.6px)",
                    backgroundSize: "24px 24px",
                }}
            />
            <EdgeFades />
        </>
    );
}

/* ── Grid: clean blueprint lines, minimal ───────────────────────────────────── */
function GridBackground() {
    return (
        <>
            <BaseFill />
            <div className="absolute inset-0 bg-[radial-gradient(80%_55%_at_50%_-5%,rgba(99,102,241,0.1),transparent_70%)] dark:bg-[radial-gradient(80%_55%_at_50%_-5%,rgba(99,102,241,0.12),transparent_70%)]" />
            <div
                className="absolute inset-0 dark:hidden"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(15,23,32,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,32,0.06) 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                }}
            />
            <div
                className="absolute inset-0 hidden dark:block"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(226,232,240,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(226,232,240,0.06) 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                }}
            />
            <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_50%,transparent_55%,rgba(243,241,234,0.6))] dark:bg-[radial-gradient(120%_120%_at_50%_50%,transparent_55%,rgba(6,18,26,0.7))]" />
            <EdgeFades />
        </>
    );
}

/* ── Glow: single focused centre glow, very clean ───────────────────────────── */
function GlowBackground() {
    return (
        <>
            <BaseFill />
            <div className="absolute left-1/2 top-[-18%] h-[70vh] w-[80vw] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.18),transparent_65%)] blur-3xl dark:bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.16),transparent_65%)]" />
            <div className="absolute left-1/2 top-[6%] h-[50vh] w-[55vw] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.1),transparent_65%)] blur-3xl dark:bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.1),transparent_65%)]" />
            <EdgeFades />
        </>
    );
}

/* ── Plain: smooth single gradient, no texture ──────────────────────────────── */
function PlainBackground() {
    return (
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#f6f4ee_0%,#eee9df_55%,#e7e1d4_100%)] dark:bg-[linear-gradient(180deg,#0a1620_0%,#081119_55%,#050d13_100%)]" />
    );
}
