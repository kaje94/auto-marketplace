"use client";
import { useParams, usePathname } from "next/navigation";
import { FC } from "react";
import { LinkWithLocale, Logo } from "@/components/Common";

// todo: add a faq page
// how do i post an advert?
// how much does it cost to post an advert
// how long does it take to review an advert
// what safety precautions do i need to take
// how could i be notified of a new advert
// how long will my advert be visible
// how can i remove an advert

// todo: add following links
// add promotions https://ikman.lk/en/promotions
// safety precautions https://ikman.lk/en/stay-safe

export const Footer: FC = () => {
    const pathName = usePathname();
    const params = useParams();
    const isLandingPage = pathName === `/${params.locale}`;

    return (
        <div className={isLandingPage ? "bg-hero" : "bg-neutral"}>
            <footer className="container mx-auto grid grid-cols-2 gap-8 p-10 text-sm text-neutral-content md:grid-cols-4 md:gap-4">
                <div className="col-span-2 flex w-full flex-col items-center justify-center gap-1 md:items-start">
                    <LinkWithLocale href="/">
                        <Logo fontsize="text-3xl" />
                    </LinkWithLocale>
                    <p className="w-full text-center text-sm font-light opacity-90 md:text-left">Connecting Car Enthusiasts since 2023</p>
                </div>
                <div className="flex flex-col items-start gap-1 text-left opacity-90 md:items-end md:text-right">
                    <div className="footer-title">Company</div>
                    <LinkWithLocale className="link-hover link" href="/about-us">
                        About Us
                    </LinkWithLocale>
                    <LinkWithLocale className="link-hover link" href="/contact-us">
                        Contact Us
                    </LinkWithLocale>
                    <LinkWithLocale className="link-hover link" href="/key-features">
                        Key Features
                    </LinkWithLocale>
                </div>
                <div className="flex flex-col items-end gap-1 text-right opacity-90">
                    <div className="footer-title">Legal</div>
                    <a className="link-hover link">Terms of use</a>
                    <a className="link-hover link">Privacy policy</a>
                    <a className="link-hover link">Cookie policy</a>
                </div>
            </footer>
        </div>
    );
};
