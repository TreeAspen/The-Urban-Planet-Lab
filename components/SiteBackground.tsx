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
    return (
        <>
            <div className="absolute inset-0 bg-[#f8f3e9] dark:bg-[#05080f]" />

            {/* Sky dome — warm sun glow by day, cool night sky by dark */}
            <div className="absolute inset-0 bg-[radial-gradient(95%_62%_at_50%_-10%,rgba(255,209,128,0.62),rgba(255,236,196,0.2)_42%,transparent_74%)] dark:bg-[radial-gradient(95%_62%_at_50%_-12%,rgba(30,64,104,0.7),rgba(10,24,44,0.32)_45%,transparent_74%)]" />

            {/* Heat plumes / urban heat-island hotspots */}
            <div className="animate-aurora-1 absolute left-[3%] top-[8%] h-[50vh] w-[48vw] rounded-full bg-[radial-gradient(circle_at_center,rgba(244,114,22,0.22),transparent_66%)] blur-3xl dark:bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.34),transparent_62%)]" />
            <div className="animate-aurora-2 absolute right-[2%] top-[20%] h-[46vh] w-[44vw] rounded-full bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.24),transparent_66%)] blur-3xl dark:bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.32),transparent_62%)]" />
            <div className="animate-aurora-3 absolute top-[44%] left-[40%] h-[40vh] w-[40vw] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.14),transparent_66%)] blur-3xl dark:bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.26),transparent_62%)]" style={{ animationDelay: "3s" }} />
            <div className="animate-aurora-1 absolute bottom-[14%] left-[18%] h-[42vh] w-[46vw] rounded-full bg-[radial-gradient(circle_at_center,rgba(248,113,113,0.16),transparent_66%)] blur-3xl dark:bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.24),transparent_62%)]" style={{ animationDelay: "7s" }} />

            {/* Cool counterpoint — vegetation / water cooling */}
            <div className="animate-aurora-2 absolute bottom-[12%] right-[6%] h-[40vh] w-[38vw] rounded-full bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.14),transparent_70%)] blur-3xl dark:bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.2),transparent_70%)]" style={{ animationDelay: "5s" }} />

            {/* Moving thermal scan band */}
            <div className="animate-thermal-sweep absolute -top-[10%] left-0 h-[120%] w-[26vw] bg-[linear-gradient(90deg,transparent,rgba(251,146,60,0.12),transparent)] blur-2xl dark:bg-[linear-gradient(90deg,transparent,rgba(248,113,113,0.16),transparent)]" />

            {/* Thermal isotherm contour rings */}
            <div
                className="absolute inset-0 opacity-50 dark:hidden"
                style={{
                    backgroundImage:
                        "repeating-radial-gradient(circle at 20% 16%, transparent 0 38px, rgba(234,88,12,0.07) 38px 39px, transparent 39px 78px), repeating-radial-gradient(circle at 84% 28%, transparent 0 34px, rgba(245,158,11,0.06) 34px 35px, transparent 35px 70px), repeating-radial-gradient(circle at 60% 78%, transparent 0 46px, rgba(220,38,38,0.05) 46px 47px, transparent 47px 94px)",
                }}
            />
            <div
                className="absolute inset-0 hidden opacity-70 dark:block"
                style={{
                    backgroundImage:
                        "repeating-radial-gradient(circle at 20% 16%, transparent 0 38px, rgba(251,146,60,0.1) 38px 39px, transparent 39px 78px), repeating-radial-gradient(circle at 84% 28%, transparent 0 34px, rgba(250,204,21,0.07) 34px 35px, transparent 35px 70px), repeating-radial-gradient(circle at 60% 78%, transparent 0 46px, rgba(239,68,68,0.09) 46px 47px, transparent 47px 94px)",
                }}
            />

            {/* Pulsing heat-island hotspots */}
            <div className="animate-pulse-glow absolute left-[24%] top-[30%] h-3 w-3 rounded-full bg-orange-500/55 blur-[1px] dark:bg-red-500/70" style={{ animationDelay: "0s" }} />
            <div className="animate-pulse-glow absolute right-[22%] top-[38%] h-2.5 w-2.5 rounded-full bg-amber-500/50 blur-[1px] dark:bg-orange-400/70" style={{ animationDelay: "1.4s" }} />
            <div className="animate-pulse-glow absolute left-[58%] top-[22%] h-2 w-2 rounded-full bg-red-500/45 blur-[1px] dark:bg-amber-300/70" style={{ animationDelay: "2.6s" }} />
            <div className="animate-pulse-glow absolute left-[12%] bottom-[34%] h-2.5 w-2.5 rounded-full bg-orange-600/45 blur-[1px] dark:bg-red-400/65" style={{ animationDelay: "0.8s" }} />

            {/* Top fade only — keep the skyline crisp at the bottom */}
            <div className="absolute inset-x-0 top-0 h-44 bg-[linear-gradient(180deg,rgba(243,241,234,0.85),transparent)] dark:bg-[linear-gradient(180deg,rgba(5,8,15,0.92),transparent)]" />

            {/* City skyline + heat haze rising from it */}
            <div className="absolute inset-x-0 bottom-0 h-[26vh] sm:h-[30vh]">
                <div className="animate-heat-haze absolute inset-x-0 bottom-0 h-full bg-[linear-gradient(0deg,rgba(251,146,60,0.26),rgba(251,191,36,0.07)_46%,transparent_82%)] blur-2xl dark:bg-[linear-gradient(0deg,rgba(239,68,68,0.32),rgba(249,115,22,0.1)_46%,transparent_82%)]" />
                <svg
                    aria-hidden="true"
                    viewBox="0 0 1440 320"
                    preserveAspectRatio="none"
                    className="absolute inset-x-0 bottom-0 h-full w-full fill-slate-900/[0.09] dark:fill-[#01040a]/85"
                >
                    <path d="M0,320 L0,250 L40,250 L40,210 L95,210 L95,250 L130,250 L130,170 L175,170 L175,140 L205,140 L205,170 L250,170 L250,235 L300,235 L300,120 L335,120 L335,95 L360,95 L360,120 L405,120 L405,200 L455,200 L455,160 L510,160 L510,225 L560,225 L560,110 L600,110 L600,80 L625,80 L625,110 L670,110 L670,185 L720,185 L720,150 L775,150 L775,240 L820,240 L820,130 L865,130 L865,175 L915,175 L915,205 L965,205 L965,100 L1000,100 L1000,75 L1025,75 L1025,100 L1070,100 L1070,165 L1120,165 L1120,220 L1170,220 L1170,140 L1220,140 L1220,190 L1275,190 L1275,235 L1325,235 L1325,160 L1380,160 L1380,250 L1440,250 L1440,320 Z" />
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
