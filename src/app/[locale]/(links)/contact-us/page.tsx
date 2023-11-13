import { getSession } from "@auth0/nextjs-auth0/edge";
import { clsx } from "clsx";
import { ReactNode } from "react";
import { displayFont } from "@/app/fonts";
import { LinkWithLocale } from "@/components/Common";
import { ContactUsForm } from "@/components/ContactUsForm";
import { env } from "@/env.mjs";

const ContactUsItem = ({ title, desc, subTitle }: { desc: string | ReactNode; subTitle?: string; title: string }) => {
    return (
        <div>
            <div className="text-lg font-semibold">{title}</div>
            {subTitle && <div className="opacity-70">{subTitle}</div>}
            <div>{desc}</div>
        </div>
    );
};

export default async function Page() {
    const session = await getSession();

    return (
        <div className="container relative mx-auto mb-5 px-2 py-8 md:px-4 lg:px-10">
            <div className="container grid w-full gap-4 xl:grid-cols-3">
                <div className="p-4 xl:col-span-2 ">
                    <h3 className={clsx(displayFont.className, "text-2xl lg:text-4xl xl:mb-6")}>Contact Us</h3>
                    <p className="opacity-70">
                        Please use the form below to reach out to us. We&quot;ll get back to you as soon as possible. You can also directly get in
                        touch with us by dropping us a message at&nbsp;
                        <a className="link-hover link font-semibold" href={`mailto:${env.NEXT_PUBLIC_SUPPORT_EMAIL}`}>
                            {env.NEXT_PUBLIC_SUPPORT_EMAIL}
                        </a>
                        . We value your inquiries and are committed to providing swift assistance.
                    </p>
                    <ContactUsForm session={session} />
                </div>
                <div className="flex flex-col justify-center gap-2 p-4">
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
