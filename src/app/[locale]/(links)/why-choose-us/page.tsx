import { clsx } from "clsx";
import { Metadata, ResolvingMetadata } from "next";
import Image from "next/image";
import { displayFont } from "@/app/fonts";
import { DropletIcon, FilterIcon, NotificationIcon, TagIcon, UserIcon, ZapIcon } from "@/icons";
import { getScopedI18n } from "@/locales/server";

const FeatureItem = ({
    title,
    description,
    alignRight,
    icon,
}: {
    alignRight?: boolean;
    description: string;
    icon: React.ReactElement;
    title: string;
}) => (
    <div>
        <div className={clsx("flex items-center justify-start text-base-content", alignRight && "lg:flex-row-reverse")}>
            {icon} <h5 className="mx-2  font-medium lg:text-left">{title}</h5>
        </div>
        <p className={clsx("mt-2 text-left leading-relaxed opacity-70 xl:leading-loose", alignRight ? "lg:text-right" : "lg:text-left")}>
            {description}
        </p>
    </div>
);

export async function generateMetadata(_: unknown, parent: ResolvingMetadata): Promise<Metadata> {
    const previousTwitter = (await parent).twitter || {};
    const previousOpenGraph = (await parent).openGraph || {};

    const title = "Targabay - Why Choose Us";
    const description =
        "Discover why Targabay stands out as your premier choice in the world of online automotive marketplaces. Explore our commitment to a seamless buying and selling experience for cars, bikes, and more. From a diverse vehicle selection to secure transactions, find out what sets Targabay apart and makes us the preferred destination for automotive enthusiasts.";

    return {
        title,
        description,
        openGraph: { ...previousOpenGraph, title, description },
        twitter: { ...previousTwitter, title, description },
    };
}
export default async function Page() {
    const tWhyChooseUsPages = await getScopedI18n("whyChooseUsPage");
    const tNav = await getScopedI18n("nav");

    return (
        <div className="container relative mx-auto mb-5 px-4 py-8 md:px-4 lg:px-10">
            <h3 className={clsx(displayFont.className, "mb-4 text-3xl lg:text-center lg:text-4xl xl:mb-6")}>{tNav("links.company.whyChooseUs")}</h3>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 ">
                <Image
                    alt="feature-1-image"
                    className="hidden w-full rounded-lg bg-[#4f5f67] object-cover lg:block"
                    height={400}
                    src="/images/site/features-1.webp"
                    width={600}
                    unoptimized
                />
                <div className="flex flex-col justify-center gap-8">
                    <FeatureItem description={tWhyChooseUsPages("section1.content")} icon={<ZapIcon />} title={tWhyChooseUsPages("section1.title")} />
                    <FeatureItem
                        description={tWhyChooseUsPages("section2.content")}
                        icon={<DropletIcon />}
                        title={tWhyChooseUsPages("section2.title")}
                    />
                </div>
                <div className="flex flex-col justify-center gap-8">
                    <FeatureItem
                        description={tWhyChooseUsPages("section3.content")}
                        icon={<TagIcon />}
                        title={tWhyChooseUsPages("section3.title")}
                        alignRight
                    />
                    <FeatureItem
                        description={tWhyChooseUsPages("section4.content")}
                        icon={<UserIcon />}
                        title={tWhyChooseUsPages("section4.title")}
                        alignRight
                    />
                </div>
                <Image
                    alt="feature-1-image"
                    className="hidden w-full rounded-lg bg-[#7c7262] object-cover lg:block"
                    height={400}
                    src="/images/site/features-2.webp"
                    width={600}
                    unoptimized
                />
                <Image
                    alt="feature-1-image"
                    className="hidden w-full rounded-lg bg-[#8e999f] object-cover lg:block"
                    height={400}
                    src="/images/site/features-3.webp"
                    width={600}
                    unoptimized
                />
                <div className="flex flex-col justify-center gap-8">
                    <FeatureItem
                        description={tWhyChooseUsPages("section5.content")}
                        icon={<FilterIcon />}
                        title={tWhyChooseUsPages("section5.title")}
                    />
                    <FeatureItem
                        description={tWhyChooseUsPages("section6.content")}
                        icon={<NotificationIcon />}
                        title={tWhyChooseUsPages("section6.title")}
                    />
                </div>
            </div>
        </div>
    );
}
