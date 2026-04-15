"use client";

import { useEffect } from "react";
import PlaceholderPage from "@/components/PlaceholderPage";

export default function Teaching() {
    useEffect(() => {
        document.title = "Teaching - The Urban Planet Lab";
    }, []);

    return <PlaceholderPage title="Teaching" />;
}
