import { clsx } from "clsx";
import { Metadata, ResolvingMetadata } from "next";
import { ReactNode } from "react";
import { displayFont } from "@/app/fonts";
import { LinkWithLocale } from "@/components/Common";
import { getAlternativeLinks } from "@/utils/countries";

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
        alternates: getAlternativeLinks("/terms-of-use"),
    };
}

export default function Page() {
    return (
        <div className="container relative mx-auto mb-5 px-4 py-8 md:px-4 lg:px-10">
            <h3 className={clsx(displayFont.className, "mb-4 text-3xl lg:text-center lg:text-4xl xl:mb-6")}>Terms Of Use</h3>
            <p className="opacity-70">Last Updated: 18/11/2023</p>
            <p>
                By accessing and using our online vehicle marketplace, you agree to comply with and be bound by the following terms and conditions. If
                you do not agree with these terms, please do not use Targabay.
            </p>
            <div className="mx-auto flex flex-col gap-3">
                <TermsOfUseSection title="1. User Agreement">
                    <p>
                        By using Targabay, you acknowledge that you have read, understood, and agree to be bound by these Terms of Use. If you are
                        using the platform on behalf of a business or other legal entity, you represent that you have the authority to bind that
                        entity to these terms.
                    </p>
                </TermsOfUseSection>
                <TermsOfUseSection title="2. Account Creation and Security">
                    <TermsOfUseItem
                        content="To access certain features of Targabay, such as creating listings or subscriptions, you may be required to log in. Targabay provides the convenience of social logins, including options like Google, to streamline the login process. During your first-ever login, you will be asked to complete your profile details. Please provide this information to ensure a seamless experience with Targabay."
                        title="2.1 Account Creation:"
                    />
                    <TermsOfUseItem
                        content="You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. Notify us immediately of any unauthorized use of your account or any other breach of security."
                        title="2.2 Account Security:"
                    />
                    <TermsOfUseItem
                        content="Targabay reserves the right to terminate or suspend accounts that violate these Terms of Use. Users may appeal account decisions by contacting us. Users also have the right to close their account voluntarily.
                        If you wish to close your account, please reach out to us through the designated contact channels or follow the account closure procedures available on the platform."
                        title="2.3 Account Termination:"
                    />
                </TermsOfUseSection>
                <TermsOfUseSection title="3. Listings and Selling">
                    <TermsOfUseItem
                        content="Users may list vehicles for sale on Targabay, subject to our listing policies. By creating a listing, you agree to provide accurate and truthful information about the vehicle."
                        title="3.1 Listing Policies:"
                    />
                    <TermsOfUseItem
                        content={
                            <span>
                                Users selling vehicles are responsible for carrying out the transactions with the buyer on their own. Targabay
                                facilitates the connection between buyers and sellers but is not responsible for the actual transaction process.
                                Sellers must adhere to the terms specified in their listings and conduct transactions in accordance with applicable
                                laws. Targabay is not responsible for any disputes that may arise between buyers and sellers, and users are encouraged
                                to resolve issues amicably. If disputes cannot be resolved, users may refer to our{" "}
                                <LinkWithLocale className="link-hover link font-medium" href="/safety-tips">
                                    Safety Tips
                                </LinkWithLocale>{" "}
                                for guidance or contact us if needed.
                            </span>
                        }
                        title="3.2 Transaction Process:"
                    />
                </TermsOfUseSection>
                <TermsOfUseSection title="4. Buying">
                    <p>When purchasing a vehicle on Targabay, users agree to:</p>
                    <TermsOfUseItem
                        content="Buyers are responsible for making payments to sellers in a secure manner. Targabay is not involved in the payment process and does not hold any responsibility for financial transactions between buyers and sellers."
                        title="4.1 Payment:"
                    />
                    <TermsOfUseItem
                        content={
                            <span>
                                Targabay is not responsible for any disputes that may arise between buyers and sellers during or after the
                                transaction. Users are encouraged to communicate effectively and resolve issues amicably. In case disputes cannot be
                                resolved, users may refer to our{" "}
                                <LinkWithLocale className="link-hover link font-medium" href="/safety-tips">
                                    Safety Tips
                                </LinkWithLocale>{" "}
                                for guidance or contact us if needed.
                            </span>
                        }
                        title="4.2 Disputes:"
                    />
                </TermsOfUseSection>
                <TermsOfUseSection title="5. Prohibited Activities">
                    <p>
                        Users are prohibited from engaging in activities that violate applicable laws or these Terms of Use. Prohibited activities
                        include but are not limited to:
                    </p>
                    <TermsOfUseItem content="Any form of fraudulent activity, including misrepresentation of vehicle details." title="5.1 Fraud:" />
                    <TermsOfUseItem content="Engaging in any illegal activities through the use of Targabay." title="5.2 Illegal Activities:" />
                </TermsOfUseSection>
                <TermsOfUseSection title="6. Intellectual Property">
                    <p>Targabay retains ownership of all intellectual property rights related to the platform, including but not limited to:</p>
                    <TermsOfUseItem
                        content="Targabay's name, logos, and any other trademarks associated with the platform."
                        title="6.1 Trademarks:"
                    />
                    <TermsOfUseItem content="All content provided on the platform, including text, images, and graphics." title="6.2 Content:" />
                    <p>Users are not authorized to use Targabay&apos;s branding or content without explicit permission.</p>
                </TermsOfUseSection>
                <TermsOfUseSection title="7. Privacy Policy">
                    <p>
                        By using Targabay, you agree to the terms outlined in our{" "}
                        <LinkWithLocale className="link-hover link font-medium" href="/privacy-policy">
                            Privacy Policy
                        </LinkWithLocale>
                        , which details the collection, use, and protection of user data.
                    </p>
                </TermsOfUseSection>
                <TermsOfUseSection title="8. Termination of Accounts">
                    <p>
                        Targabay reserves the right to terminate or suspend user accounts for violations of these Terms of Use. Users may appeal
                        account decisions by contacting us. Users also have the right to close their account voluntarily.
                    </p>
                    <p>
                        If you wish to close your account, please reach out to us through the designated contact channels or follow the account
                        closure procedures available on the platform.
                    </p>
                </TermsOfUseSection>
                <TermsOfUseSection title="9. Limitation of Liability">
                    <TermsOfUseItem
                        content="Targabay is not liable for any damages arising from the use of the platform. We do not warrant the accuracy, completeness, or usefulness of information on the platform."
                        title="9.1 Disclaimer:"
                    />
                    <TermsOfUseItem
                        content="Users agree to indemnify and hold Targabay and its affiliates harmless from any claims, losses, or damages."
                        title="9.2 Indemnification:"
                    />
                </TermsOfUseSection>
                <TermsOfUseSection title="10. Changes to Terms">
                    <p>
                        Targabay may update these Terms of Use from time to time. Users will be notified of any changes, and continued use of the
                        platform constitutes acceptance of the revised terms.
                    </p>
                </TermsOfUseSection>
            </div>
        </div>
    );
}
