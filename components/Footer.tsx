export default function Footer() {
    const contactEmail = "as20884@nyu.edu";

    return (
        <footer className="mt-8 sm:mt-10">
            <div className="mx-auto max-w-6xl px-4 pb-6 sm:px-6 sm:pb-8 lg:px-8 lg:pb-10">
                <div className="rounded-2xl border border-black/10 bg-white/60 px-6 py-5 backdrop-blur-xl dark:border-white/15 dark:bg-black/60">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <span className="text-sm text-black/80 dark:text-white/80">
                            Copyright © {new Date().getFullYear()} The Urban Planet Lab. All rights reserved.
                        </span>

                        {contactEmail ? (
                            <a
                                href={`mailto:${contactEmail}`}
                                className="w-fit text-sm text-black/80 underline-offset-4 transition-colors duration-200 hover:underline hover:text-black dark:text-white/80 dark:hover:text-white"
                            >
                                Contact Us
                            </a>
                        ) : null}
                    </div>
                </div>
            </div>
        </footer>
    );
}
