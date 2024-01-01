"use client";
import dynamic from "next/dynamic";
import { useParams, usePathname } from "next/navigation";
import { FC } from "react";
import { LinkWithLocale, Logo } from "@/components/Common";

/** Lazily loaded cookie consent */
const CookieConsent = dynamic(() => import("@/components/Common/CookieConsent").then((mod) => mod.CookieConsent), { ssr: false });

/** Common footer layout component that will be shown throughout the webapp */
export const Footer: FC = () => {
    const pathName = usePathname();
    const params = useParams();
    const isLandingPage = pathName === `/${params.locale}`;

    return (
        <>
            <div className={isLandingPage ? "bg-hero" : "bg-neutral"}>
                <footer className="container mx-auto grid grid-cols-2 gap-8 p-10 text-sm text-neutral-content md:grid-cols-6 md:gap-4">
                    <div className="col-span-2 flex w-full flex-col items-center justify-center gap-1 md:items-start">
                        <LinkWithLocale href="/">
                            <Logo fontsize="text-3xl" />
                        </LinkWithLocale>
                        <p className="w-full text-center text-sm font-light opacity-90 md:text-left">Connecting Car Enthusiasts since 2023</p>
                    </div>

                    <div className="flex flex-col items-start gap-1 text-left opacity-90  md:items-end md:text-right">
                        <div className="footer-title">Social</div>
                        <a className="cursor-not-allowed opacity-80">Facebook</a>
                        <a className="cursor-not-allowed opacity-80">Instagram</a>
                    </div>
                    <div className="flex flex-col items-end gap-1 text-right opacity-90  md:text-left ">
                        <div className="footer-title">Company</div>
                        <LinkWithLocale className="link-hover link text-right" href="/about-us">
                            About Us
                        </LinkWithLocale>
                        <LinkWithLocale className="link-hover link text-right" href="/why-choose-us">
                            Why Choose Us
                        </LinkWithLocale>
                    </div>
                    <div className="flex flex-col items-start gap-1 text-left opacity-90  md:items-end md:text-right">
                        <div className="footer-title">Support</div>
                        <LinkWithLocale className="link-hover link" href="/contact-us">
                            Contact Us
                        </LinkWithLocale>
                        <LinkWithLocale className="link-hover link" href="/safety-tips">
                            Safety Tips
                        </LinkWithLocale>
                        <LinkWithLocale className="link-hover link" href="/faqs">
                            FAQs
                        </LinkWithLocale>
                    </div>
                    <div className="flex flex-col items-end gap-1 text-right opacity-90  md:text-right">
                        <div className="footer-title">Legal</div>
                        <LinkWithLocale className="link-hover link text-right" href="/terms-of-use">
                            Terms Of Use
                        </LinkWithLocale>
                        <LinkWithLocale className="link-hover link text-right" href="/privacy-policy">
                            Privacy Policy
                        </LinkWithLocale>
                        <LinkWithLocale className="link-hover link text-right" href="/cookie-policy">
                            Cookie Policy
                        </LinkWithLocale>
                    </div>
                </footer>
            </div>
            <CookieConsent />
        </>
    );
};
