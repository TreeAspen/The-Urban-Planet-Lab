import ThemeProvider from "../components/ThemeProvider";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SiteBackgroundSwitcher from "@/components/SiteBackgroundSwitcher";
import { getSiteSettings } from "@/lib/content";
import { IBM_Plex_Sans } from "next/font/google";

const fontSans = IBM_Plex_Sans({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
    display: "swap",
});

const SITE_URL = "https://the-urban-planet-lab.vercel.app";
const SITE_DESCRIPTION =
    "An interdisciplinary research group studying urban systems, climate change, and environmental justice through spatial analysis, remote sensing, and community-engaged methods.";

export const metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: "The Urban Planet Lab",
        template: "%s",
    },
    description: SITE_DESCRIPTION,
    keywords: [
        "urban heat island",
        "urban sustainability",
        "environmental justice",
        "urban data science",
        "climate resilience",
        "remote sensing",
    ],
    openGraph: {
        title: "The Urban Planet Lab",
        description: SITE_DESCRIPTION,
        url: SITE_URL,
        siteName: "The Urban Planet Lab",
        type: "website",
        locale: "en_US",
    },
    twitter: {
        card: "summary",
        title: "The Urban Planet Lab",
        description: SITE_DESCRIPTION,
    },
    robots: {
        index: true,
        follow: true,
    },
};

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
                    <SiteBackgroundSwitcher defaultVariant={settings.background} />

                    <Navbar sections={settings.sections} />
                    <main className="flex-1">{children}</main>
                    <Footer />
                </ThemeProvider>
            </body>
        </html>
    );
}
