import { righteousFont } from "@/app/fonts";
import clsx from "clsx";
import { ReactNode } from "react";

export default function Loading({ children }: { children: ReactNode }) {
    return (
        <>
            <section className="relative bg-base-200 py-12 md:py-20">
                <div className="container mx-auto mb-2 w-full md:mb-6">
                    <h3 className={clsx(righteousFont.className, "mb-10 text-center text-2xl lg:text-4xl")}>Featured Adverts</h3>
                    {children}
                </div>
            </section>
        </>
    );
}
