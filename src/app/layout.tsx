import { montserratFont } from "./fonts";
import { Toaster } from "react-hot-toast";
import { Footer, NavBar } from "./_components";
import { NextAuthProvider } from "@/providers/auth-provider";
import { ReactQueryProvider } from "@/providers/query-provider";
import "./globals.css";

export const metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className="bg-neutral">
            <body className={montserratFont.className}>
                <Toaster position="bottom-right" toastOptions={{ error: { duration: 10000 }, duration: 5000 }} />
                <ReactQueryProvider>
                    <NextAuthProvider>
                        <NavBar />
                        <main>{children}</main>
                        <Footer />
                    </NextAuthProvider>
                </ReactQueryProvider>
            </body>
        </html>
    );
}
