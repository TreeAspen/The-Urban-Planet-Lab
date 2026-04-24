import { getCollection, type Course } from "@/lib/content";
import { AnimateIn, StaggerContainer, StaggerItem } from "@/components/AnimateIn";

export const metadata = {
    title: "Teaching — The Urban Planet Lab",
};

function CourseCard({ course }: { course: Course }) {
    return (
        <div className="flex flex-col rounded-[1.75rem] border border-black/10 bg-white/70 p-5 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_12px_40px_rgba(15,23,42,0.07)] dark:border-white/15 dark:bg-black/60 dark:hover:shadow-[0_12px_40px_rgba(0,0,0,0.22)] sm:p-6">
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

            {course.syllabus_url ? (
                <a
                    href={course.syllabus_url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex w-fit rounded-full border border-black/15 px-3.5 py-1.5 text-xs font-medium text-black/65 transition-all duration-200 hover:border-black/30 hover:text-black hover:scale-[1.04] dark:border-white/20 dark:text-white/60 dark:hover:border-white/35 dark:hover:text-white"
                >
                    View Syllabus →
                </a>
            ) : null}
        </div>
    );
}

export default function TeachingPage() {
    const courses = getCollection<Course>("courses").sort(
        (a, b) => (a.sort_order ?? 99) - (b.sort_order ?? 99)
    );

    return (
        <div className="relative">
            <section className="mx-auto max-w-6xl px-4 pt-16 pb-8 sm:px-6 sm:pt-20 lg:px-8 lg:pt-24">
                <AnimateIn className="max-w-3xl" y={28}>
                    <h1 className="text-4xl font-semibold tracking-tight text-black dark:text-white sm:text-5xl lg:text-6xl">
                        Teaching
                    </h1>
                    <p className="mt-4 text-lg leading-relaxed text-black/75 dark:text-white/72">
                        Courses taught by lab faculty at the graduate and undergraduate level.
                    </p>
                </AnimateIn>
            </section>

            <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
                {courses.length > 0 ? (
                    <StaggerContainer className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {courses.map((course) => (
                            <StaggerItem key={course.slug}>
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
        </div>
    );
}
