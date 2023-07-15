import { NavBar, Footer } from "@/app/_components";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <div className="container mx-auto min-h-screen p-4 xl:p-7 2xl:p-8 ">
                <div className="relative">
                    <NavBar />
                </div>
                {children}
            </div>
            <Footer />
        </>
    );
}
