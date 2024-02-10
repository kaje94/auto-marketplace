import { clsx } from "clsx";
import { Metadata, ResolvingMetadata } from "next";
import { ReactNode } from "react";
import { displayFont } from "@/app/fonts";
import { env } from "@/env.mjs";
import { getAlternativeLinks } from "@/utils/countries";

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
    const previousOpenGraph = (await parent).openGraph || {};
    const previousTwitter = (await parent).twitter || {};

    const title = "Targabay - Cookie Policy";
    const description =
        "Explore Targabay's Cookie Policy to understand how we use cookies and similar technologies on our online marketplace. Learn about the types of cookies we employ and how they enhance your experience. Discover how we prioritize your privacy while providing a seamless and secure platform for buying and selling cars, bikes, and more.";

    return {
        title,
        description,
        openGraph: { ...previousOpenGraph, title, description },
        twitter: { ...previousTwitter, title, description },
        alternates: getAlternativeLinks("/cookie-policy"),
    };
}

export default function Page() {
    return (
        <div className="container relative mx-auto mb-5 px-4 py-8 md:px-4 lg:px-10">
            <h3 className={clsx(displayFont.className, "mb-4 text-3xl lg:text-center lg:text-4xl xl:mb-6")}>Cookie Policy</h3>
            <p className="opacity-70">Last Updated: 18/11/2023</p>
            <p>
                This Cookie Policy explains how we use cookies and similar technologies on our online vehicle marketplace. By using Targabay, you
                agree to the use of cookies as described in this policy.
            </p>
            <div className="mx-auto flex flex-col gap-3">
                <CookiePolicySection title="1. What Are Cookies?">
                    <p>
                        Cookies are small text files created by a website&apos;s server and stored on your device. They help the site remember your
                        preferences, analyze interactions, and deliver personalized content. While accessible to both the server and client-side
                        scripts, security measures are in place to protect your data.
                    </p>
                </CookiePolicySection>
                <CookiePolicySection title="2. How We Use Cookies">
                    <CookiePolicyItem
                        content="These cookies are necessary for the proper functioning of Targabay. They enable you to navigate our website and use its features, such as accessing secure areas or making transactions. Without these cookies, Targabay may not function properly."
                        title="2.1 Essential Cookies"
                    />
                    <CookiePolicyItem
                        content="We use performance cookies to collect information about how visitors use our website. This includes data such as the pages you visit most frequently, the type of device you use, and any error messages you encounter. This information helps us analyze and improve the performance of the website, enhance the user experience, and understand which pages are most and least popular."
                        title="2.2 Performance Cookies"
                    />
                    <CookiePolicyItem
                        content="Functionality cookies allow the website to remember choices you make (such as your username, language, or region) and provide enhanced, more personalized features. For example, they may remember your login details or the region you are in to provide you with locally relevant content."
                        title="2.3 Functionality Cookies"
                    />
                    <CookiePolicyItem
                        content="These cookies are used to deliver advertisements that are more relevant to you and your interests. They may be placed on our website by advertising partners and help limit the number of times you see an advertisement. Additionally, they assist in measuring the effectiveness of our advertising campaigns."
                        title="2.4 Advertising/Targeting Cookies"
                    />
                </CookiePolicySection>
                <CookiePolicySection title="3. Third-Party Cookies">
                    <p>
                        As of now, Targabay does not employ any third-party services that independently set their own cookies. Consequently, we lack
                        control over any third-party cookies, and they are not utilized by us for purposes such as analytics or targeted advertising.
                        Our commitment is to transparency and safeguarding your privacy by limiting the use of external cookies on our platform.{" "}
                    </p>
                </CookiePolicySection>
                <CookiePolicySection title="4. Managing Cookies">
                    <p>
                        Most web browsers allow you to control cookies through their settings preferences. You can typically find these settings in
                        the &quot;Options&quot; or &quot;Preferences&quot; menu of your browser. However, please note that limiting the ability of
                        websites to set cookies may affect your overall user experience, and certain features of Targabay may not function correctly.
                    </p>
                </CookiePolicySection>
                <CookiePolicySection title="5. Changes to This Cookie Policy">
                    <p>
                        We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or
                        regulatory reasons. Any changes will be posted on this page, and the &quot;Last Updated&quot; date will be revised
                        accordingly. We encourage you to check this page periodically for the latest information on our use of cookies.
                    </p>
                </CookiePolicySection>
                <CookiePolicySection title="6. Contact Us">
                    <p>
                        If you have any questions, concerns, or requests regarding this Cookie Policy, please contact us at{" "}
                        <a className="link-hover link font-semibold" href={`mailto:${env.NEXT_PUBLIC_SUPPORT_EMAIL}`}>
                            {env.NEXT_PUBLIC_SUPPORT_EMAIL}
                        </a>
                        .
                    </p>
                </CookiePolicySection>
            </div>
        </div>
    );
}
