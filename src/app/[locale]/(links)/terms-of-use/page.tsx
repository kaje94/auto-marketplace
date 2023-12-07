import { clsx } from "clsx";
import { Metadata, ResolvingMetadata } from "next";
import { ReactNode } from "react";
import { displayFont } from "@/app/fonts";
import { LinkWithLocale } from "@/components/Common";
import { getScopedI18n } from "@/locales/server";

const TermsOfUseSection = ({ children, title }: { children: ReactNode; title: string }) => (
    <div>
        <h3 className="mb-3 mt-4 text-2xl font-bold">{title}</h3>
        <div className="flex flex-col gap-2">{children}</div>
    </div>
);

const TermsOfUseItem = ({ content = [], title }: { content: string | ReactNode; title: string }) => (
    <div>
        <h4 className="text-base font-semibold">{title}</h4>
        <p>{content}</p>
    </div>
);

export async function generateMetadata(_: unknown, parent: ResolvingMetadata): Promise<Metadata> {
    const previousTwitter = (await parent).twitter || {};
    const previousOpenGraph = (await parent).openGraph || {};

    const title = "Targabay - Terms of Use";
    const description =
        "Review Targabay's Terms of Use to understand the guidelines governing your engagement with our online automotive marketplace. Learn about the rules, responsibilities, and agreements that ensure a fair and secure platform for buying and selling cars, bikes, and more. Targabay – Your trusted destination for transparent and mutually beneficial transactions in the world of vehicles.";

    return {
        title,
        description,
        openGraph: { ...previousOpenGraph, title, description },
        twitter: { ...previousTwitter, title, description },
    };
}

export default async function Page() {
    const tNav = await getScopedI18n("nav");
    const tFaqsPage = await getScopedI18n("termsOfUsePage");

    return (
        <div className="container relative mx-auto mb-5 px-4 py-8 md:px-4 lg:px-10">
            <h3 className={clsx(displayFont.className, "mb-4 text-3xl lg:text-center lg:text-4xl xl:mb-6")}>{tNav("links.legal.termsOfUse")}</h3>
            <p className="opacity-70">{tFaqsPage("updatedTime")}</p>
            <p>{tFaqsPage("intro")}</p>
            <div className="mx-auto flex flex-col gap-3">
                <TermsOfUseSection title={tFaqsPage("section1.title")}>
                    <p>{tFaqsPage("section1.desc")}</p>
                </TermsOfUseSection>
                <TermsOfUseSection title={tFaqsPage("section2.title")}>
                    <TermsOfUseItem content={tFaqsPage("section2.subSection1.content")} title={tFaqsPage("section2.subSection1.title")} />
                    <TermsOfUseItem content={tFaqsPage("section2.subSection2.content")} title={tFaqsPage("section2.subSection2.title")} />
                    <TermsOfUseItem content={tFaqsPage("section2.subSection3.content")} title={tFaqsPage("section2.subSection3.title")} />
                </TermsOfUseSection>
                <TermsOfUseSection title={tFaqsPage("section3.title")}>
                    <TermsOfUseItem content={tFaqsPage("section3.subSection1.content")} title={tFaqsPage("section3.subSection1.title")} />
                    <TermsOfUseItem
                        content={tFaqsPage("section3.subSection2.content", {
                            safetyTips: (
                                <LinkWithLocale className="link-hover link font-medium" href="/safety-tips">
                                    {tNav("links.support.safetyTips")}
                                </LinkWithLocale>
                            ),
                        })}
                        title={tFaqsPage("section3.subSection2.title")}
                    />
                </TermsOfUseSection>
                <TermsOfUseSection title={tFaqsPage("section4.title")}>
                    <p>{tFaqsPage("section4.desc")}</p>
                    <TermsOfUseItem content={tFaqsPage("section4.subSection1.content")} title={tFaqsPage("section4.subSection1.title")} />
                    <TermsOfUseItem
                        content={tFaqsPage("section4.subSection2.content", {
                            safetyTips: (
                                <LinkWithLocale className="link-hover link font-medium" href="/safety-tips">
                                    {tNav("links.support.safetyTips")}
                                </LinkWithLocale>
                            ),
                        })}
                        title={tFaqsPage("section4.subSection2.title")}
                    />
                </TermsOfUseSection>
                <TermsOfUseSection title={tFaqsPage("section5.title")}>
                    <p>{tFaqsPage("section5.desc")}</p>
                    <TermsOfUseItem content={tFaqsPage("section5.subSection1.content")} title={tFaqsPage("section5.subSection1.title")} />
                    <TermsOfUseItem content={tFaqsPage("section5.subSection2.content")} title={tFaqsPage("section5.subSection2.title")} />
                </TermsOfUseSection>
                <TermsOfUseSection title={tFaqsPage("section6.title")}>
                    <p>{tFaqsPage("section6.desc")}</p>
                    <TermsOfUseItem content={tFaqsPage("section6.subSection1.content")} title={tFaqsPage("section6.subSection1.title")} />
                    <TermsOfUseItem content={tFaqsPage("section6.subSection2.content.line1")} title={tFaqsPage("section6.subSection2.title")} />
                    <p>{tFaqsPage("section6.subSection2.content.line2")}</p>
                </TermsOfUseSection>
                <TermsOfUseSection title={tFaqsPage("section7.title")}>
                    <p>
                        {tFaqsPage("section7.desc", {
                            privacyPolicy: (
                                <LinkWithLocale className="link-hover link font-medium" href="/privacy-policy">
                                    {tNav("links.legal.privacyPolicy")}
                                </LinkWithLocale>
                            ),
                        })}
                    </p>
                </TermsOfUseSection>
                <TermsOfUseSection title={tFaqsPage("section8.title")}>
                    <p>{tFaqsPage("section8.desc1")}</p>
                    <p>{tFaqsPage("section8.desc2")}</p>
                </TermsOfUseSection>
                <TermsOfUseSection title={tFaqsPage("section9.title")}>
                    <TermsOfUseItem content={tFaqsPage("section9.subSection1.content")} title={tFaqsPage("section9.subSection1.title")} />
                    <TermsOfUseItem content={tFaqsPage("section9.subSection2.content")} title={tFaqsPage("section9.subSection2.title")} />
                </TermsOfUseSection>
                <TermsOfUseSection title={tFaqsPage("section10.title")}>
                    <p>{tFaqsPage("section10.desc")}</p>
                </TermsOfUseSection>
            </div>
        </div>
    );
}
