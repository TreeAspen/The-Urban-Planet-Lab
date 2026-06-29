"use client";

import { useEffect, useState } from "react";
import SiteBackground from "./SiteBackground";
import type { BackgroundVariant } from "@/lib/content";

export const BG_KEY = "upl-bg";
export const BG_EVENT = "upl-bg-change";

/**
 * Renders the site background and lets the user switch it at runtime (the theme
 * toggle dispatches a `upl-bg-change` event / writes localStorage). The CMS
 * `settings.background` is the default for first-time visitors.
 */
export default function SiteBackgroundSwitcher({
    defaultVariant,
}: {
    defaultVariant: BackgroundVariant;
}) {
    const [variant, setVariant] = useState<BackgroundVariant>(defaultVariant);

    useEffect(() => {
        const read = () => {
            const v = localStorage.getItem(BG_KEY) as BackgroundVariant | null;
            setVariant(v || defaultVariant);
        };
        read();
        window.addEventListener(BG_EVENT, read);
        window.addEventListener("storage", read);
        return () => {
            window.removeEventListener(BG_EVENT, read);
            window.removeEventListener("storage", read);
        };
    }, [defaultVariant]);

    return <SiteBackground variant={variant} />;
}
