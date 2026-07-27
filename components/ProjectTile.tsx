import Image from "next/image";
import type { Project } from "@/lib/content";

/**
 * Stand-in visual until a real project image is uploaded in the admin:
 * concentric thermal rings over a grid, echoing the heat-islet imagery the lab
 * works with.
 */
export function ProjectPlaceholder({
    index,
    accent,
    className = "aspect-[4/3]",
}: {
    index: number;
    accent: string;
    className?: string;
}) {
    return (
        <div
            className={`relative flex w-full items-center justify-center overflow-hidden rounded-[2rem] bg-gradient-to-br ${accent} ${className}`}
        >
            <svg
                aria-hidden="true"
                viewBox="0 0 400 300"
                preserveAspectRatio="xMidYMid slice"
                className="absolute inset-0 h-full w-full text-black/25 dark:text-white/25"
                fill="none"
                stroke="currentColor"
            >
                <defs>
                    <pattern id={`grid-${index}`} width="25" height="25" patternUnits="userSpaceOnUse">
                        <path d="M25 0H0v25" strokeWidth="0.5" opacity="0.5" />
                    </pattern>
                </defs>
                <rect width="400" height="300" fill={`url(#grid-${index})`} stroke="none" />
                <g strokeWidth="1.2" opacity="0.85">
                    <ellipse cx="200" cy="150" rx="36" ry="28" />
                    <ellipse cx="200" cy="150" rx="66" ry="50" />
                    <ellipse cx="200" cy="150" rx="98" ry="72" />
                    <ellipse cx="200" cy="150" rx="132" ry="96" />
                </g>
            </svg>
            <span className="relative text-6xl font-semibold tracking-[-0.08em] text-black/22 dark:text-white/22 sm:text-7xl">
                {String(index).padStart(2, "0")}
            </span>
        </div>
    );
}

/** The uploaded image when there is one, otherwise the placeholder. */
export function ProjectTile({
    project,
    index,
    accent,
    className = "aspect-[4/3]",
    sizes = "(min-width: 1024px) 560px, 100vw",
    priority = false,
}: {
    project: Project;
    index: number;
    accent: string;
    className?: string;
    sizes?: string;
    priority?: boolean;
}) {
    if (!project.image) {
        return <ProjectPlaceholder index={index} accent={accent} className={className} />;
    }

    return (
        <div
            className={`relative w-full overflow-hidden rounded-[2rem] border border-black/10 bg-white/60 shadow-[0_20px_70px_rgba(15,23,42,0.08)] dark:border-white/15 dark:bg-black/50 ${className}`}
        >
            <Image
                src={project.image}
                alt={project.image_alt || project.title}
                fill
                priority={priority}
                sizes={sizes}
                className="object-cover"
            />
        </div>
    );
}
