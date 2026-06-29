"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BG_KEY, BG_EVENT } from "./SiteBackgroundSwitcher";

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

function SparkleIcon() {
    return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-[1.05rem] w-[1.05rem]" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3l1.8 4.6L18.5 9l-4.7 1.4L12 15l-1.8-4.6L5.5 9l4.7-1.4L12 3z" />
            <path d="M19 14l.8 2.2 2.2.8-2.2.8L19 20l-.8-2.2-2.2-.8 2.2-.8L19 14z" />
        </svg>
    );
}

type Mode = "day" | "night" | "classic";

const NEXT_LABEL: Record<Mode, string> = {
    day: "Switch to night mode",
    night: "Switch to the original background",
    classic: "Switch to day mode",
};

const MODE_LABEL: Record<Mode, string> = { day: "Day", night: "Night", classic: "Original" };

function setBg(variant: "urbanheat" | "classic") {
    localStorage.setItem(BG_KEY, variant);
    window.dispatchEvent(new Event(BG_EVENT));
}

export default function ThemeToggle({ mobile = false }: { mobile?: boolean }) {
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [classic, setClassic] = useState(false);

    useEffect(() => {
        setMounted(true);
        setClassic(localStorage.getItem(BG_KEY) === "classic");
        const sync = () => setClassic(localStorage.getItem(BG_KEY) === "classic");
        window.addEventListener(BG_EVENT, sync);
        window.addEventListener("storage", sync);
        return () => {
            window.removeEventListener(BG_EVENT, sync);
            window.removeEventListener("storage", sync);
        };
    }, []);

    const isDark = mounted && resolvedTheme === "dark";
    const mode: Mode = !mounted ? "day" : classic ? "classic" : isDark ? "night" : "day";

    const cycle = () => {
        if (mode === "day") {
            setTheme("dark");
        } else if (mode === "night") {
            setBg("classic");
            setClassic(true);
            setTheme("light"); // classic is shown in its daytime mode
        } else {
            setBg("urbanheat");
            setClassic(false);
            setTheme("light");
        }
    };

    const Icon = mode === "classic" ? SparkleIcon : mode === "night" ? MoonIcon : SunIcon;

    if (mobile) {
        return (
            <button
                type="button"
                onClick={cycle}
                aria-label={NEXT_LABEL[mode]}
                className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm tracking-wide text-black/80 transition-colors duration-200 hover:bg-black/5 hover:text-black dark:text-white/80 dark:hover:bg-white/10 dark:hover:text-white"
            >
                <span>Appearance</span>
                <span className="flex items-center gap-2 text-black dark:text-white">
                    <Icon />
                    {MODE_LABEL[mode]}
                </span>
            </button>
        );
    }

    return (
        <button
            type="button"
            onClick={cycle}
            aria-label={NEXT_LABEL[mode]}
            title={NEXT_LABEL[mode]}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white/70 text-black/80 transition-colors duration-200 hover:bg-white hover:text-black dark:border-white/15 dark:bg-black/60 dark:text-white/80 dark:hover:bg-black/85 dark:hover:text-white"
        >
            <motion.span
                key={mode}
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
