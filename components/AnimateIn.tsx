"use client";

import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";

type AnimateInProps = {
    children: ReactNode;
    className?: string;
    delay?: number;
    duration?: number;
    y?: number;
    once?: boolean;
};

export function AnimateIn({
    children,
    className,
    delay = 0,
    duration = 0.6,
    y = 24,
    once = true,
}: AnimateInProps) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once, margin: "-60px 0px" });

    return (
        <motion.div
            ref={ref}
            className={className}
            initial={{ opacity: 0, y }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
            transition={{ duration, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
            {children}
        </motion.div>
    );
}

type StaggerContainerProps = {
    children: ReactNode;
    className?: string;
    staggerDelay?: number;
    once?: boolean;
};

export function StaggerContainer({
    children,
    className,
    staggerDelay = 0.08,
    once = true,
}: StaggerContainerProps) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once, margin: "-60px 0px" });

    return (
        <motion.div
            ref={ref}
            className={className}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={{
                hidden: {},
                visible: { transition: { staggerChildren: staggerDelay } },
            }}
        >
            {children}
        </motion.div>
    );
}

export function StaggerItem({
    children,
    className,
    y = 20,
    duration = 0.55,
}: {
    children: ReactNode;
    className?: string;
    y?: number;
    duration?: number;
}) {
    return (
        <motion.div
            className={className}
            variants={{
                hidden: { opacity: 0, y },
                visible: { opacity: 1, y: 0, transition: { duration, ease: [0.25, 0.46, 0.45, 0.94] } },
            }}
        >
            {children}
        </motion.div>
    );
}
