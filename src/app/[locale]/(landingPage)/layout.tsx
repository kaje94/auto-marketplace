import { clsx } from "clsx";
import Image from "next/image";
import React from "react";
import { displayFont } from "@/app/fonts";
import { SiteLinkSearchBox } from "@/components/Common/SiteLinkSearchBox";
import { LandingHeroSearch } from "@/components/Forms/LandingHeroSearch";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <SiteLinkSearchBox />
            <section className="relative flex min-h-screen flex-col bg-gradient-to-b from-neutral to-hero pt-24">
                <div className="container relative z-10 mx-auto flex h-full flex-1 flex-col items-center justify-evenly gap-10 p-4 !pt-[5%]  xl:p-7 2xl:p-8">
                    <div className="flex flex-1 flex-col items-center justify-center gap-2">
                        <h1 className={clsx(displayFont.className, "text-center text-5xl text-white sm:text-7xl md:text-8xl xl:text-9xl ")}>
                            <span className="animate-fadeIn-300">Drive</span> <span className="animate-fadeIn-300 animate-delay-100">Your</span>{" "}
                            <span className="animate-fadeIn-300 animate-delay-200">Dreams</span>
                        </h1>
                        <h4 className="text-center text-base font-extralight text-white animate-fadeIn-300 animate-delay-300 md:text-lg lg:text-xl">
                            Effortlessly buy or sell your vehicle on our seamless online marketplace.
                        </h4>
                        <span className="z-10 mx-[5%] mb-8 mt-5 flex w-full flex-col items-center justify-center animate-fadeIn-300 animate-delay-400 sm:mb-16 sm:px-0 xl:mb-28 2xl:mb-36">
                            <LandingHeroSearch />
                        </span>
                    </div>
                    <div className="container mx-auto w-full animate-fadeIn-300 animate-delay-500 md:mb-[5%]">{children}</div>
                </div>
                <Image
                    alt=""
                    className="absolute inset-x-0 bottom-0 m-auto w-full opacity-20 md:w-10/12 md:opacity-30 lg:w-11/12 xl:max-w-7xl"
                    height={450}
                    priority={false}
                    src="/images/site/cover-image.webp"
                    width={1246}
                    unoptimized
                />
            </section>
        </>
    );
}
