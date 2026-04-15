"use client";

import { useEffect } from "react";
import PlaceholderPage from "@/components/PlaceholderPage";

export default function NotFound() {
    useEffect(() => {
        document.title = "Page Not Found - The Urban Planet Lab";
    }, []);

    return (
        <PlaceholderPage
            title="404 - Page Not Found"
            description="The page you requested does not exist."
        />
    );
}
