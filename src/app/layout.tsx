import { Toaster } from "react-hot-toast";
import type { Metadata } from "next";
import { ScrollToTop } from "@/components/Common/ScrollToTop";
import { Footer } from "@/components/Footer";
import { WelcomeModal } from "@/components/Modals/WelcomeModal";
import { NavBar } from "@/components/NavBar";
import { ReactQueryProvider } from "@/providers/ReactQueryProvider";
import { ChildrenProps } from "@/utils/types";
import { standardFont } from "./fonts";

import "./globals.css";

export const runtime = "edge";

export const metadata: Metadata = {
    title: "Targabay - Your Ultimate Vehicle Marketplace",
    description:
        "Welcome to Targabay, where automotive enthusiasts converge to embark on a journey of discovery, purchasing, and selling. Uncover a diverse array of vehicles, from sleek cars to rugged trucks and beyond. As your ultimate destination for automotive transactions, Targabay offers a seamless platform to connect buyers and sellers, ensuring a personalized and secure experience for every automotive adventure.",
    icons: [
        { rel: "icon", url: "/favicons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { rel: "icon", url: "/favicons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { rel: "apple-touch-icon", url: "/favicons/favicon-180x180.png", sizes: "180x180" },
    ],
    manifest: "/manifest.json",
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
                    <WelcomeModal />
                </ReactQueryProvider>
            </body>
        </html>
    );
}
