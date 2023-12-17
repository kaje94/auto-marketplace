import { getSession } from "@auth0/nextjs-auth0/edge";
import { clsx } from "clsx";
import { Metadata, ResolvingMetadata } from "next";
import { ReactNode } from "react";
import { displayFont } from "@/app/fonts";
import { LinkWithLocale } from "@/components/Common";
import { ContactUsForm } from "@/components/ContactUsForm";
import { env } from "@/env.mjs";
import { getScopedI18n } from "@/locales/server";
import { RecaptchaProvider } from "@/providers/RecaptchaProvider";

const ContactUsItem = ({ title, desc, subTitle }: { desc: string | ReactNode; subTitle?: string; title: string }) => {
    return (
        <div>
            <div className="text-lg font-semibold">{title}</div>
            {subTitle && <div className="opacity-70">{subTitle}</div>}
            <div>{desc}</div>
        </div>
    );
};

export async function generateMetadata(_: unknown, parent: ResolvingMetadata): Promise<Metadata> {
    const previousTwitter = (await parent).twitter || {};
    const previousOpenGraph = (await parent).openGraph || {};

    const title = "Targabay - Contact Us";
    const description =
        "Get in touch with Targabay! Whether you have questions, feedback, or partnership inquiries, our team is here to assist you. Reach out to us for a seamless and personalized experience in your automotive journey. Contact Targabay – your go-to online marketplace for buying and selling cars, bikes, and more.";

    return {
        title,
        description,
        openGraph: { ...previousOpenGraph, title, description },
        twitter: { ...previousTwitter, title, description },
    };
}
export default async function Page() {
    const session = await getSession();
    const tNav = await getScopedI18n("nav");
    const tContactUsPage = await getScopedI18n("contactUsPage");

    return (
        <div className="container relative mx-auto mb-5 px-4 py-8 md:px-4 lg:px-10">
            <div className="grid w-full gap-4 md:gap-6 xl:grid-cols-3 xl:gap-8">
                <div className="xl:col-span-2 ">
                    <h3 className={clsx(displayFont.className, "mb-4 text-3xl lg:text-4xl xl:mb-6")}>{tNav("links.support.contactUs")}</h3>
                    <p className="opacity-70">
                        {tContactUsPage("desc", {
                            email: (
                                <a className="link-hover link font-semibold" href={`mailto:${env.NEXT_PUBLIC_SUPPORT_EMAIL}`}>
                                    {env.NEXT_PUBLIC_SUPPORT_EMAIL}
                                </a>
                            ),
                        })}
                    </p>
                    <RecaptchaProvider>
                        <ContactUsForm session={session} />
                    </RecaptchaProvider>
                </div>
                <div className="flex flex-col justify-center gap-2">
                    <ContactUsItem desc={tContactUsPage("additionalInfo.section1.content")} title={tContactUsPage("additionalInfo.section1.title")} />
                    <ContactUsItem
                        desc={tContactUsPage("additionalInfo.section2.content")}
                        subTitle={tContactUsPage("additionalInfo.section2.subTitle")}
                        title={tContactUsPage("additionalInfo.section2.title")}
                    />
                    <ContactUsItem
                        desc={tContactUsPage("additionalInfo.section3.content", {
                            faq: (
                                <LinkWithLocale className="link-hover link font-semibold text-neutral" href="/faq">
                                    {tNav("links.support.faqs")}
                                </LinkWithLocale>
                            ),
                        })}
                        title={tContactUsPage("additionalInfo.section3.title")}
                    />
                    <ContactUsItem desc={tContactUsPage("additionalInfo.section4.content")} title={tContactUsPage("additionalInfo.section4.title")} />
                </div>
            </div>
        </div>
    );
}
