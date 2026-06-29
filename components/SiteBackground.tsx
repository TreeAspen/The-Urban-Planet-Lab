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
    // Isotherm isolines — nested, slightly elliptical rings read as a heat-map figure
    const isotherms = [
        { cx: 440, cy: 300, rot: -14, op: 0.14, rs: [46, 96, 146, 196, 246, 296, 346] },
        { cx: 1080, cy: 650, rot: 10, op: 0.12, rs: [50, 106, 162, 218, 274, 330] },
        { cx: 820, cy: 150, rot: -6, op: 0.1, rs: [38, 82, 126, 170, 214] },
    ];

    return (
        <>
            <div className="absolute inset-0 bg-[#f8f3e9] dark:bg-[#05080f]" />

            {/* Sky dome — warm sun glow by day, cool night sky by dark */}
            <div className="absolute inset-0 bg-[radial-gradient(95%_62%_at_50%_-10%,rgba(255,209,128,0.62),rgba(255,236,196,0.2)_42%,transparent_74%)] dark:bg-[radial-gradient(95%_62%_at_50%_-12%,rgba(30,64,104,0.7),rgba(10,24,44,0.32)_45%,transparent_74%)]" />

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

            {/* Restrained warm heat-field blobs (liquid drift) */}
            <div className="animate-blob-a absolute -left-[8%] top-[2%] h-[42vw] w-[42vw] opacity-[0.16] blur-[80px] bg-[#f97316] dark:opacity-[0.22] dark:bg-[#7a2f12]" />
            <div className="animate-blob-b absolute right-[-6%] top-[10%] h-[38vw] w-[38vw] opacity-[0.15] blur-[80px] bg-[#fbbf24] dark:opacity-[0.2] dark:bg-[#8a4b14]" style={{ animationDelay: "-6s" }} />
            <div className="animate-blob-a absolute bottom-[6%] left-[16%] h-[40vw] w-[40vw] opacity-[0.12] blur-[80px] bg-[#fb7185] dark:opacity-[0.18] dark:bg-[#5c2330]" style={{ animationDelay: "-3s" }} />
            <div className="animate-blob-b absolute bottom-[8%] right-[8%] h-[32vw] w-[32vw] opacity-[0.11] blur-[80px] bg-[#2dd4bf] dark:opacity-[0.16] dark:bg-[#14414d]" style={{ animationDelay: "-9s" }} />

            {/* Scientific overlay — coordinate graticule + isotherm isolines (heat-map figure) */}
            <div
                className="absolute inset-0 opacity-[0.6] dark:opacity-[0.5]"
                style={{
                    maskImage: "radial-gradient(135% 112% at 50% 32%, #000 56%, transparent 92%)",
                    WebkitMaskImage: "radial-gradient(135% 112% at 50% 32%, #000 56%, transparent 92%)",
                }}
            >
                <svg
                    aria-hidden="true"
                    viewBox="0 0 1440 900"
                    preserveAspectRatio="xMidYMid slice"
                    className="h-full w-full text-[#243044] dark:text-[#8fb6ec]"
                    fill="none"
                    stroke="currentColor"
                >
                    <defs>
                        <pattern id="uhGraticule" width="120" height="120" patternUnits="userSpaceOnUse">
                            <path d="M60,52 v16 M52,60 h16" strokeWidth="1" strokeOpacity="0.45" />
                        </pattern>
                    </defs>
                    {/* coordinate graticule of fine crosses */}
                    <rect x="0" y="0" width="1440" height="900" stroke="none" fill="url(#uhGraticule)" />
                    {/* isotherm isolines */}
                    {isotherms.map((c, ci) => (
                        <g key={ci} transform={`rotate(${c.rot} ${c.cx} ${c.cy})`} strokeOpacity={c.op} strokeWidth="1.1">
                            {c.rs.map((r, ri) => (
                                <ellipse key={ri} cx={c.cx} cy={c.cy} rx={r} ry={r * 0.78} />
                            ))}
                        </g>
                    ))}
                </svg>
            </div>

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

                {/* Far skyline silhouette (most distant, faint) */}
                <svg
                    aria-hidden="true"
                    viewBox="0 0 1440 400"
                    preserveAspectRatio="none"
                    className="absolute inset-x-0 bottom-0 h-[74%] w-full fill-[#1e293b] opacity-[0.07] dark:fill-[#9cc4ff]"
                >
                    <path d="M0,400 L0,330 L70,330 L70,300 L120,300 L120,338 L165,338 L165,288 L210,288 L210,322 L270,322 L270,296 L330,296 L330,330 L395,330 L395,300 L455,300 L455,334 L520,334 L520,304 L585,304 L585,330 L650,330 L650,298 L715,298 L715,332 L785,332 L785,306 L855,306 L855,330 L925,330 L925,300 L995,300 L995,334 L1065,334 L1065,302 L1135,302 L1135,330 L1205,330 L1205,300 L1275,300 L1275,336 L1350,336 L1350,308 L1440,308 L1440,400 Z" />
                </svg>

                {/* Mid skyline silhouette (depth) */}
                <svg
                    aria-hidden="true"
                    viewBox="0 0 1440 400"
                    preserveAspectRatio="none"
                    className="absolute inset-x-0 bottom-0 h-[88%] w-full fill-[#1e293b] opacity-[0.09] dark:fill-[#9cc4ff]"
                >
                    <path d="M0,400 L0,322 L70,322 L70,300 L140,300 L140,330 L210,330 L210,286 L248,286 L248,268 L280,268 L280,286 L316,286 L316,318 L384,318 L384,290 L452,290 L452,318 L516,318 L516,278 L580,278 L580,318 L642,318 L642,262 L676,262 L676,244 L706,244 L706,262 L740,262 L740,318 L808,318 L808,288 L876,288 L876,318 L938,318 L938,272 L1004,272 L1004,318 L1068,318 L1068,292 L1136,292 L1136,318 L1198,318 L1198,276 L1262,276 L1262,318 L1326,318 L1326,298 L1396,298 L1396,318 L1440,318 L1440,400 Z" />
                </svg>

                {/* Near skyline silhouette (detailed: domes, pitched roofs, towers, tanks) */}
                <svg
                    aria-hidden="true"
                    viewBox="0 0 1440 400"
                    preserveAspectRatio="none"
                    className="absolute inset-x-0 bottom-0 h-full w-full fill-[#1e293b] opacity-10 dark:fill-[#9cc4ff]"
                >
                    <path d="M0,400 L0,300 L46,300 L46,332 L92,332 L92,250 L120,250 L120,228 L150,228 L150,250 L178,250 L178,300 L214,300 L214,256 L246,256 A34 30 0 0 1 314,256 L314,300 L348,300 L348,182 L376,182 L376,158 L396,158 L396,182 L420,182 L420,262 L456,262 L456,300 L494,300 L494,214 L524,182 L554,214 L554,300 L590,300 L590,150 L612,150 L612,120 L626,120 L626,150 L648,150 L648,250 L686,250 L686,300 L726,300 L726,206 L756,206 L756,182 L772,182 L772,206 L800,206 L800,262 L834,262 L834,176 L866,176 A36 34 0 0 1 938,176 L938,262 L978,262 L978,300 L1024,300 L1024,212 L1056,212 L1056,300 L1094,300 L1094,164 L1114,164 L1114,138 L1128,138 L1128,164 L1150,164 L1150,256 L1196,256 L1196,300 L1248,300 L1248,224 L1278,196 L1308,224 L1308,300 L1346,300 L1346,250 L1404,250 L1404,288 L1440,288 L1440,400 Z" />
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
