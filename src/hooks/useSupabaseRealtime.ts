"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";

type RealtimeState<T extends Record<string, unknown>> = {
    hasLoaded: boolean;
    rows: T[];
};

function useSupabaseRealtimeState<T extends Record<string, unknown>>(table: string): RealtimeState<T> {
    const [rows, setRows] = useState<T[]>([]);
    const [hasLoaded, setHasLoaded] = useState(false);

    useEffect(() => {
        let active = true;

        const fetchRows = async () => {
            const { data } = await supabase.from(table).select("*");

            if (!active) {
                return;
            }

            setRows((data as T[] | null) || []);
            setHasLoaded(true);
        };

        const initialFetch = window.setTimeout(() => {
            void fetchRows();
        }, 0);

        const channel = supabase
            .channel(`${table}-changes`)
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table },
                () => {
                    void fetchRows();
                }
            )
            .subscribe();

        return () => {
            active = false;
            window.clearTimeout(initialFetch);
            supabase.removeChannel(channel);
        };
    }, [table]);

    return { hasLoaded, rows };
}

export function useSupabaseRealtimeWithStatus<T extends Record<string, unknown>>(table: string) {
    return useSupabaseRealtimeState<T>(table);
}

export default function useSupabaseRealtime<T extends Record<string, unknown>>(table: string) {
    return useSupabaseRealtimeState<T>(table).rows;
}
