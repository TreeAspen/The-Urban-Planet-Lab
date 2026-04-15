import ThemeProvider from "../components/ThemeProvider";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { IBM_Plex_Sans } from "next/font/google";

const fontSans = IBM_Plex_Sans({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
    display: "swap",
});

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${fontSans.className} min-h-screen flex flex-col bg-[#f3f1eb] text-[#0f1720] antialiased transition-colors duration-300 dark:bg-[#091015] dark:text-[#edf3f4]`}
            >
                <ThemeProvider>
                    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
                        <div className="absolute inset-0 bg-[#f1eee6] dark:bg-[#071118]" />

                        <div className="absolute inset-0 bg-[radial-gradient(78%_54%_at_50%_0%,rgba(255,255,255,0.94),rgba(255,255,255,0.5)_42%,transparent_78%),linear-gradient(180deg,rgba(241,238,230,0.65)_0%,rgba(233,228,218,0.84)_56%,rgba(227,221,209,0.92)_100%)] dark:bg-[radial-gradient(78%_54%_at_50%_0%,rgba(18,31,39,0.92),rgba(7,17,24,0.42)_42%,transparent_78%),linear-gradient(180deg,rgba(7,17,24,0.82)_0%,rgba(7,17,24,0.92)_52%,rgba(4,10,15,1)_100%)]" />

                        <div
                            className="absolute inset-0 dark:hidden"
                            style={{
                                backgroundImage:
                                    "linear-gradient(rgba(15,23,32,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,32,0.035) 1px, transparent 1px)",
                                backgroundSize: "36px 36px",
                            }}
                        />
                        <div
                            className="absolute inset-0 hidden dark:block"
                            style={{
                                backgroundImage:
                                    "linear-gradient(rgba(226,232,240,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(226,232,240,0.04) 1px, transparent 1px)",
                                backgroundSize: "36px 36px",
                            }}
                        />

                        <div
                            className="absolute inset-0 dark:hidden"
                            style={{
                                backgroundImage:
                                    "linear-gradient(rgba(15,23,32,0.075) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,32,0.075) 1px, transparent 1px)",
                                backgroundSize: "180px 180px",
                            }}
                        />
                        <div
                            className="absolute inset-0 hidden dark:block"
                            style={{
                                backgroundImage:
                                    "linear-gradient(rgba(226,232,240,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(226,232,240,0.07) 1px, transparent 1px)",
                                backgroundSize: "180px 180px",
                            }}
                        />

                        <div
                            className="absolute inset-0 opacity-60 dark:hidden"
                            style={{
                                backgroundImage:
                                    "repeating-linear-gradient(124deg, transparent 0 250px, rgba(14,165,233,0.13) 250px 252px, transparent 252px 500px), repeating-linear-gradient(32deg, transparent 0 320px, rgba(15,23,32,0.05) 320px 321px, transparent 321px 640px)",
                            }}
                        />
                        <div
                            className="absolute inset-0 hidden opacity-55 dark:block"
                            style={{
                                backgroundImage:
                                    "repeating-linear-gradient(124deg, transparent 0 250px, rgba(34,211,238,0.11) 250px 252px, transparent 252px 500px), repeating-linear-gradient(32deg, transparent 0 320px, rgba(226,232,240,0.06) 320px 321px, transparent 321px 640px)",
                            }}
                        />

                        <div className="absolute left-[4%] top-20 h-[15rem] w-[24rem] rounded-[2.8rem] border border-black/8 bg-white/18 shadow-[0_20px_70px_rgba(15,23,32,0.05)] dark:border-white/10 dark:bg-white/[0.03] dark:shadow-[0_24px_70px_rgba(0,0,0,0.22)]" />
                        <div className="absolute left-[8%] top-28 h-[15rem] w-[24rem] rounded-[2.8rem] border border-black/6 dark:border-white/8" />

                        <div className="absolute right-[5%] top-[9rem] h-[18rem] w-[22rem] rounded-[2.8rem] border border-black/8 bg-black/[0.025] dark:border-white/10 dark:bg-white/[0.025]" />
                        <div className="absolute right-[9%] top-[12.5rem] h-[9rem] w-[15rem] rounded-[2rem] border border-cyan-500/20 dark:border-cyan-300/22" />
                        <div className="absolute right-[14%] top-[15rem] h-[4rem] w-[4rem] rounded-full border border-amber-500/24 dark:border-amber-300/24" />

                        <div className="absolute bottom-[18%] left-[11%] h-[12rem] w-[18rem] rounded-[2.2rem] border border-black/8 bg-white/16 dark:border-white/10 dark:bg-white/[0.02]" />
                        <div className="absolute bottom-[14%] left-[16%] h-[8rem] w-[12rem] rounded-[1.8rem] border border-black/6 dark:border-white/8" />

                        <div className="absolute bottom-[20%] right-[7%] h-[14rem] w-[26rem] rounded-[3rem] border border-black/8 bg-white/12 dark:border-white/10 dark:bg-white/[0.025]" />
                        <div className="absolute bottom-[23%] right-[12%] h-[14rem] w-[26rem] rounded-[3rem] border border-black/6 dark:border-white/8" />

                        <div className="absolute left-[18%] top-[30%] h-px w-[44rem] rotate-[16deg] bg-[linear-gradient(90deg,transparent,rgba(14,165,233,0.38),transparent)] dark:bg-[linear-gradient(90deg,transparent,rgba(34,211,238,0.34),transparent)]" />
                        <div className="absolute left-[46%] top-[18%] h-px w-[32rem] rotate-[112deg] bg-[linear-gradient(90deg,transparent,rgba(245,158,11,0.26),transparent)] dark:bg-[linear-gradient(90deg,transparent,rgba(251,191,36,0.2),transparent)]" />
                        <div className="absolute left-[30%] top-[58%] h-px w-[24rem] rotate-[-12deg] bg-[linear-gradient(90deg,transparent,rgba(15,23,32,0.18),transparent)] dark:bg-[linear-gradient(90deg,transparent,rgba(226,232,240,0.14),transparent)]" />

                        <div className="absolute left-[10%] top-[22%] h-3 w-3 rounded-full bg-cyan-500/35 blur-[1px] dark:bg-cyan-300/45" />
                        <div className="absolute right-[16%] top-[44%] h-3 w-3 rounded-full bg-amber-500/30 blur-[1px] dark:bg-amber-300/35" />
                        <div className="absolute bottom-[18%] left-[34%] h-2.5 w-2.5 rounded-full bg-black/18 dark:bg-white/18" />

                        <div className="absolute inset-x-0 top-0 h-40 bg-[linear-gradient(180deg,rgba(255,255,255,0.72),transparent)] dark:bg-[linear-gradient(180deg,rgba(7,17,24,0.82),transparent)]" />
                        <div className="absolute inset-x-0 bottom-0 h-44 bg-[linear-gradient(0deg,rgba(241,238,230,0.94),transparent)] dark:bg-[linear-gradient(0deg,rgba(7,17,24,0.97),transparent)]" />
                        <div className="absolute inset-y-0 left-0 w-20 bg-[linear-gradient(90deg,rgba(241,238,230,0.94),transparent)] dark:bg-[linear-gradient(90deg,rgba(7,17,24,0.94),transparent)]" />
                        <div className="absolute inset-y-0 right-0 w-20 bg-[linear-gradient(270deg,rgba(241,238,230,0.94),transparent)] dark:bg-[linear-gradient(270deg,rgba(7,17,24,0.94),transparent)]" />
                    </div>

                    <Navbar />
                    <main className="flex-1">{children}</main>
                    <Footer />
                </ThemeProvider>
            </body>
        </html>
    );
}
