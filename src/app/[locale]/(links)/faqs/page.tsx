import { clsx } from "clsx";
import { Metadata, ResolvingMetadata } from "next";
import { ReactNode } from "react";
import { displayFont } from "@/app/fonts";
import { LinkWithLocale } from "@/components/Common";
import { env } from "@/env.mjs";
import { getScopedI18n } from "@/locales/server";

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
    const [previousTwitter, previousOpenGraph, tFaqsPage] = await Promise.all([
        (await parent).twitter || {},
        (await parent).openGraph || {},
        getScopedI18n("metadata.faqsRoute"),
    ]);

    const title = tFaqsPage("title");
    const description = tFaqsPage("desc");

    return {
        title,
        description,
        openGraph: { ...previousOpenGraph, title, description },
        twitter: { ...previousTwitter, title, description },
    };
}

export default async function Page() {
    const [tNav, tFaqsPage] = await Promise.all([getScopedI18n("nav"), getScopedI18n("appRouter.faqsRoute")]);

    return (
        <div className="container relative mx-auto mb-5 px-4 py-8 md:px-4 lg:px-10">
            <h3 className={clsx(displayFont.className, "mb-4 text-3xl lg:text-center lg:text-4xl xl:mb-6")}>{tFaqsPage("title")}</h3>
            <div className="mx-auto flex flex-col gap-3">
                <QuestionSection title={tFaqsPage("section1.title")}>
                    <QuestionItem answer={tFaqsPage("section1.question1.answer")} question={tFaqsPage("section1.question1.question")} />
                    <QuestionItem answer={tFaqsPage("section1.question2.answer")} question={tFaqsPage("section1.question2.question")} />
                    <QuestionItem answer={tFaqsPage("section1.question3.answer")} question={tFaqsPage("section1.question3.question")} />
                </QuestionSection>
                <QuestionSection title={tFaqsPage("section2.title")}>
                    <QuestionItem answer={tFaqsPage("section2.question1.answer")} question={tFaqsPage("section2.question1.question")} />
                    <QuestionItem answer={tFaqsPage("section2.question2.answer")} question={tFaqsPage("section2.question2.question")} />
                    <QuestionItem answer={tFaqsPage("section2.question3.answer")} question={tFaqsPage("section2.question3.question")} />
                    <QuestionItem answer={tFaqsPage("section2.question4.answer")} question={tFaqsPage("section2.question4.question")} />
                    <QuestionItem answer={tFaqsPage("section2.question5.answer")} question={tFaqsPage("section2.question5.question")} />
                    <QuestionItem answer={tFaqsPage("section2.question6.answer")} question={tFaqsPage("section2.question6.question")} />
                    <QuestionItem answer={tFaqsPage("section2.question7.answer")} question={tFaqsPage("section2.question7.question")} />
                    <QuestionItem answer={tFaqsPage("section2.question8.answer")} question={tFaqsPage("section2.question8.question")} />
                </QuestionSection>
                <QuestionSection title={tFaqsPage("section3.title")}>
                    <QuestionItem
                        answer={tFaqsPage("section3.question1.answer", {
                            privacyPolicy: (
                                <LinkWithLocale className="link-hover link font-medium" href="/privacy-policy">
                                    {tNav("links.legal.privacyPolicy")}
                                </LinkWithLocale>
                            ),
                        })}
                        question={tFaqsPage("section3.question1.question")}
                    />
                    <QuestionItem answer={tFaqsPage("section3.question2.answer")} question={tFaqsPage("section3.question2.question")} />
                    <QuestionItem
                        answer={tFaqsPage("section3.question3.answer", {
                            email: (
                                <a className="link-hover link font-medium" href={`mailto:${env.NEXT_PUBLIC_SUPPORT_EMAIL}`}>
                                    {env.NEXT_PUBLIC_SUPPORT_EMAIL}
                                </a>
                            ),
                            contactUs: (
                                <LinkWithLocale className="link-hover link font-medium" href="/contact-us">
                                    {tNav("links.support.contactUs")}
                                </LinkWithLocale>
                            ),
                        })}
                        question={tFaqsPage("section3.question3.question")}
                    />
                    <QuestionItem answer={tFaqsPage("section3.question4.answer")} question={tFaqsPage("section3.question4.question")} />
                    <QuestionItem answer={tFaqsPage("section3.question5.answer")} question={tFaqsPage("section3.question5.question")} />
                    <QuestionItem answer={tFaqsPage("section3.question6.answer")} question={tFaqsPage("section3.question6.question")} />
                    <QuestionItem answer={tFaqsPage("section3.question7.answer")} question={tFaqsPage("section3.question7.question")} />
                    <QuestionItem answer={tFaqsPage("section3.question8.answer")} question={tFaqsPage("section3.question8.question")} />
                    <QuestionItem answer={tFaqsPage("section3.question9.answer")} question={tFaqsPage("section3.question9.question")} />
                    <QuestionItem answer={tFaqsPage("section3.question10.answer")} question={tFaqsPage("section3.question10.question")} />
                </QuestionSection>
                <QuestionSection title={tFaqsPage("section4.title")}>
                    <QuestionItem
                        answer={tFaqsPage("section4.question1.answer", {
                            safetyTips: (
                                <LinkWithLocale className="link-hover link font-medium" href="/safety-tips">
                                    {tNav("links.support.safetyTips")}
                                </LinkWithLocale>
                            ),
                        })}
                        question={tFaqsPage("section4.question1.question")}
                    />
                    <QuestionItem answer={tFaqsPage("section4.question2.answer")} question={tFaqsPage("section4.question2.question")} />
                    <QuestionItem answer={tFaqsPage("section4.question3.answer")} question={tFaqsPage("section4.question3.question")} />
                    <QuestionItem
                        answer={tFaqsPage("section4.question4.answer", {
                            contactUs: (
                                <LinkWithLocale className="link-hover link font-medium" href="/contact-us">
                                    {tNav("links.support.contactUs")}
                                </LinkWithLocale>
                            ),
                            email: (
                                <a className="link-hover link font-medium" href={`mailto:${env.NEXT_PUBLIC_SUPPORT_EMAIL}`}>
                                    {env.NEXT_PUBLIC_SUPPORT_EMAIL}
                                </a>
                            ),
                        })}
                        question={tFaqsPage("section4.question4.question")}
                    />
                </QuestionSection>
            </div>
        </div>
    );
}
