import { getSession } from "@auth0/nextjs-auth0";
import { clsx } from "clsx";
import { Metadata, ResolvingMetadata } from "next";
import { ReactNode } from "react";
import { displayFont } from "@/app/fonts";
import { LinkWithLocale } from "@/components/Common";
import { ContactUsForm } from "@/components/Forms/ContactUs";
import { env } from "@/env.mjs";
import { RecaptchaProvider } from "@/providers/RecaptchaProvider";
import { getAlternativeLinks } from "@/utils/countries";

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
        alternates: getAlternativeLinks("/contact-us"),
    };
}
export default async function Page() {
    const session = await getSession();

    return (
        <div className="container relative mx-auto mb-5 px-4 py-8 md:px-4 lg:px-10">
            <div className="grid w-full gap-4 md:gap-6 xl:grid-cols-3 xl:gap-8">
                <div className="xl:col-span-2 ">
                    <h3 className={clsx(displayFont.className, "mb-4 text-3xl lg:text-4xl xl:mb-6")}>Contact Us</h3>
                    <p className="opacity-70">
                        Please use the form below to reach out to us. We&quot;ll get back to you as soon as possible. You can also directly get in
                        touch with us by dropping us a message at&nbsp;
                        <a className="link-hover link font-semibold" href={`mailto:${env.NEXT_PUBLIC_SUPPORT_EMAIL}`}>
                            {env.NEXT_PUBLIC_SUPPORT_EMAIL}
                        </a>
                        . We value your inquiries and are committed to providing swift assistance.
                    </p>
                    <RecaptchaProvider>
                        <ContactUsForm session={session} />
                    </RecaptchaProvider>
                </div>
                <div className="flex flex-col justify-center gap-2">
                    <ContactUsItem
                        desc="Our team is committed to providing you with exceptional service and support. Whether you have a question, need assistance, or
                        want to share your feedback, we're here for you."
                        title="Get in Touch"
                    />
                    <ContactUsItem
                        desc="Monday - Friday: 8.00 AM - 8.00 PM"
                        subTitle="Our dedicated support team is available to assist you during the following hours:"
                        title="Customer Support Hours"
                    />
                    <ContactUsItem
                        desc={
                            <span>
                                Before reaching out, check our&nbsp;
                                <LinkWithLocale className="link-hover link font-semibold text-neutral" href="/faq">
                                    FAQ
                                </LinkWithLocale>
                                &nbsp; section for quick answers to common questions.
                            </span>
                        }
                        title="Frequently Asked Questions"
                    />
                    <ContactUsItem
                        desc="We respect your privacy. Your information will only be used for the purpose of responding to your inquiry."
                        title="Privacy Assurance"
                    />
                </div>
            </div>
        </div>
    );
}
