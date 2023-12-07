import { clsx } from "clsx";
import { Metadata, ResolvingMetadata } from "next";
import { ReactNode } from "react";
import { displayFont } from "@/app/fonts";
import { getScopedI18n } from "@/locales/server";

const SafetyTipSection = ({ children, title }: { children: ReactNode; title: string }) => (
    <div>
        <h3 className="mb-3 mt-4 text-2xl font-bold">{title}</h3>
        <div className="flex flex-col gap-2">{children}</div>
    </div>
);

const SafetyTipItem = ({ tips = [], title }: { tips: (string | ReactNode)[]; title: string }) => (
    <div>
        <h4 className="text-base font-semibold">{title}</h4>
        <ul className="list-disc pl-5">
            {tips.map((value, index) => (
                <li key={`tip-${index}`}>{value}</li>
            ))}
        </ul>
    </div>
);

export async function generateMetadata(_: unknown, parent: ResolvingMetadata): Promise<Metadata> {
    const previousTwitter = (await parent).twitter || {};
    const previousOpenGraph = (await parent).openGraph || {};

    const title = "Targabay - Safety Tips";
    const description =
        "Explore Targabay's Safety Tips to ensure a secure and confident experience on our online marketplace. Discover valuable insights and guidelines for buying and selling cars, bikes, and more. Prioritize safety in every transaction with our expert tips and recommendations. Targabay – Your trusted destination for a safe and enjoyable automotive journey.";

    return {
        title,
        description,
        openGraph: { ...previousOpenGraph, title, description },
        twitter: { ...previousTwitter, title, description },
    };
}

export default async function Page() {
    const tNav = await getScopedI18n("nav");
    const tSafetyTipsPage = await getScopedI18n("safetyTipsPage");
    return (
        <div className="container relative mx-auto mb-5 px-4 py-8 md:px-4 lg:px-10">
            <h3 className={clsx(displayFont.className, "mb-4 text-3xl lg:text-center lg:text-4xl xl:mb-6")}>{tNav("links.support.safetyTips")}</h3>
            <p>{tSafetyTipsPage("desc")}</p>
            <div className="mx-auto flex flex-col gap-3">
                <SafetyTipSection title={tSafetyTipsPage("section1.title")}>
                    <SafetyTipItem
                        tips={[tSafetyTipsPage("section1.subSection1.items.0"), tSafetyTipsPage("section1.subSection1.items.1")]}
                        title={tSafetyTipsPage("section1.subSection1.title")}
                    />
                    <SafetyTipItem tips={[tSafetyTipsPage("section1.subSection2.items.0")]} title={tSafetyTipsPage("section1.subSection2.title")} />
                    <SafetyTipItem
                        tips={[tSafetyTipsPage("section1.subSection3.items.0"), tSafetyTipsPage("section1.subSection3.items.1")]}
                        title={tSafetyTipsPage("section1.subSection3.title")}
                    />
                </SafetyTipSection>
                <SafetyTipSection title={tSafetyTipsPage("section2.title")}>
                    <SafetyTipItem
                        tips={[tSafetyTipsPage("section2.subSection1.items.0"), tSafetyTipsPage("section2.subSection1.items.1")]}
                        title={tSafetyTipsPage("section2.subSection1.title")}
                    />
                    <SafetyTipItem
                        tips={[tSafetyTipsPage("section2.subSection2.items.0"), tSafetyTipsPage("section2.subSection2.items.1")]}
                        title={tSafetyTipsPage("section2.subSection2.title")}
                    />
                    <SafetyTipItem tips={[tSafetyTipsPage("section2.subSection3.items.0")]} title={tSafetyTipsPage("section2.subSection3.title")} />
                </SafetyTipSection>
                <SafetyTipSection title={tSafetyTipsPage("section3.title")}>
                    <SafetyTipItem
                        tips={[tSafetyTipsPage("section3.subSection1.items.0"), tSafetyTipsPage("section3.subSection1.items.1")]}
                        title={tSafetyTipsPage("section3.subSection1.title")}
                    />
                    <SafetyTipItem
                        tips={[tSafetyTipsPage("section3.subSection2.items.0"), tSafetyTipsPage("section3.subSection2.items.1")]}
                        title={tSafetyTipsPage("section3.subSection2.title")}
                    />
                    <SafetyTipItem
                        tips={[tSafetyTipsPage("section3.subSection3.items.0"), tSafetyTipsPage("section3.subSection3.items.1")]}
                        title={tSafetyTipsPage("section3.subSection3.title")}
                    />
                </SafetyTipSection>
                <SafetyTipSection title={tSafetyTipsPage("section4.title")}>
                    <SafetyTipItem tips={[tSafetyTipsPage("section4.subSection1.items.0")]} title={tSafetyTipsPage("section4.subSection1.title")} />
                </SafetyTipSection>
                <SafetyTipSection title={tSafetyTipsPage("section5.title")}>
                    <SafetyTipItem
                        tips={[tSafetyTipsPage("section5.subSection1.items.0"), tSafetyTipsPage("section5.subSection1.items.1")]}
                        title={tSafetyTipsPage("section5.subSection1.title")}
                    />
                    <SafetyTipItem tips={[tSafetyTipsPage("section5.subSection2.items.0")]} title={tSafetyTipsPage("section5.subSection2.title")} />
                </SafetyTipSection>
            </div>
        </div>
    );
}
