import { ReactQueryProvider } from "@/utils/query-provider";
import { NextAuthProvider } from "@/utils/auth-provider";
import { montserratFont } from "./fonts";
import { Toaster } from "react-hot-toast";
import { Footer } from "./_components";
import "./globals.css";

export const metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
};

export default function RootLayout({ children, navBar }: { children: React.ReactNode; navBar: React.ReactNode }) {
    return (
        <html lang="en" className="bg-neutral">
            <body className={montserratFont.className}>
                <Toaster position="bottom-right" toastOptions={{ error: { duration: 10000 }, duration: 5000 }} />
                <ReactQueryProvider>
                    <NextAuthProvider>
                        {navBar}
                        <main>{children}</main>
                        <Footer />
                    </NextAuthProvider>
                </ReactQueryProvider>
            </body>
        </html>
    );
}
