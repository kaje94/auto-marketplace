import { clsx } from "clsx";
import { Metadata, ResolvingMetadata } from "next";
import { ReactNode } from "react";
import { displayFont } from "@/app/fonts";
import { LinkWithLocale } from "@/components/Common";
import { env } from "@/env.mjs";
import { getScopedI18n } from "@/locales/server";

const PrivacyPolicySection = ({ children, title }: { children: ReactNode; title: string }) => (
    <div>
        <h3 className="mb-3 mt-4 text-2xl font-bold">{title}</h3>
        <div className="flex flex-col gap-2">{children}</div>
    </div>
);

const PrivacyPolicyItem = ({ content, items = [], title }: { content?: string | ReactNode; items?: (string | ReactNode)[]; title?: string }) => (
    <div>
        <h4 className="text-base font-semibold">{title}</h4>
        <p>{content}</p>
        {items.length > 0 && (
            <ul className="list-disc pl-5 ">
                {items.map((item, index) => (
                    <li key={`li-item-${index}`}>{item}</li>
                ))}
            </ul>
        )}
    </div>
);

export async function generateMetadata(_: unknown, parent: ResolvingMetadata): Promise<Metadata> {
    const [previousTwitter, previousOpenGraph, tPrivacyPolicyPage] = await Promise.all([
        (await parent).twitter || {},
        (await parent).openGraph || {},
        getScopedI18n("metadata.privacyPolicyRoute"),
    ]);

    const title = tPrivacyPolicyPage("title");
    const description = tPrivacyPolicyPage("desc");

    return {
        title,
        description,
        openGraph: { ...previousOpenGraph, title, description },
        twitter: { ...previousTwitter, title, description },
    };
}

export default async function Page() {
    const [tNav, tPrivacyPolicyPage] = await Promise.all([getScopedI18n("nav"), getScopedI18n("appRouter.privacyPolicyRoute")]);

    return (
        <div className="container relative mx-auto mb-5 px-4 py-8 md:px-4 lg:px-10">
            <h3 className={clsx(displayFont.className, "mb-4 text-3xl lg:text-center lg:text-4xl xl:mb-6")}>{tNav("links.legal.privacyPolicy")}</h3>
            <p className="opacity-70">{tPrivacyPolicyPage("updatedTime")}</p>
            <p>{tPrivacyPolicyPage("intro")}</p>
            <div className="mx-auto flex flex-col gap-3">
                <PrivacyPolicySection title={tPrivacyPolicyPage("section1.title")}>
                    <PrivacyPolicyItem
                        content={tPrivacyPolicyPage("section1.subSection1.desc")}
                        items={[
                            tPrivacyPolicyPage("section1.subSection1.items.0"),
                            tPrivacyPolicyPage("section1.subSection1.items.1"),
                            tPrivacyPolicyPage("section1.subSection1.items.2"),
                            tPrivacyPolicyPage("section1.subSection1.items.3"),
                        ]}
                        title={tPrivacyPolicyPage("section1.subSection1.title")}
                    />
                    <PrivacyPolicyItem
                        content={tPrivacyPolicyPage("section1.subSection2.desc")}
                        items={[
                            tPrivacyPolicyPage("section1.subSection2.items.0"),
                            tPrivacyPolicyPage("section1.subSection2.items.1"),
                            tPrivacyPolicyPage("section1.subSection2.items.2", {
                                cookiePolicy: (
                                    <LinkWithLocale className="link-hover link font-semibold text-neutral" href="/cookie-policy">
                                        {tNav("links.legal.cookiePolicy")}
                                    </LinkWithLocale>
                                ),
                            }),
                        ]}
                        title={tPrivacyPolicyPage("section1.subSection2.title")}
                    />
                </PrivacyPolicySection>
                <PrivacyPolicySection title={tPrivacyPolicyPage("section2.title")}>
                    <p>{tPrivacyPolicyPage("section2.desc")}</p>
                    <PrivacyPolicyItem
                        items={[
                            tPrivacyPolicyPage("section2.subSection1.items.0"),
                            tPrivacyPolicyPage("section2.subSection1.items.1"),
                            tPrivacyPolicyPage("section2.subSection1.items.2"),
                        ]}
                        title={tPrivacyPolicyPage("section2.subSection1.title")}
                    />
                    <PrivacyPolicyItem
                        items={[
                            tPrivacyPolicyPage("section2.subSection2.items.0"),
                            tPrivacyPolicyPage("section2.subSection2.items.1"),
                            tPrivacyPolicyPage("section2.subSection2.items.2"),
                        ]}
                        title={tPrivacyPolicyPage("section2.subSection2.title")}
                    />
                    <PrivacyPolicyItem
                        items={[tPrivacyPolicyPage("section2.subSection3.items.0"), tPrivacyPolicyPage("section2.subSection3.items.1")]}
                        title={tPrivacyPolicyPage("section2.subSection3.title")}
                    />
                </PrivacyPolicySection>
                <PrivacyPolicySection title={tPrivacyPolicyPage("section3.title")}>
                    <PrivacyPolicyItem
                        content={tPrivacyPolicyPage("section3.desc")}
                        items={[
                            tPrivacyPolicyPage("section3.items.0"),
                            tPrivacyPolicyPage("section3.items.1"),
                            tPrivacyPolicyPage("section3.items.2"),
                        ]}
                    />
                </PrivacyPolicySection>
                <PrivacyPolicySection title={tPrivacyPolicyPage("section4.title")}>
                    <p>{tPrivacyPolicyPage("section4.desc")}</p>
                </PrivacyPolicySection>
                <PrivacyPolicySection title={tPrivacyPolicyPage("section5.title")}>
                    <PrivacyPolicyItem
                        content={tPrivacyPolicyPage("section5.subSection1.content")}
                        title={tPrivacyPolicyPage("section5.subSection1.title")}
                    />
                    <PrivacyPolicyItem
                        content={tPrivacyPolicyPage("section5.subSection2.content")}
                        title={tPrivacyPolicyPage("section5.subSection2.title")}
                    />
                </PrivacyPolicySection>
                <PrivacyPolicySection title={tPrivacyPolicyPage("section6.title")}>
                    <p>{tPrivacyPolicyPage("section6.desc")}</p>
                </PrivacyPolicySection>
                <PrivacyPolicySection title={tPrivacyPolicyPage("section7.title")}>
                    <p>{tPrivacyPolicyPage("section7.desc")}</p>
                </PrivacyPolicySection>
                <PrivacyPolicySection title={tPrivacyPolicyPage("section8.title")}>
                    <p>{tPrivacyPolicyPage("section8.desc")}</p>
                </PrivacyPolicySection>
                <PrivacyPolicySection title={tPrivacyPolicyPage("section9.title")}>
                    <p>
                        {tPrivacyPolicyPage("section9.desc", {
                            email: (
                                <a className="link-hover link font-semibold" href={`mailto:${env.NEXT_PUBLIC_SUPPORT_EMAIL}`}>
                                    {env.NEXT_PUBLIC_SUPPORT_EMAIL}
                                </a>
                            ),
                        })}
                    </p>
                </PrivacyPolicySection>
            </div>
        </div>
    );
}
