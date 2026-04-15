"use client";

import { useEffect } from "react";
import PlaceholderPage from "@/components/PlaceholderPage";

export default function Publications() {
    useEffect(() => {
        document.title = "Publications - The Urban Planet Lab";
    }, []);

    return <PlaceholderPage title="Publications" />;
}
