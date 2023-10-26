import { clsx } from "clsx";
import Image from "next/image";
import React from "react";
import { displayFont } from "@/app/fonts";
import { LandingHeroSearch } from "@/components/LandingSections/LandingHeroSearch";

// todo: move features and contact us to separate pages
export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <section className="relative flex min-h-screen flex-col bg-gradient-to-b from-neutral to-hero pt-24">
            <div className="container relative z-10 mx-auto flex h-full flex-1 flex-col items-center justify-evenly gap-10 p-4 !pt-[5%]  xl:p-7 2xl:p-8">
                <div className="flex flex-1 flex-col items-center justify-center gap-2">
                    <h1 className={clsx(displayFont.className, "text-center text-5xl text-white sm:text-7xl md:text-8xl xl:text-9xl ")}>
                        Drive Your Dreams
                    </h1>
                    <h4 className="text-center text-base text-white opacity-70 md:text-lg lg:text-xl">
                        Find your perfect vehicle, fast and easy, at our online vehicle marketplace
                    </h4>
                    <LandingHeroSearch />
                </div>

                <div className="container mx-auto w-full md:mb-[5%]">{children}</div>
            </div>
            <Image
                alt="cover-image"
                className="absolute inset-x-0 bottom-0 m-auto w-full opacity-20 md:w-10/12 md:opacity-30 lg:w-11/12 xl:max-w-7xl"
                height={450}
                priority={false}
                src="/images/cover-image.webp"
                unoptimized
                width={1246}
            />
        </section>
    );
}
