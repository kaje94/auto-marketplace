import { clsx } from "clsx";
import { Metadata, ResolvingMetadata } from "next";
import { ReactNode } from "react";
import { displayFont } from "@/app/fonts";
import { LinkWithLocale } from "@/components/Common";
import { env } from "@/env.mjs";
import { getAlternativeLinks } from "@/utils/countries";

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
    const previousTwitter = (await parent).twitter || {};
    const previousOpenGraph = (await parent).openGraph || {};

    const title = "Targabay - Privacy Policy";
    const description =
        "Understand how Targabay prioritizes your privacy with our detailed Privacy Policy. Learn about the collection, use, and safeguarding of your personal information as you engage with our online marketplace. Explore our commitment to providing a secure and personalized platform for buying and selling cars, bikes, and more. Your trust is our priority at Targabay.";

    return {
        title,
        description,
        openGraph: { ...previousOpenGraph, title, description },
        twitter: { ...previousTwitter, title, description },
        alternates: getAlternativeLinks("/privacy-policy"),
    };
}

export default function Page() {
    return (
        <div className="container relative mx-auto mb-5 px-4 py-8 md:px-4 lg:px-10">
            <h3 className={clsx(displayFont.className, "mb-4 text-3xl lg:text-center lg:text-4xl xl:mb-6")}>Privacy Policy</h3>
            <p className="opacity-70">Last Updated: 18/11/2023</p>
            <p>
                This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you use our online vehicle
                marketplace. By accessing or using Targabay, you agree to the terms of this Privacy Policy.
            </p>
            <div className="mx-auto flex flex-col gap-3">
                <PrivacyPolicySection title="1. Information We Collect">
                    <PrivacyPolicyItem
                        content="We collect personal information that you voluntarily provide when you create an account, update your profile, or engage in transactions on Targabay. This information may include, but is not limited to:"
                        items={[
                            "Name: To personalize your Targabay experience.",
                            "Email address: For communication and account verification.",
                            "Contact information: Facilitate transactions and provide customer support.",
                            "Profile details: Enhance your user experience on the platform.",
                        ]}
                        title="1.1 Personal Information:"
                    />
                    <PrivacyPolicyItem
                        content="We may automatically collect certain information when you use Targabay, including:"
                        items={[
                            "Device information: Understand the devices accessing Targabay for optimization.",
                            "Usage data: Analyze how users interact with the platform for improvements.",
                            <span key="cookie-policy-desc">
                                Cookies and similar technologies: Enhance user experience and track preferences. For more details on how we use
                                cookies, please refer to our{" "}
                                <LinkWithLocale className="link-hover link font-semibold text-neutral" href="/cookie-policy">
                                    Cookie policy
                                </LinkWithLocale>
                                .
                            </span>,
                        ]}
                        title="1.2 Automatically Collected Information:"
                    />
                </PrivacyPolicySection>
                <PrivacyPolicySection title="2. How We Use Your Information">
                    <p>We use the collected information for the following purposes:</p>
                    <PrivacyPolicyItem
                        items={[
                            "Facilitating transactions between buyers and sellers by sharing necessary information.",
                            "Enhancing and customizing user experience based on preferences.",
                            "Developing new features and services to improve the platform.",
                        ]}
                        title="2.1 Providing and Improving Services:"
                    />
                    <PrivacyPolicyItem
                        items={[
                            "Sending transaction notifications to keep users informed about their activities on Targabay.",
                            "Providing customer support and responding to inquiries.",
                            "Sending promotional and marketing communications (with user consent) to keep users informed about new features and promotions.",
                        ]}
                        title="2.2 Communication:"
                    />
                    <PrivacyPolicyItem
                        items={[
                            "Complying with legal obligations and responding to law enforcement requests.",
                            "Enforcing our Terms of Use to ensure a secure and trustworthy platform.",
                        ]}
                        title="2.3 Legal Compliance:"
                    />
                </PrivacyPolicySection>
                <PrivacyPolicySection title="3. Information Sharing">
                    <PrivacyPolicyItem
                        content="We may share your information with:"
                        items={[
                            "Other users as necessary for transactions to occur.",
                            "Third-party service providers assisting in platform operations, such as payment processors.",
                            "Legal authorities to comply with legal requirements.",
                        ]}
                    />
                </PrivacyPolicySection>
                <PrivacyPolicySection title="4. Data Security">
                    <p>
                        We take reasonable measures to protect your personal information from unauthorized access, disclosure, alteration, and
                        destruction. These measures include encryption, secure server configurations, and routine security assessments.
                    </p>
                </PrivacyPolicySection>
                <PrivacyPolicySection title="5. Your Choices">
                    <PrivacyPolicyItem
                        content="You can update or delete your account information at any time through the account settings on Targabay."
                        title="5.1 Account Information:"
                    />
                    <PrivacyPolicyItem
                        content="You can opt out of receiving promotional emails by following the unsubscribe instructions included in the emails."
                        title="5.2 Marketing Communications:"
                    />
                </PrivacyPolicySection>
                <PrivacyPolicySection title="6. Third-Party Links and Services">
                    <p>
                        Targabay may contain links to third-party websites or services. We are not responsible for their privacy practices, and we
                        encourage you to review their privacy policies before interacting with them.
                    </p>
                </PrivacyPolicySection>
                <PrivacyPolicySection title="7. Children's Privacy">
                    <p>
                        Targabay is not directed to individuals under the age of 13. If you are aware that a child under 13 has provided us with
                        personal information, please contact us, and we will take steps to delete such information.{" "}
                    </p>
                </PrivacyPolicySection>
                <PrivacyPolicySection title="8. Changes to this Privacy Policy">
                    <p>
                        We may update this Privacy Policy periodically. We will notify users of any material changes by posting the updated policy on
                        Targabay and updating the &quot;Last Updated&quot; date.
                    </p>
                </PrivacyPolicySection>
                <PrivacyPolicySection title="9. Contact Us">
                    <p>
                        If you have any questions, concerns, or requests regarding this Privacy Policy, please contact us at{" "}
                        <a className="link-hover link font-semibold" href={`mailto:${env.NEXT_PUBLIC_SUPPORT_EMAIL}`}>
                            {env.NEXT_PUBLIC_SUPPORT_EMAIL}
                        </a>
                        .
                    </p>
                </PrivacyPolicySection>
            </div>
        </div>
    );
}
