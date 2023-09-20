import { NavBar, Footer } from "@/app/_components";
import { DashboardSideBar } from "../_components/DashboardSideBar";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <div className="container mx-auto min-h-screen p-4 !pt-0 xl:p-7 2xl:p-8">
                <div className="my-10 grid grid-cols-5 gap-4 xl:gap-7 2xl:gap-8">
                    <div className="col-span-5  lg:col-span-1">
                        <DashboardSideBar />
                    </div>
                    <div className="col-span-5 lg:col-span-4">{children}</div>
                </div>
            </div>
        </>
    );
}
