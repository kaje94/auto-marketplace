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
    const [previousTwitter, previousOpenGraph, tTermsOfUsePage] = await Promise.all([
        (await parent).twitter || {},
        (await parent).openGraph || {},
        getScopedI18n("metadata.termsOfUseRoute"),
    ]);

    const title = tTermsOfUsePage("title");
    const description = tTermsOfUsePage("desc");

    return {
        title,
        description,
        openGraph: { ...previousOpenGraph, title, description },
        twitter: { ...previousTwitter, title, description },
    };
}

export default async function Page() {
    const [tNav, tTermsOfUsePage] = await Promise.all([getScopedI18n("nav"), getScopedI18n("appRouter.termsOfUseRoute")]);

    return (
        <div className="container relative mx-auto mb-5 px-4 py-8 md:px-4 lg:px-10">
            <h3 className={clsx(displayFont.className, "mb-4 text-3xl lg:text-center lg:text-4xl xl:mb-6")}>{tNav("links.legal.termsOfUse")}</h3>
            <p className="opacity-70">{tTermsOfUsePage("updatedTime")}</p>
            <p>{tTermsOfUsePage("intro")}</p>
            <div className="mx-auto flex flex-col gap-3">
                <TermsOfUseSection title={tTermsOfUsePage("section1.title")}>
                    <p>{tTermsOfUsePage("section1.desc")}</p>
                </TermsOfUseSection>
                <TermsOfUseSection title={tTermsOfUsePage("section2.title")}>
                    <TermsOfUseItem content={tTermsOfUsePage("section2.subSection1.content")} title={tTermsOfUsePage("section2.subSection1.title")} />
                    <TermsOfUseItem content={tTermsOfUsePage("section2.subSection2.content")} title={tTermsOfUsePage("section2.subSection2.title")} />
                    <TermsOfUseItem content={tTermsOfUsePage("section2.subSection3.content")} title={tTermsOfUsePage("section2.subSection3.title")} />
                </TermsOfUseSection>
                <TermsOfUseSection title={tTermsOfUsePage("section3.title")}>
                    <TermsOfUseItem content={tTermsOfUsePage("section3.subSection1.content")} title={tTermsOfUsePage("section3.subSection1.title")} />
                    <TermsOfUseItem
                        content={tTermsOfUsePage("section3.subSection2.content", {
                            safetyTips: (
                                <LinkWithLocale className="link-hover link font-medium" href="/safety-tips">
                                    {tNav("links.support.safetyTips")}
                                </LinkWithLocale>
                            ),
                        })}
                        title={tTermsOfUsePage("section3.subSection2.title")}
                    />
                </TermsOfUseSection>
                <TermsOfUseSection title={tTermsOfUsePage("section4.title")}>
                    <p>{tTermsOfUsePage("section4.desc")}</p>
                    <TermsOfUseItem content={tTermsOfUsePage("section4.subSection1.content")} title={tTermsOfUsePage("section4.subSection1.title")} />
                    <TermsOfUseItem
                        content={tTermsOfUsePage("section4.subSection2.content", {
                            safetyTips: (
                                <LinkWithLocale className="link-hover link font-medium" href="/safety-tips">
                                    {tNav("links.support.safetyTips")}
                                </LinkWithLocale>
                            ),
                        })}
                        title={tTermsOfUsePage("section4.subSection2.title")}
                    />
                </TermsOfUseSection>
                <TermsOfUseSection title={tTermsOfUsePage("section5.title")}>
                    <p>{tTermsOfUsePage("section5.desc")}</p>
                    <TermsOfUseItem content={tTermsOfUsePage("section5.subSection1.content")} title={tTermsOfUsePage("section5.subSection1.title")} />
                    <TermsOfUseItem content={tTermsOfUsePage("section5.subSection2.content")} title={tTermsOfUsePage("section5.subSection2.title")} />
                </TermsOfUseSection>
                <TermsOfUseSection title={tTermsOfUsePage("section6.title")}>
                    <p>{tTermsOfUsePage("section6.desc")}</p>
                    <TermsOfUseItem content={tTermsOfUsePage("section6.subSection1.content")} title={tTermsOfUsePage("section6.subSection1.title")} />
                    <TermsOfUseItem
                        content={tTermsOfUsePage("section6.subSection2.content.line1")}
                        title={tTermsOfUsePage("section6.subSection2.title")}
                    />
                    <p>{tTermsOfUsePage("section6.subSection2.content.line2")}</p>
                </TermsOfUseSection>
                <TermsOfUseSection title={tTermsOfUsePage("section7.title")}>
                    <p>
                        {tTermsOfUsePage("section7.desc", {
                            privacyPolicy: (
                                <LinkWithLocale className="link-hover link font-medium" href="/privacy-policy">
                                    {tNav("links.legal.privacyPolicy")}
                                </LinkWithLocale>
                            ),
                        })}
                    </p>
                </TermsOfUseSection>
                <TermsOfUseSection title={tTermsOfUsePage("section8.title")}>
                    <p>{tTermsOfUsePage("section8.desc1")}</p>
                    <p>{tTermsOfUsePage("section8.desc2")}</p>
                </TermsOfUseSection>
                <TermsOfUseSection title={tTermsOfUsePage("section9.title")}>
                    <TermsOfUseItem content={tTermsOfUsePage("section9.subSection1.content")} title={tTermsOfUsePage("section9.subSection1.title")} />
                    <TermsOfUseItem content={tTermsOfUsePage("section9.subSection2.content")} title={tTermsOfUsePage("section9.subSection2.title")} />
                </TermsOfUseSection>
                <TermsOfUseSection title={tTermsOfUsePage("section10.title")}>
                    <p>{tTermsOfUsePage("section10.desc")}</p>
                </TermsOfUseSection>
            </div>
        </div>
    );
}
