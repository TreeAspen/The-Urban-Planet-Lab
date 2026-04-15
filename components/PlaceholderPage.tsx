"use client";

type PlaceholderPageProps = {
    title: string;
    description?: string;
};

export default function PlaceholderPage({
    title,
    description = "Content is coming soon.",
}: PlaceholderPageProps) {
    return (
        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
            <div className="rounded-[2rem] border border-black/10 bg-white/65 px-6 py-12 backdrop-blur-xl dark:border-white/15 dark:bg-black/60 sm:px-10 sm:py-14">
                <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-white sm:text-4xl">
                    {title}
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-black/75 dark:text-white/75 sm:text-lg">
                    {description}
                </p>
            </div>
        </section>
    );
}
