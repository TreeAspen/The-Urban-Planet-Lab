"use client";

import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";

type Mode = "light" | "dark" | "auto";

const MODE_KEY = "upl-theme-mode";
const MODE_ORDER: Mode[] = ["light", "dark", "auto"];

const MODE_LABELS: Record<Mode, string> = {
    light: "Light",
    dark: "Dark",
    auto: "Auto",
};

/** Light during the day (07:00–18:59), dark at night. */
function themeForNow(): "light" | "dark" {
    const hour = new Date().getHours();
    return hour >= 7 && hour < 19 ? "light" : "dark";
}

function SunIcon() {
    return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-[1.05rem] w-[1.05rem]" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
    );
}

function MoonIcon() {
    return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-[1.05rem] w-[1.05rem]" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
    );
}

function AutoIcon() {
    return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-[1.05rem] w-[1.05rem]" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" stroke="none" />
        </svg>
    );
}

const MODE_ICONS: Record<Mode, () => React.ReactElement> = {
    light: SunIcon,
    dark: MoonIcon,
    auto: AutoIcon,
};

export default function ThemeToggle({ mobile = false }: { mobile?: boolean }) {
    const { setTheme } = useTheme();
    const [mode, setMode] = useState<Mode>("auto");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem(MODE_KEY) as Mode | null;
        if (saved === "light" || saved === "dark" || saved === "auto") {
            setMode(saved);
        }
    }, []);

    // Apply the resolved theme whenever the mode changes; in "auto" keep it in
    // sync with the time of day.
    useEffect(() => {
        if (!mounted) return;

        const apply = () => setTheme(mode === "auto" ? themeForNow() : mode);
        apply();

        if (mode !== "auto") return;
        const id = window.setInterval(apply, 60_000);
        return () => window.clearInterval(id);
    }, [mode, mounted, setTheme]);

    const cycle = useCallback(() => {
        setMode((current) => {
            const next = MODE_ORDER[(MODE_ORDER.indexOf(current) + 1) % MODE_ORDER.length];
            localStorage.setItem(MODE_KEY, next);
            return next;
        });
    }, []);

    // Avoid hydration mismatch — render a neutral placeholder until mounted.
    const activeMode: Mode = mounted ? mode : "auto";
    const Icon = MODE_ICONS[activeMode];
    const label = `Theme: ${MODE_LABELS[activeMode]}`;

    if (mobile) {
        return (
            <button
                type="button"
                onClick={cycle}
                aria-label={`${label} (click to change)`}
                className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm tracking-wide text-black/80 transition-colors duration-200 hover:bg-black/5 hover:text-black dark:text-white/80 dark:hover:bg-white/10 dark:hover:text-white"
            >
                <span>Appearance</span>
                <span className="flex items-center gap-2 text-black dark:text-white">
                    <Icon />
                    {MODE_LABELS[activeMode]}
                </span>
            </button>
        );
    }

    return (
        <button
            type="button"
            onClick={cycle}
            aria-label={`${label} (click to change)`}
            title={label}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white/70 text-black/80 transition-colors duration-200 hover:bg-white hover:text-black dark:border-white/15 dark:bg-black/60 dark:text-white/80 dark:hover:bg-black/85 dark:hover:text-white"
        >
            <motion.span
                key={activeMode}
                initial={{ rotate: -45, opacity: 0, scale: 0.7 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                transition={{ duration: 0.25 }}
                className="flex items-center justify-center"
            >
                <Icon />
            </motion.span>
        </button>
    );
}
