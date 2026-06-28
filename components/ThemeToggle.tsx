"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

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

export default function ThemeToggle({ mobile = false }: { mobile?: boolean }) {
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    const isDark = mounted && resolvedTheme === "dark";
    const toggle = () => setTheme(isDark ? "light" : "dark");
    const targetLabel = isDark ? "Switch to day mode" : "Switch to night mode";
    // Show the icon of the *current* theme; before mount default to the sun.
    const Icon = isDark ? MoonIcon : SunIcon;

    if (mobile) {
        return (
            <button
                type="button"
                onClick={toggle}
                aria-label={targetLabel}
                className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm tracking-wide text-black/80 transition-colors duration-200 hover:bg-black/5 hover:text-black dark:text-white/80 dark:hover:bg-white/10 dark:hover:text-white"
            >
                <span>Appearance</span>
                <span className="flex items-center gap-2 text-black dark:text-white">
                    <Icon />
                    {mounted ? (isDark ? "Night" : "Day") : "Day"}
                </span>
            </button>
        );
    }

    return (
        <button
            type="button"
            onClick={toggle}
            aria-label={targetLabel}
            title={targetLabel}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white/70 text-black/80 transition-colors duration-200 hover:bg-white hover:text-black dark:border-white/15 dark:bg-black/60 dark:text-white/80 dark:hover:bg-black/85 dark:hover:text-white"
        >
            <motion.span
                key={isDark ? "moon" : "sun"}
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
