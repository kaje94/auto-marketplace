import { clsx } from "clsx";
import { Metadata, ResolvingMetadata } from "next";
import { ReactNode } from "react";
import { displayFont } from "@/app/fonts";
import { getAlternativeLinks } from "@/utils/countries";

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
        alternates: getAlternativeLinks("/safety-tips"),
    };
}

export default function Page() {
    return (
        <div className="container relative mx-auto mb-5 px-4 py-8 md:px-4 lg:px-10">
            <h3 className={clsx(displayFont.className, "mb-4 text-3xl lg:text-center lg:text-4xl xl:mb-6")}>Safety Tips</h3>
            <p>
                At Targabay, your safety is our priority. We are committed to providing a secure online marketplace. Please follow these safety tips
                for a worry-free experience.
            </p>
            <div className="mx-auto flex flex-col gap-3">
                <SafetyTipSection title="General Safety Tips:">
                    <SafetyTipItem
                        tips={[
                            "Arrange to meet in public places, such as shopping centers or police stations, especially during daylight hours.",
                            "Opt for well-lit areas with surveillance cameras for added security.",
                        ]}
                        title="Meet in Safe Locations:"
                    />
                    <SafetyTipItem
                        tips={["Whenever possible, bring a friend or family member with you when meeting a buyer or seller."]}
                        title="Bring a Friend:"
                    />
                    <SafetyTipItem
                        tips={[
                            "Before meeting, verify the identity of the other party by reaching them out via email or contact number",
                            "Share contact information responsibly, and ensure it aligns with the details provided on Targabay.",
                        ]}
                        title="Verify Identity:"
                    />
                </SafetyTipSection>
                <SafetyTipSection title="Tips for Buyers:">
                    <SafetyTipItem
                        tips={[
                            "Thoroughly research the vehicle by checking its specifications, reviews, and market value.",
                            "Access and review the vehicle history report to make an informed decision.",
                        ]}
                        title="Research the Vehicle:"
                    />
                    <SafetyTipItem
                        tips={[
                            "Schedule a meeting to inspect the vehicle in person before finalizing the transaction.",
                            "Utilize our detailed inspection checklist to ensure all aspects are thoroughly examined.",
                        ]}
                        title="Inspect the Vehicle in Person:"
                    />
                    <SafetyTipItem
                        tips={[
                            "If you come across any listings that raise suspicion of potential scams, please promptly report them to us. Your vigilance is crucial in maintaining a secure environment on Targabay. We are committed to investigating and taking the necessary actions to ensure the safety and integrity of our marketplace.",
                        ]}
                        title="Report Suspicious Activity:"
                    />
                </SafetyTipSection>
                <SafetyTipSection title="Tips for Sellers:">
                    <SafetyTipItem
                        tips={[
                            "Build trust with potential buyers by providing accurate and detailed information about the vehicle.",
                            "Upload clear and high-quality images to showcase the condition of the vehicle accurately.",
                        ]}
                        title="Provide Accurate Information:"
                    />
                    <SafetyTipItem
                        tips={[
                            "Clearly outline the terms and conditions of the sale in your listing.",
                            "Take your time when negotiating and avoid making impulsive decisions that may impact the transaction.",
                        ]}
                        title="Set Clear Terms:"
                    />
                    <SafetyTipItem
                        tips={[
                            "For the safety of sellers, it is strongly advised to utilize secure payment methods to prevent potential scams.",
                            "Sellers should exercise caution and refrain from sharing sensitive financial information without thorough verification to ensure a secure and trustworthy transaction process",
                        ]}
                        title="Use Secure Payment Methods:"
                    />
                </SafetyTipSection>
                <SafetyTipSection title="Safety measures provided by Targabay">
                    <SafetyTipItem
                        tips={["We make constant improvements to our technology to detect and prevent suspicious or inappropriate activity."]}
                        title="Continuous improvements"
                    />
                </SafetyTipSection>
                <SafetyTipSection title="Reporting a safety issue">
                    <SafetyTipItem
                        tips={[
                            "If you feel that you have been the victim of a scam, please report your situation to us immediately.",
                            "If you have been cheated, we also recommend that you contact your local police department.",
                        ]}
                        title="Victim of a scam?"
                    />
                    <SafetyTipItem
                        tips={[
                            "Targabay is committed to the privacy of our users and does not share user information publicly. However, we take safety seriously and will cooperate with law enforcement if we receive requests regarding fraudulent or other criminal activity.",
                        ]}
                        title="Information sharing"
                    />
                </SafetyTipSection>
            </div>
        </div>
    );
}
