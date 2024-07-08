import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "react-hot-toast";
import type { Metadata, Viewport } from "next";
import { Footer, ScrollToTop } from "@/components/Common";
import { NavBar } from "@/components/Common/NavBar";
import { env } from "@/env.mjs";
import { ReactQueryProvider } from "@/providers/ReactQueryProvider";
import { ChildrenProps } from "@/utils/types";
import { standardFont } from "./fonts";

import "./globals.css";

const title = "Targabay - Your Ultimate Vehicle Marketplace";
const description =
    "Welcome to Targabay, the ultimate hub for automotive enthusiasts exploring a journey of discovery, buying, and selling. Explore a diverse range of vehicles, from sleek cars to thrilling bikes. As your premier destination for automotive engagement, Targabay provides a seamless platform connecting buyers and sellers, ensuring a personalized and secure experience for every automotive adventure.";

export const metadata: Metadata = {
    title,
    description,
    icons: [
        { rel: "icon", url: "/favicons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { rel: "icon", url: "/favicons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { rel: "apple-touch-icon", url: "/favicons/favicon-180x180.png", sizes: "180x180" },
    ],
    metadataBase: new URL(env.AUTH0_BASE_URL),
    manifest: `/manifest.json`,
    openGraph: {
        type: "website",
        url: "https://targabay.com",
        title,
        description,
        siteName: "Targabay",
        images: [{ url: `/images/banner.jpg`, alt: "Targabay banner", width: 1200, height: 630 }],
    },
    twitter: {
        card: "summary_large_image",
        images: [{ url: `/images/banner.jpg`, alt: "Targabay banner", width: 1200, height: 630 }],
        title,
        description,
    },
    keywords: [
        "Automotive Marketplace",
        "Buy and Sell Cars Online",
        "Vehicle Trading Platform",
        "Online Auto Marketplace",
        "Car Sales Platform",
        "Bike Sales Platform",
        "Motorcycle Listings",
        "Car Listings",
        "Used Vehicle Marketplace",
        "Online Car Dealership",
        "Vehicle Auctions Online",
        "Auto Trading Platform",
        "Sell Your Car Online",
        "Sell Your Bike Online",
        "Car Listings Website",
        "Bike Listings Website",
        "Motorbike Sales Platform",
        "Pre-owned Vehicles Marketplace",
        "Buy Cars Online from Dealers",
        "Bike Dealers Online",
        "Vehicle Classified Ads",
        "Auto Auction Site",
    ],
};

export const viewport: Viewport = { themeColor: "#18182F" };

export default function RootLayout({ children }: ChildrenProps) {
    return (
        <html lang="en">
            <body className={standardFont.className}>
                <ScrollToTop />
                <Toaster position="bottom-right" toastOptions={{ error: { duration: 10000 } }} />
                <ReactQueryProvider>
                    <NavBar />
                    <main>{children}</main>
                    <Footer />
                </ReactQueryProvider>
                <SpeedInsights />
            </body>
        </html>
    );
}
