"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

const navigationItems = [
    { href: "/research", label: "Research" },
    { href: "/publications", label: "Publications" },
    { href: "/people", label: "People" },
    { href: "/news", label: "News" },
    { href: "/teaching", label: "Teaching" },
];

function NavLink({
    href,
    children,
    currentPath,
    onClick,
    mobile = false,
}: {
    href: string;
    children: ReactNode;
    currentPath: string;
    onClick?: () => void;
    mobile?: boolean;
}) {
    const isActive = currentPath === href;

    if (mobile) {
        return (
            <Link
                href={href}
                onClick={onClick}
                aria-current={isActive ? "page" : undefined}
                className={[
                    "block rounded-xl px-4 py-3 text-sm tracking-wide transition-colors duration-200 hover:bg-black/5 dark:hover:bg-white/10",
                    isActive
                        ? "text-black dark:text-white"
                        : "text-black/80 hover:text-black dark:text-white/80 dark:hover:text-white",
                ].join(" ")}
            >
                {children}
            </Link>
        );
    }

    return (
        <Link
            href={href}
            onClick={onClick}
            aria-current={isActive ? "page" : undefined}
            className={[
                "relative text-sm tracking-wide transition-colors duration-200",
                isActive
                    ? "text-black dark:text-white"
                    : "text-black/80 hover:text-black dark:text-white/80 dark:hover:text-white",
            ].join(" ")}
        >
            {children}
            <span
                className={[
                    "absolute -bottom-1 left-0 h-px bg-black dark:bg-white transition-all duration-300",
                    isActive ? "w-full opacity-100" : "w-0 opacity-0 group-hover:w-full group-hover:opacity-70",
                ].join(" ")}
            />
        </Link>
    );
}

function MenuButton({
    open,
    onClick,
}: {
    open: boolean;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white/70 text-black transition-colors duration-200 hover:bg-white dark:border-white/15 dark:bg-black/70 dark:text-white dark:hover:bg-black/85 md:hidden"
        >
            <motion.div
                animate={{ rotate: open ? 45 : 0 }}
                transition={{ duration: 0.2 }}
            >
                {open ? <CloseIcon /> : <MenuIcon />}
            </motion.div>
        </button>
    );
}

function MenuIcon() {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
        >
            <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
    );
}

function CloseIcon() {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
        >
            <path d="m6 6 12 12M18 6 6 18" />
        </svg>
    );
}

export default function Navbar() {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setMobileMenuOpen(false);
            }
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        if (!mobileMenuOpen) {
            return;
        }

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [mobileMenuOpen]);

    return (
        <header>
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <motion.div
                    className="mt-4 rounded-[1.75rem] border border-black/10 bg-white/60 backdrop-blur-xl dark:border-white/15 dark:bg-black/60 sm:mt-6"
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                    <nav className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between gap-3">
                            <Link
                                href="/"
                                onClick={() => setMobileMenuOpen(false)}
                                className="min-w-0 flex-1"
                            >
                                <span className="flex items-center gap-3 sm:gap-4">
                                    <Image
                                        src="/icon.svg"
                                        alt="Urban Planet Lab"
                                        width={40}
                                        height={40}
                                        priority
                                        className="h-10 w-10 shrink-0"
                                    />
                                    <span className="min-w-0 text-sm font-semibold tracking-wide text-black dark:text-white sm:text-base">
                                        <span className="block truncate sm:hidden">Urban Planet Lab</span>
                                        <span className="hidden sm:block">The Urban Planet Lab</span>
                                    </span>
                                </span>
                            </Link>

                            <div className="hidden items-center gap-7 md:flex">
                                {navigationItems.map((item) => (
                                    <NavLink
                                        key={item.href}
                                        href={item.href}
                                        currentPath={pathname}
                                    >
                                        {item.label}
                                    </NavLink>
                                ))}
                            </div>

                            <div className="flex items-center md:hidden">
                                <MenuButton
                                    open={mobileMenuOpen}
                                    onClick={() => setMobileMenuOpen((current) => !current)}
                                />
                            </div>
                        </div>

                        <AnimatePresence>
                            {mobileMenuOpen ? (
                                <motion.div
                                    id="mobile-navigation"
                                    key="mobile-nav"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                                    className="overflow-hidden md:hidden"
                                >
                                    <div className="mt-4 border-t border-black/10 pt-4 dark:border-white/10">
                                        <div className="grid gap-1">
                                            {navigationItems.map((item, i) => (
                                                <motion.div
                                                    key={item.href}
                                                    initial={{ opacity: 0, x: -12 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: i * 0.05, duration: 0.2 }}
                                                >
                                                    <NavLink
                                                        href={item.href}
                                                        currentPath={pathname}
                                                        onClick={() => setMobileMenuOpen(false)}
                                                        mobile
                                                    >
                                                        {item.label}
                                                    </NavLink>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            ) : null}
                        </AnimatePresence>
                    </nav>
                </motion.div>
            </div>
        </header>
    );
}
