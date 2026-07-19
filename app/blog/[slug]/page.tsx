import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { marked } from "marked";
import { getCollection, getSiteSettings, type BlogPost } from "@/lib/content";
import { AnimateIn } from "@/components/AnimateIn";

function getLongFormPosts() {
    return getCollection<BlogPost>("blog").filter((p) => p.post_type === "long");
}

export function generateStaticParams() {
    return getLongFormPosts().map((post) => ({ slug: post.slug }));
}

function getPost(slug: string): BlogPost | null {
    return getLongFormPosts().find((p) => p.slug === slug) ?? null;
}

function formatDate(dateStr: string) {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = getPost(slug);
    if (!post) return { title: "Blog — The Urban Planet Lab" };
    return {
        title: `${post.title} — The Urban Planet Lab`,
        description: post.summary || post.title,
    };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    if (getSiteSettings().sections.blog === false) notFound();

    const { slug } = await params;
    const post = getPost(slug);
    if (!post) notFound();

    const html = post.body ? (marked.parse(post.body) as string) : "";

    return (
        <div className="relative">
            <article className="mx-auto max-w-3xl px-4 pt-16 pb-20 sm:px-6 sm:pt-20 lg:px-8 lg:pt-24">
                <AnimateIn>
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-black/60 transition-colors hover:text-black dark:text-white/55 dark:hover:text-white"
                    >
                        ← Back to Blog
                    </Link>
                </AnimateIn>

                <AnimateIn delay={0.1} y={20}>
                    <div className="mt-6 flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-[0.15em] text-black/50 dark:text-white/45">
                        <time dateTime={post.date}>{formatDate(post.date)}</time>
                        {post.author ? <span>· {post.author}</span> : null}
                        {post.featured ? (
                            <span className="inline-flex rounded-full bg-black/8 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-widest text-black/60 dark:bg-white/10 dark:text-white/55">
                                Featured
                            </span>
                        ) : null}
                    </div>

                    <h1 className="mt-3 text-3xl font-semibold tracking-tight text-black dark:text-white sm:text-4xl lg:text-5xl">
                        {post.title}
                    </h1>

                    {post.summary ? (
                        <p className="mt-4 text-lg leading-relaxed text-black/75 dark:text-white/72">
                            {post.summary}
                        </p>
                    ) : null}
                </AnimateIn>

                {post.cover_image ? (
                    <AnimateIn delay={0.15} y={16}>
                        <div className="mt-8 overflow-hidden rounded-[2rem] border border-black/10 bg-white/60 shadow-[0_22px_80px_rgba(15,23,42,0.08)] dark:border-white/15 dark:bg-black/50">
                            <Image
                                src={post.cover_image}
                                alt={post.cover_image_alt || post.title}
                                width={1600}
                                height={900}
                                sizes="(min-width: 1024px) 768px, 100vw"
                                className="h-auto w-full object-cover"
                            />
                        </div>
                    </AnimateIn>
                ) : null}

                {html ? (
                    <AnimateIn delay={0.2}>
                        <div
                            className="prose prose-neutral mt-10 max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-black prose-a:underline-offset-4 dark:prose-invert dark:prose-a:text-white"
                            dangerouslySetInnerHTML={{ __html: html }}
                        />
                    </AnimateIn>
                ) : null}
            </article>
        </div>
    );
}
