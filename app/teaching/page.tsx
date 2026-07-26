import { notFound } from "next/navigation";
import { getCollection, getSiteSettings, type Course } from "@/lib/content";
import { AnimateIn, StaggerContainer, StaggerItem } from "@/components/AnimateIn";
import { ContinueExploring } from "@/components/ContinueExploring";
import { Icon } from "@/components/Icons";

export const metadata = {
    title: "Courses — The Urban Planet Lab",
    description:
        "Graduate courses taught by faculty of The Urban Planet Lab",
};

/**
 * The button is always shown so every course reads the same. An uploaded PDF
 * takes precedence over an external link; with neither, it renders inert
 * (visible, but nothing happens on click).
 */
function SyllabusButton({ course }: { course: Course }) {
    const href = course.syllabus_file || course.syllabus_url;
    const className =
        "mt-4 inline-flex w-fit items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-200";

    if (!href) {
        return (
            <span
                aria-disabled="true"
                className={`${className} cursor-default border-black/10 text-black/35 dark:border-white/12 dark:text-white/30`}
            >
                <Icon name="syllabus" />
                Syllabus coming soon
            </span>
        );
    }

    return (
        <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className={`${className} border-black/15 text-black/65 hover:scale-[1.04] hover:border-black/30 hover:text-black dark:border-white/20 dark:text-white/60 dark:hover:border-white/35 dark:hover:text-white`}
        >
            <Icon name="syllabus" />
            View Syllabus
            <Icon name="arrow" className="h-3.5 w-3.5 shrink-0" />
        </a>
    );
}

function CourseCard({ course }: { course: Course }) {
    return (
        <div className="flex h-full flex-col rounded-[1.75rem] border border-black/10 bg-white/70 p-5 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_12px_40px_rgba(15,23,42,0.07)] dark:border-white/15 dark:bg-black/60 dark:hover:shadow-[0_12px_40px_rgba(0,0,0,0.22)] sm:p-6">
            <div className="flex items-start justify-between gap-3">
                <span className="rounded-xl border border-black/12 bg-black/[0.04] px-3 py-1 font-mono text-xs font-semibold tracking-wide text-black/70 dark:border-white/18 dark:bg-white/[0.06] dark:text-white/65">
                    {course.code}
                </span>
                <span className="shrink-0 text-xs font-medium text-black/50 dark:text-white/45">
                    {course.semester}
                </span>
            </div>

            <h3 className="mt-3 text-base font-semibold text-black dark:text-white sm:text-[1.05rem]">
                {course.name}
            </h3>

            {course.description ? (
                <p className="mt-2 flex-1 text-sm leading-relaxed text-black/72 dark:text-white/68">
                    {course.description}
                </p>
            ) : null}

            <SyllabusButton course={course} />
        </div>
    );
}

export default function TeachingPage() {
    if (getSiteSettings().sections.teaching === false) notFound();

    const courses = getCollection<Course>("courses").sort(
        (a, b) => (a.sort_order ?? 99) - (b.sort_order ?? 99)
    );

    return (
        <div className="relative">
            <section className="mx-auto max-w-6xl px-4 pt-16 pb-8 sm:px-6 sm:pt-20 lg:px-8 lg:pt-24">
                <AnimateIn className="max-w-3xl" y={28}>
                    <h1 className="text-4xl font-semibold tracking-tight text-black dark:text-white sm:text-5xl lg:text-6xl">
                        Courses
                    </h1>
                    <p className="mt-4 text-lg leading-relaxed text-black/75 dark:text-white/72">
                        Courses taught at the graduate level. 
                    </p>
                </AnimateIn>
            </section>

            <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
                {courses.length > 0 ? (
                    <StaggerContainer className="grid items-stretch gap-5 sm:grid-cols-2">
                        {courses.map((course) => (
                            <StaggerItem key={course.slug} className="h-full">
                                <CourseCard course={course} />
                            </StaggerItem>
                        ))}
                    </StaggerContainer>
                ) : (
                    <AnimateIn>
                        <div className="rounded-[1.75rem] border border-dashed border-black/15 px-6 py-12 text-center dark:border-white/15">
                            <p className="text-black/50 dark:text-white/45">No courses listed yet.</p>
                        </div>
                    </AnimateIn>
                )}
            </section>

            <ContinueExploring from="teaching" />
        </div>
    );
}
