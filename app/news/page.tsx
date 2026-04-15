"use client";

import { useEffect } from "react";
import PlaceholderPage from "@/components/PlaceholderPage";

export default function News() {
    useEffect(() => {
        document.title = "News - The Urban Planet Lab";
    }, []);

    return <PlaceholderPage title="News" />;
}
