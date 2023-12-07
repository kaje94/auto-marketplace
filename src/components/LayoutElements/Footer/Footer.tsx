"use client";
import { useParams, usePathname } from "next/navigation";
import { FC } from "react";
import { LinkWithLocale, Logo } from "@/components/Common";
import { useScopedI18n } from "@/locales/client";

export const Footer: FC = () => {
    const tNav = useScopedI18n("nav");
    const pathName = usePathname();
    const params = useParams();
    const isLandingPage = pathName === `/${params.locale}`;

    return (
        <div className={isLandingPage ? "bg-hero" : "bg-neutral"}>
            <footer className="container mx-auto grid grid-cols-2 gap-8 p-10 text-sm text-neutral-content md:grid-cols-6 md:gap-4">
                <div className="col-span-2 flex w-full flex-col items-center justify-center gap-1 md:items-start">
                    <LinkWithLocale href="/">
                        <Logo fontsize="text-3xl" />
                    </LinkWithLocale>
                    <p className="w-full text-center text-sm font-light opacity-90 md:text-left">{tNav("footerSubtitle")}</p>
                </div>

                <div className="flex flex-col items-start gap-1 text-left opacity-90  md:items-end md:text-right">
                    <div className="footer-title">{tNav("links.social.title")}</div>
                    <a className="cursor-not-allowed opacity-80">{tNav("links.social.facebook")}</a>
                    <a className="cursor-not-allowed opacity-80">{tNav("links.social.instagram")}</a>
                </div>
                <div className="flex flex-col items-end gap-1 text-right opacity-90  md:text-left ">
                    <div className="footer-title">{tNav("links.company.title")}</div>
                    <LinkWithLocale className="link-hover link" href="/about-us">
                        {tNav("links.company.aboutUs")}
                    </LinkWithLocale>
                    <LinkWithLocale className="link-hover link" href="/why-choose-us">
                        {tNav("links.company.whyChooseUs")}
                    </LinkWithLocale>
                </div>
                <div className="flex flex-col items-start gap-1 text-left opacity-90  md:items-end md:text-right">
                    <div className="footer-title">{tNav("links.support.title")}</div>
                    <LinkWithLocale className="link-hover link" href="/contact-us">
                        {tNav("links.support.contactUs")}
                    </LinkWithLocale>
                    <LinkWithLocale className="link-hover link" href="/safety-tips">
                        {tNav("links.support.safetyTips")}
                    </LinkWithLocale>
                    <LinkWithLocale className="link-hover link" href="/faqs">
                        {tNav("links.support.faqs")}
                    </LinkWithLocale>
                </div>
                <div className="flex flex-col items-end gap-1 text-right opacity-90  md:text-right">
                    <div className="footer-title"> {tNav("links.legal.title")}</div>
                    <LinkWithLocale className="link-hover link" href="/terms-of-use">
                        {tNav("links.legal.termsOfUse")}
                    </LinkWithLocale>
                    <LinkWithLocale className="link-hover link" href="/privacy-policy">
                        {tNav("links.legal.privacyPolicy")}
                    </LinkWithLocale>
                    <LinkWithLocale className="link-hover link" href="/cookie-policy">
                        {tNav("links.legal.cookiePolicy")}
                    </LinkWithLocale>
                </div>
            </footer>
        </div>
    );
};
