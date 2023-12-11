import { clsx } from "clsx";
import { Metadata, ResolvingMetadata } from "next";
import { ReactNode } from "react";
import { displayFont } from "@/app/fonts";
import { env } from "@/env.mjs";
import { getScopedI18n } from "@/locales/server";

const CookiePolicySection = ({ children, title }: { children: ReactNode; title: string }) => (
    <div>
        <h3 className="mb-3 mt-4 text-2xl font-bold">{title}</h3>
        <div className="flex flex-col gap-2">{children}</div>
    </div>
);

const CookiePolicyItem = ({ content, title }: { content?: string | ReactNode; title?: string }) => (
    <div>
        <h4 className="text-base font-semibold">{title}</h4>
        <p>{content}</p>
    </div>
);

export async function generateMetadata(_: unknown, parent: ResolvingMetadata): Promise<Metadata> {
    const [previousTwitter, previousOpenGraph, tCookiePolicyPage] = await Promise.all([
        (await parent).twitter || {},
        (await parent).openGraph || {},
        getScopedI18n("metadata.cookiePolicyRoute"),
    ]);

    const title = tCookiePolicyPage("title");
    const description = tCookiePolicyPage("desc");

    return {
        title,
        description,
        openGraph: { ...previousOpenGraph, title, description },
        twitter: { ...previousTwitter, title, description },
    };
}

export default async function Page() {
    const [tNav, tCookiePolicyPage] = await Promise.all([getScopedI18n("nav"), getScopedI18n("appRouter.cookiePolicyRoute")]);

    return (
        <div className="container relative mx-auto mb-5 px-4 py-8 md:px-4 lg:px-10">
            <h3 className={clsx(displayFont.className, "mb-4 text-3xl lg:text-center lg:text-4xl xl:mb-6")}>{tNav("links.legal.cookiePolicy")}</h3>
            <p className="opacity-70">{tCookiePolicyPage("updatedTime")}</p>
            <p>{tCookiePolicyPage("intro")}</p>
            <div className="mx-auto flex flex-col gap-3">
                <CookiePolicySection title={tCookiePolicyPage("section1.title")}>
                    <p>{tCookiePolicyPage("section1.content")}</p>
                </CookiePolicySection>
                <CookiePolicySection title={tCookiePolicyPage("section2.title")}>
                    <CookiePolicyItem
                        content={tCookiePolicyPage("section2.subSection1.content")}
                        title={tCookiePolicyPage("section2.subSection1.title")}
                    />
                    <CookiePolicyItem
                        content={tCookiePolicyPage("section2.subSection2.content")}
                        title={tCookiePolicyPage("section2.subSection2.title")}
                    />
                    <CookiePolicyItem
                        content={tCookiePolicyPage("section2.subSection3.content")}
                        title={tCookiePolicyPage("section2.subSection3.title")}
                    />
                    <CookiePolicyItem
                        content={tCookiePolicyPage("section2.subSection4.content")}
                        title={tCookiePolicyPage("section2.subSection4.title")}
                    />
                </CookiePolicySection>
                <CookiePolicySection title={tCookiePolicyPage("section3.title")}>
                    <p>{tCookiePolicyPage("section3.content")}</p>
                </CookiePolicySection>
                <CookiePolicySection title={tCookiePolicyPage("section4.title")}>
                    <p>{tCookiePolicyPage("section4.content")}</p>
                </CookiePolicySection>
                <CookiePolicySection title={tCookiePolicyPage("section5.title")}>
                    <p>{tCookiePolicyPage("section5.content")}</p>
                </CookiePolicySection>
                <CookiePolicySection title={tCookiePolicyPage("section6.title")}>
                    <p>
                        {tCookiePolicyPage("section6.content", {
                            email: (
                                <a className="link-hover link font-semibold" href={`mailto:${env.NEXT_PUBLIC_SUPPORT_EMAIL}`}>
                                    {env.NEXT_PUBLIC_SUPPORT_EMAIL}
                                </a>
                            ),
                        })}
                    </p>
                </CookiePolicySection>
            </div>
        </div>
    );
}
