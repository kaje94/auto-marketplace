import { ReactNode } from "react";

export default function Layout({ children, sideBar }: { children: ReactNode; sideBar: ReactNode }) {
    return (
        <>
            <div className="container mx-auto p-4 !pt-0 xl:p-7 2xl:p-8">
                <div className="my-10 grid grid-cols-5 gap-4 xl:gap-7 2xl:gap-8">
                    <div className="col-span-5  lg:col-span-1">{sideBar}</div>
                    <div className="col-span-5 lg:col-span-4">{children}</div>
                </div>
            </div>
        </>
    );
}
