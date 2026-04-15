"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

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

    return (
        <Link
            href={href}
            onClick={onClick}
            aria-current={isActive ? "page" : undefined}
            className={[
                "text-sm tracking-wide transition-colors duration-200",
                mobile
                    ? "block rounded-xl px-4 py-3 hover:bg-black/5 dark:hover:bg-white/10"
                    : "",
                isActive
                    ? "text-black dark:text-white"
                    : "text-black/80 hover:text-black dark:text-white/80 dark:hover:text-white",
            ].join(" ")}
        >
            {children}
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
            {open ? <CloseIcon /> : <MenuIcon />}
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
                <div className="mt-4 rounded-[1.75rem] border border-black/10 bg-white/60 backdrop-blur-xl dark:border-white/15 dark:bg-black/60 sm:mt-6">
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

                        {mobileMenuOpen ? (
                            <div
                                id="mobile-navigation"
                                className="mt-4 border-t border-black/10 pt-4 dark:border-white/10 md:hidden"
                            >
                                <div className="grid gap-2">
                                    {navigationItems.map((item) => (
                                        <NavLink
                                            key={item.href}
                                            href={item.href}
                                            currentPath={pathname}
                                            onClick={() => setMobileMenuOpen(false)}
                                            mobile
                                        >
                                            {item.label}
                                        </NavLink>
                                    ))}
                                </div>
                            </div>
                        ) : null}
                    </nav>
                </div>
            </div>
        </header>
    );
}
