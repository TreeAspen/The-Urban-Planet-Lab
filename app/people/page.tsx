"use client";

import { useEffect } from "react";
import PlaceholderPage from "@/components/PlaceholderPage";

export default function People() {
    useEffect(() => {
        document.title = "People - The Urban Planet Lab";
    }, []);

    return <PlaceholderPage title="People" />;
}
