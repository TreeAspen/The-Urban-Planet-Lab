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
    classic: ClassicBackground,
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
    // Isotherm isolines — two well-separated centres so contours never cross
    const isotherms = [
        { cx: 380, cy: 310, rot: -12, op: 0.14, rs: [48, 94, 140, 186, 232] },
        { cx: 1095, cy: 650, rot: 12, op: 0.12, rs: [52, 102, 152, 202, 252] },
    ];

    return (
        <>
            <div className="absolute inset-0 bg-[#f8f3e9] dark:bg-[#05080f]" />

            {/* Sky dome — warm sun glow by day, cool night sky by dark (gently breathing) */}
            <div className="animate-sky-breathe absolute inset-0 bg-[radial-gradient(95%_62%_at_50%_-10%,rgba(255,209,128,0.62),rgba(255,236,196,0.2)_42%,transparent_74%)] dark:bg-[radial-gradient(95%_62%_at_50%_-12%,rgba(30,64,104,0.7),rgba(10,24,44,0.32)_45%,transparent_74%)]" />

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
                        <filter id="uhWarp" x="-25%" y="-25%" width="150%" height="150%">
                            <feTurbulence type="fractalNoise" baseFrequency="0.006 0.007" numOctaves="1" seed="7" result="n">
                                <animate attributeName="baseFrequency" dur="22s" values="0.006 0.007;0.0072 0.0061;0.006 0.007" repeatCount="indefinite" />
                            </feTurbulence>
                            <feDisplacementMap in="SourceGraphic" in2="n" scale="24" xChannelSelector="R" yChannelSelector="G" />
                        </filter>
                    </defs>
                    {/* isotherm isolines, warped into irregular contours */}
                    <g filter="url(#uhWarp)">
                        {isotherms.map((c, ci) => (
                            <g key={ci} transform={`rotate(${c.rot} ${c.cx} ${c.cy})`} strokeOpacity={c.op} strokeWidth="1.1">
                                {c.rs.map((r, ri) => (
                                    <ellipse key={ri} cx={c.cx} cy={c.cy} rx={r} ry={r * 0.78} />
                                ))}
                            </g>
                        ))}
                    </g>
                </svg>
            </div>

            {/* Moving thermal scan band */}
            <div className="animate-thermal-sweep absolute -top-[10%] left-0 h-[120%] w-[26vw] bg-[linear-gradient(90deg,transparent,rgba(251,146,60,0.1),transparent)] blur-2xl dark:bg-[linear-gradient(90deg,transparent,rgba(248,113,113,0.14),transparent)]" />

            {/* Ambient rising heat motes */}
            {[
                { l: "16%", d: "9s", delay: "0s" },
                { l: "33%", d: "11s", delay: "3s" },
                { l: "50%", d: "10s", delay: "1.4s" },
                { l: "67%", d: "12s", delay: "4.6s" },
                { l: "84%", d: "9.5s", delay: "2.3s" },
            ].map((m, i) => (
                <span
                    key={i}
                    className="animate-mote absolute bottom-[18%] h-1.5 w-1.5 rounded-full bg-amber-400/40 blur-[1px] dark:bg-orange-300/45"
                    style={{ left: m.l, animationDuration: m.d, animationDelay: m.delay }}
                />
            ))}

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
                    className="absolute inset-x-0 bottom-0 h-[74%] w-full fill-[#1e293b] opacity-[0.05] dark:fill-[#9cc4ff]"
                >
                    <path d="M0,400 L0,340 L42,340 L42,318 L86,318 L86,300 L112,300 A20 18 0 0 1 152,300 L152,340 L196,340 L196,312 L240,312 L240,292 L262,292 L262,312 L298,312 L298,342 L356,342 L356,314 L386,314 L386,300 L402,300 L402,314 L428,314 L428,338 L484,338 L484,306 L512,288 L540,306 L540,338 L596,338 L596,302 L646,302 L646,340 L706,340 L706,316 L732,316 L732,302 L748,302 L748,316 L776,316 L776,342 L846,342 L846,314 L878,314 A24 20 0 0 1 942,314 L942,342 L1006,342 L1006,318 L1072,318 L1072,300 L1092,300 L1092,318 L1136,318 L1136,342 L1202,342 L1202,312 L1246,312 L1246,332 L1296,332 L1296,300 L1324,300 L1324,332 L1366,332 L1366,340 L1440,340 L1440,400 Z" />
                </svg>

                {/* Near skyline silhouette (detailed: domes, pitched roofs, towers, tanks) */}
                <svg
                    aria-hidden="true"
                    viewBox="0 0 1440 400"
                    preserveAspectRatio="none"
                    className="absolute inset-x-0 bottom-0 h-full w-full fill-[#1e293b] opacity-[0.07] dark:fill-[#9cc4ff]"
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

/* ── Classic: the site's original aurora + floating-glass-cards background ───── */
function ClassicBackground() {
    return (
        <>
            <div className="absolute inset-0 bg-[#f1eee6] dark:bg-[#071118]" />

            {/* Aurora blobs — light mode */}
            <div className="animate-aurora-1 absolute -left-[10%] top-[5%] h-[55vh] w-[55vw] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(14,165,233,0.13),transparent_70%)] blur-3xl dark:hidden" style={{ animationDelay: "0s" }} />
            <div className="animate-aurora-2 absolute right-[-8%] top-[20%] h-[50vh] w-[48vw] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.09),transparent_70%)] blur-3xl dark:hidden" style={{ animationDelay: "4s" }} />
            <div className="animate-aurora-3 absolute bottom-[10%] left-[20%] h-[45vh] w-[50vw] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(34,197,94,0.07),transparent_70%)] blur-3xl dark:hidden" style={{ animationDelay: "8s" }} />

            {/* Aurora blobs — dark mode */}
            <div className="animate-aurora-1 absolute -left-[10%] top-[5%] hidden h-[55vh] w-[55vw] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.1),transparent_70%)] blur-3xl dark:block" style={{ animationDelay: "0s" }} />
            <div className="animate-aurora-2 absolute right-[-8%] top-[20%] hidden h-[50vh] w-[48vw] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(251,191,36,0.07),transparent_70%)] blur-3xl dark:block" style={{ animationDelay: "4s" }} />
            <div className="animate-aurora-3 absolute bottom-[10%] left-[20%] hidden h-[45vh] w-[50vw] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(52,211,153,0.07),transparent_70%)] blur-3xl dark:block" style={{ animationDelay: "8s" }} />

            <div className="absolute inset-0 bg-[radial-gradient(78%_54%_at_50%_0%,rgba(255,255,255,0.94),rgba(255,255,255,0.5)_42%,transparent_78%),linear-gradient(180deg,rgba(241,238,230,0.65)_0%,rgba(233,228,218,0.84)_56%,rgba(227,221,209,0.92)_100%)] dark:bg-[radial-gradient(78%_54%_at_50%_0%,rgba(18,31,39,0.92),rgba(7,17,24,0.42)_42%,transparent_78%),linear-gradient(180deg,rgba(7,17,24,0.82)_0%,rgba(7,17,24,0.92)_52%,rgba(4,10,15,1)_100%)]" />

            <div className="absolute inset-0 dark:hidden" style={{ backgroundImage: "linear-gradient(rgba(15,23,32,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,32,0.035) 1px, transparent 1px)", backgroundSize: "36px 36px" }} />
            <div className="absolute inset-0 hidden dark:block" style={{ backgroundImage: "linear-gradient(rgba(226,232,240,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(226,232,240,0.04) 1px, transparent 1px)", backgroundSize: "36px 36px" }} />
            <div className="absolute inset-0 dark:hidden" style={{ backgroundImage: "linear-gradient(rgba(15,23,32,0.075) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,32,0.075) 1px, transparent 1px)", backgroundSize: "180px 180px" }} />
            <div className="absolute inset-0 hidden dark:block" style={{ backgroundImage: "linear-gradient(rgba(226,232,240,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(226,232,240,0.07) 1px, transparent 1px)", backgroundSize: "180px 180px" }} />

            <div className="absolute inset-0 opacity-60 dark:hidden" style={{ backgroundImage: "repeating-linear-gradient(124deg, transparent 0 250px, rgba(14,165,233,0.13) 250px 252px, transparent 252px 500px), repeating-linear-gradient(32deg, transparent 0 320px, rgba(15,23,32,0.05) 320px 321px, transparent 321px 640px)" }} />
            <div className="absolute inset-0 hidden opacity-55 dark:block" style={{ backgroundImage: "repeating-linear-gradient(124deg, transparent 0 250px, rgba(34,211,238,0.11) 250px 252px, transparent 252px 500px), repeating-linear-gradient(32deg, transparent 0 320px, rgba(226,232,240,0.06) 320px 321px, transparent 321px 640px)" }} />

            <div className="animate-float-slow absolute left-[4%] top-20 h-[15rem] w-[24rem] rounded-[2.8rem] border border-black/8 bg-white/18 shadow-[0_20px_70px_rgba(15,23,32,0.05)] dark:border-white/10 dark:bg-white/[0.03] dark:shadow-[0_24px_70px_rgba(0,0,0,0.22)]" style={{ animationDelay: "0s" }} />
            <div className="animate-float-slow absolute left-[8%] top-28 h-[15rem] w-[24rem] rounded-[2.8rem] border border-black/6 dark:border-white/8" style={{ animationDelay: "1.5s" }} />
            <div className="animate-float-medium absolute right-[5%] top-[9rem] h-[18rem] w-[22rem] rounded-[2.8rem] border border-black/8 bg-black/[0.025] dark:border-white/10 dark:bg-white/[0.025]" style={{ animationDelay: "0.8s" }} />
            <div className="animate-float-medium absolute right-[9%] top-[12.5rem] h-[9rem] w-[15rem] rounded-[2rem] border border-cyan-500/20 dark:border-cyan-300/22" style={{ animationDelay: "2s" }} />
            <div className="animate-drift absolute right-[14%] top-[15rem] h-[4rem] w-[4rem] rounded-full border border-amber-500/24 dark:border-amber-300/24" style={{ animationDelay: "1s" }} />
            <div className="animate-float-slow absolute bottom-[18%] left-[11%] h-[12rem] w-[18rem] rounded-[2.2rem] border border-black/8 bg-white/16 dark:border-white/10 dark:bg-white/[0.02]" style={{ animationDelay: "3s" }} />
            <div className="animate-float-slow absolute bottom-[14%] left-[16%] h-[8rem] w-[12rem] rounded-[1.8rem] border border-black/6 dark:border-white/8" style={{ animationDelay: "4.5s" }} />
            <div className="animate-float-medium absolute bottom-[20%] right-[7%] h-[14rem] w-[26rem] rounded-[3rem] border border-black/8 bg-white/12 dark:border-white/10 dark:bg-white/[0.025]" style={{ animationDelay: "1.2s" }} />
            <div className="animate-float-medium absolute bottom-[23%] right-[12%] h-[14rem] w-[26rem] rounded-[3rem] border border-black/6 dark:border-white/8" style={{ animationDelay: "2.8s" }} />

            <div className="absolute left-[18%] top-[30%] h-px w-[44rem] rotate-[16deg] bg-[linear-gradient(90deg,transparent,rgba(14,165,233,0.38),transparent)] dark:bg-[linear-gradient(90deg,transparent,rgba(34,211,238,0.34),transparent)]" />
            <div className="absolute left-[46%] top-[18%] h-px w-[32rem] rotate-[112deg] bg-[linear-gradient(90deg,transparent,rgba(245,158,11,0.26),transparent)] dark:bg-[linear-gradient(90deg,transparent,rgba(251,191,36,0.2),transparent)]" />
            <div className="absolute left-[30%] top-[58%] h-px w-[24rem] rotate-[-12deg] bg-[linear-gradient(90deg,transparent,rgba(15,23,32,0.18),transparent)] dark:bg-[linear-gradient(90deg,transparent,rgba(226,232,240,0.14),transparent)]" />

            <div className="animate-pulse-glow absolute left-[10%] top-[22%] h-3 w-3 rounded-full bg-cyan-500/35 blur-[1px] dark:bg-cyan-300/45" style={{ animationDelay: "0s" }} />
            <div className="animate-pulse-glow absolute right-[16%] top-[44%] h-3 w-3 rounded-full bg-amber-500/30 blur-[1px] dark:bg-amber-300/35" style={{ animationDelay: "2s" }} />
            <div className="animate-pulse-glow absolute bottom-[18%] left-[34%] h-2.5 w-2.5 rounded-full bg-black/18 dark:bg-white/18" style={{ animationDelay: "1s" }} />

            <div className="absolute inset-x-0 top-0 h-40 bg-[linear-gradient(180deg,rgba(255,255,255,0.72),transparent)] dark:bg-[linear-gradient(180deg,rgba(7,17,24,0.82),transparent)]" />
            <div className="absolute inset-x-0 bottom-0 h-44 bg-[linear-gradient(0deg,rgba(241,238,230,0.94),transparent)] dark:bg-[linear-gradient(0deg,rgba(7,17,24,0.97),transparent)]" />
            <div className="absolute inset-y-0 left-0 w-20 bg-[linear-gradient(90deg,rgba(241,238,230,0.94),transparent)] dark:bg-[linear-gradient(90deg,rgba(7,17,24,0.94),transparent)]" />
            <div className="absolute inset-y-0 right-0 w-20 bg-[linear-gradient(270deg,rgba(241,238,230,0.94),transparent)] dark:bg-[linear-gradient(270deg,rgba(7,17,24,0.94),transparent)]" />
        </>
    );
}
