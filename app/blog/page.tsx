import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCollection, getSiteSettings, type BlogPost } from "@/lib/content";
import { AnimateIn, StaggerContainer, StaggerItem } from "@/components/AnimateIn";
import { ContinueExploring } from "@/components/ContinueExploring";

export const metadata = {
    title: "Blog — The Urban Planet Lab",
    description: "Essays, deep dives, and long-form writing from The Urban Planet Lab.",
};

function formatDate(dateStr: string) {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function BlogCard({ post }: { post: BlogPost }) {
    const inner = (
        <div className="flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-black/10 bg-white/70 backdrop-blur-xl transition duration-300 hover:scale-[1.02] hover:shadow-[0_18px_60px_rgba(15,23,42,0.08)] dark:border-white/15 dark:bg-black/60 dark:hover:shadow-[0_18px_60px_rgba(0,0,0,0.25)]">
            {post.cover_image ? (
                <div className="relative h-44 w-full shrink-0 overflow-hidden">
                    <Image
                        src={post.cover_image}
                        alt={post.cover_image_alt || post.title}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 hover:scale-[1.04]"
                    />
                </div>
            ) : null}

            <div className="flex flex-1 flex-col p-5 sm:p-6">
                {post.featured ? (
                    <span className="mb-2 inline-flex w-fit rounded-full bg-black/8 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-widest text-black/60 dark:bg-white/10 dark:text-white/55">
                        Featured
                    </span>
                ) : null}

                <div className="flex flex-wrap items-center gap-1.5 text-xs font-medium uppercase tracking-[0.15em] text-black/50 dark:text-white/45">
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                    {post.author ? <span>· {post.author}</span> : null}
                </div>

                <h2 className="mt-2 text-base font-semibold leading-snug text-black dark:text-white sm:text-[1.05rem]">
                    {post.title}
                </h2>

                {post.summary ? (
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-black/70 dark:text-white/65">
                        {post.summary}
                    </p>
                ) : null}

                {post.post_type === "long" || post.external_link ? (
                    <span className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-black/50 dark:text-white/45">
                        Read more →
                    </span>
                ) : null}
            </div>
        </div>
    );

    if (post.post_type === "long") {
        return (
            <Link href={`/blog/${post.slug}`} className="block h-full">
                {inner}
            </Link>
        );
    }

    if (post.external_link) {
        return (
            <a href={post.external_link} target="_blank" rel="noreferrer" className="block h-full">
                {inner}
            </a>
        );
    }

    return <div className="h-full">{inner}</div>;
}

export default function BlogPage() {
    if (getSiteSettings().sections.blog === false) notFound();

    const posts = getCollection<BlogPost>("blog").sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    return (
        <div className="relative">
            <section className="mx-auto max-w-6xl px-4 pt-16 pb-8 sm:px-6 sm:pt-20 lg:px-8 lg:pt-24">
                <AnimateIn className="max-w-3xl" y={28}>
                    <h1 className="text-4xl font-semibold tracking-tight text-black dark:text-white sm:text-5xl lg:text-6xl">
                        Blog
                    </h1>
                    <p className="mt-4 text-lg leading-relaxed text-black/75 dark:text-white/72">
                        Essays, deep dives, and long-form writing from lab members.
                    </p>
                </AnimateIn>
            </section>

            <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
                {posts.length > 0 ? (
                    <StaggerContainer className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {posts.map((post) => (
                            <StaggerItem key={post.slug}>
                                <BlogCard post={post} />
                            </StaggerItem>
                        ))}
                    </StaggerContainer>
                ) : (
                    <AnimateIn>
                        <div className="rounded-[1.75rem] border border-dashed border-black/15 px-6 py-12 text-center dark:border-white/15">
                            <p className="text-black/50 dark:text-white/45">No posts yet.</p>
                        </div>
                    </AnimateIn>
                )}
            </section>

            <ContinueExploring from="blog" />
        </div>
    );
}
