import { clsx } from "clsx";
import { Metadata, ResolvingMetadata } from "next";
import { ReactNode } from "react";
import { displayFont } from "@/app/fonts";
import { LinkWithLocale } from "@/components/Common";
import { env } from "@/env.mjs";
import { getAlternativeLinks } from "@/utils/countries";

const QuestionSection = ({ children, title }: { children: ReactNode; title: string }) => (
    <div>
        <h3 className="mb-3 mt-4 text-2xl font-bold">{title}</h3>
        <div className="flex flex-col gap-2">{children}</div>
    </div>
);

const QuestionItem = ({ answer, question }: { answer: string | ReactNode; question: string }) => (
    <div>
        <h4 className="text-base font-semibold">{question}</h4>
        <p>{answer}</p>
    </div>
);

export async function generateMetadata(_: unknown, parent: ResolvingMetadata): Promise<Metadata> {
    const previousTwitter = (await parent).twitter || {};
    const previousOpenGraph = (await parent).openGraph || {};

    const title = "Targabay - Frequently Asked Questions";
    const description =
        "Find answers to common queries on Targabay's FAQ page. Explore comprehensive information about buying, selling, and navigating our online marketplace for cars, bikes, and more. Streamline your experience with insights into our policies, transactions, and everything you need to know. Targabay – Your go-to resource for a seamless automotive journey.";

    return {
        title,
        description,
        openGraph: { ...previousOpenGraph, title, description },
        twitter: { ...previousTwitter, title, description },
        alternates: getAlternativeLinks("/faqs"),
    };
}

export default function Page() {
    return (
        <div className="container relative mx-auto mb-5 px-4 py-8 md:px-4 lg:px-10">
            <h3 className={clsx(displayFont.className, "mb-4 text-3xl lg:text-center lg:text-4xl xl:mb-6")}>Frequently Asked Questions</h3>
            <div className="mx-auto flex flex-col gap-3">
                <QuestionSection title="About Targabay">
                    <QuestionItem
                        answer="Targabay is an online marketplace dedicated to buying and selling vehicles. Our platform streamlines the process of connecting buyers and sellers, ensuring a smooth automotive transaction experience."
                        question="1. What is Targabay?"
                    />
                    <QuestionItem
                        answer="Targabay facilitates the seamless buying and selling of vehicles through a user-friendly platform. Users can easily create listings, explore available vehicles, subscribe to new listing alerts that they are interested in and connect with potential buyers or sellers."
                        question="2. How does Targabay work?"
                    />
                    <QuestionItem
                        answer="Yes, creating an account and browsing listings on Targabay is free. However, certain premium features, like marking an advert as a featured advert for increased visibility, may have associated costs. Contact us for more details."
                        question="3. Is Targabay free to use?"
                    />
                </QuestionSection>
                <QuestionSection title="Account and Listings">
                    <QuestionItem
                        answer="You can use social logins, such as your Google account, to easily sign up on Targabay. For a seamless experience, we recommend completing your profile details, especially for first-time users."
                        question="4. How do I create an account on Targabay?"
                    />
                    <QuestionItem
                        answer="No, you can browse vehicle listings without creating an account. However, signing up is necessary for creating adverts, subscribing to listings alerts, or accessing additional features."
                        question="5. Do I need an account to browse listings?"
                    />
                    <QuestionItem
                        answer={`To create a listing, log in to your Targabay account and click on the "Post Your Advert" button. Provide the necessary details about your vehicle. The listing will only be publicly visible once reviewed and verified by us.`}
                        question="6. How do I create a listing to sell my vehicle on Targabay?"
                    />
                    <QuestionItem
                        answer="Adverts are typically verified within a few days to a week. You will receive an email notification once the advert has been reviewed."
                        question="7. How long will it take to verify the Advert?"
                    />
                    <QuestionItem
                        answer="If your advert is rejected, you'll receive an email explaining the reasons. Update the advert as requested, and we'll re-review it for approval."
                        question="8. My advert was rejected. What do I need to do?"
                    />
                    <QuestionItem
                        answer="You can temporarily or permanently remove an advert from your dashboard. If the vehicle is sold, you can also mark the advert as sold."
                        question="9. How do I remove an advert?"
                    />
                    <QuestionItem
                        answer="Adverts are removed from public visibility when they expire. You'll receive a notification from us for this. You can renew the advert if needed."
                        question="10. My advert is no longer visible publicly."
                    />
                    <QuestionItem
                        answer="While creating a listing is free, fees may apply to premium features or services, such as marking an advert as a featured advert."
                        question="11. Are there any fees for selling my vehicle on Targabay?"
                    />
                </QuestionSection>
                <QuestionSection title="Security and Support">
                    <QuestionItem
                        answer={
                            <span>
                                Targabay prioritizes the security and privacy of your information. Refer to our{" "}
                                <LinkWithLocale className="link-hover link font-medium" href="/privacy-policy">
                                    Privacy Policy
                                </LinkWithLocale>{" "}
                                for detailed information on how we handle and protect your data.
                            </span>
                        }
                        question="12. Is my personal information safe on Targabay?"
                    />
                    <QuestionItem
                        answer="Targabay employs advanced security measures to detect and prevent fraudulent activity. Report any suspicious behavior to our support team immediately."
                        question="13. What safety measures are in place to prevent fraud on Targabay?"
                    />
                    <QuestionItem
                        answer={
                            <span>
                                For inquiries or assistance, visit our{" "}
                                <LinkWithLocale className="link-hover link font-medium" href="/contact-us">
                                    Contact Us
                                </LinkWithLocale>{" "}
                                page or email{" "}
                                <a className="link-hover link font-medium" href={`mailto:${env.NEXT_PUBLIC_SUPPORT_EMAIL}`}>
                                    {env.NEXT_PUBLIC_SUPPORT_EMAIL}
                                </a>
                                . Our support team is ready to help you.
                            </span>
                        }
                        question="14. How can I get in touch with Targabay support?"
                    />
                    <QuestionItem
                        answer="Listing subscriptions allow users to subscribe to listings matching their interests. Users define notification frequency and receive updates on new listings."
                        question="15. What are listing subscriptions?"
                    />
                    <QuestionItem
                        answer="Log in to Targabay, visit the subscriptions tab in your dashboard, click on the new subscription button, enter your criteria, and create a new subscription."
                        question="16. How do I create subscriptions and be notified of new listings?"
                    />
                    <QuestionItem
                        answer="Update your contact details on the edit advert or update profile pages within your dashboard. Save changes on the update advert page."
                        question="17. How do I update the contact details within the advert I've created?"
                    />
                    <QuestionItem
                        answer="Visit the advert, click the report button, provide reasons, and submit your request. Our team will review and take necessary actions."
                        question="18. How do I report an advert?"
                    />
                    <QuestionItem
                        answer="Our team reviews advert details for integrity and accuracy. Approved listings meet our standards; rejected ones are explained with reasons."
                        question="19. How are adverts verified?"
                    />
                    <QuestionItem
                        answer="Featured adverts are prominently displayed on Targabay's homepage, grabbing users' attention easily."
                        question="20. What are featured adverts?"
                    />
                    <QuestionItem
                        answer="Currently, contact our customer support team, and we will assist you. We are working on improving this user experience."
                        question="21. How do I make one of my advertisements a featured advert?"
                    />
                </QuestionSection>
                <QuestionSection title="Additional Tips and Queries">
                    <QuestionItem
                        answer={
                            <span>
                                Refer to our instructions on the{" "}
                                <LinkWithLocale className="link-hover link font-medium" href="/safety-tips">
                                    Safety Tips
                                </LinkWithLocale>{" "}
                                page for essential guidelines.
                            </span>
                        }
                        question="22. What precautions should I take when using Targabay?"
                    />
                    <QuestionItem
                        answer="Make your ad attractive with clear images and detailed descriptions. Consider promoting your ad or converting it into a featured advert for more visibility."
                        question="23. How can I get more responses to my ad?"
                    />
                    <QuestionItem
                        answer="Ads are rejected if they violate posting rules. Please refer to the rejection email for the specific changes required. Once you've updated the advert as per our request, we will review it again and approve it if it meets our expectations."
                        question="24. Why has my ad been rejected?"
                    />
                    <QuestionItem
                        answer={
                            <span>
                                Use the{" "}
                                <LinkWithLocale className="link-hover link font-medium" href="/contact-us">
                                    Contact Us
                                </LinkWithLocale>{" "}
                                form or email{" "}
                                <a className="link-hover link font-medium" href={`mailto:${env.NEXT_PUBLIC_SUPPORT_EMAIL}`}>
                                    {env.NEXT_PUBLIC_SUPPORT_EMAIL}
                                </a>
                                . Our suppo for inquiries or complaints.
                            </span>
                        }
                        question="25. I have an inquiry or complaint. How should I get in touch with Targabay?"
                    />
                </QuestionSection>
            </div>
        </div>
    );
}
