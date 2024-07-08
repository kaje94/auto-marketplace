import { clsx } from "clsx";
import { Metadata, ResolvingMetadata } from "next";
import Image from "next/image";
import { displayFont } from "@/app/fonts";
import { DropletIcon, FilterIcon, NotificationIcon, TagIcon, UserIcon, ZapIcon } from "@/icons";
import { getAlternativeLinks } from "@/utils/countries";

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
        alternates: getAlternativeLinks("/why-choose-us"),
    };
}
export default function Page() {
    return (
        <div className="container relative mx-auto mb-5 px-4 py-8 md:px-4 lg:px-10">
            <h3 className={clsx(displayFont.className, "mb-4 text-3xl lg:text-center lg:text-4xl xl:mb-6")}>Why Choose Us</h3>
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
                    <FeatureItem
                        description="Rest assured that every vehicle listing on our platform undergoes a thorough verification process, providing you with accurate and reliable information about the condition, history, and specifications of each vehicle."
                        icon={<ZapIcon />}
                        title="Confidence in Every Detail"
                    />
                    <FeatureItem
                        description="We believe in keeping things simple and transparent. Our user-friendly interface and intuitive search tools make it easy for you to navigate, compare, and make informed decisions, saving you time and effort in your vehicle buying journey"
                        icon={<DropletIcon />}
                        title="Simplify Your Vehicle Buying Experience"
                    />
                </div>
                <div className="flex flex-col justify-center gap-8">
                    <FeatureItem
                        description="We provide our services at no cost to you. You can access our wide selection, verified listings, and user-friendly platform without incurring any fees, making it even more convenient for you to find your dream vehicle."
                        icon={<TagIcon />}
                        title="Enjoy the Benefits Without Any Fees"
                        alignRight
                    />
                    <FeatureItem
                        description="Our dedicated customer support team is here for you at every step of your buying or selling journey. Whether you have questions, need assistance, or encounter any issues, count on us for timely and helpful support to ensure a smooth and confident experience"
                        icon={<UserIcon />}
                        title="Responsive Customer Support"
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
                        description="Refine your search effortlessly using our extensive range of filters. From specific brands and models to preferred price ranges and mileage limits, our comprehensive search options empower you to discover the perfect vehicle that aligns precisely with your preferences."
                        icon={<FilterIcon />}
                        title="Comprehensive Search Filters"
                    />
                    <FeatureItem
                        description="Stay effortlessly informed about car advertisements that match your interests. Customize your preferences and receive personalized alerts, ensuring you're always updated on relevant listings."
                        icon={<NotificationIcon />}
                        title="Personalized Advert Alerts"
                    />
                </div>
            </div>
        </div>
    );
}
