import ThemeProvider from "../components/ThemeProvider";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SiteBackground from "@/components/SiteBackground";
import { getSiteSettings } from "@/lib/content";
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
    const settings = getSiteSettings();

    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${fontSans.className} min-h-screen flex flex-col bg-[#f3f1eb] text-[#0f1720] antialiased transition-colors duration-300 dark:bg-[#091015] dark:text-[#edf3f4]`}
            >
                <ThemeProvider>
                    <SiteBackground variant={settings.background} />

                    <Navbar sections={settings.sections} />
                    <main className="flex-1">{children}</main>
                    <Footer />
                </ThemeProvider>
            </body>
        </html>
    );
}
