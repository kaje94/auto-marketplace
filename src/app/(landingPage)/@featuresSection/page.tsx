import { clsx } from "clsx";
import Image from "next/image";
import { displayFont } from "@/app/fonts";
import { DropletIcon, NotificationIcon, TagIcon, ZapIcon } from "@/icons";

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
        <div className={clsx("flex items-center justify-center text-base-content lg:justify-start", alignRight && "lg:flex-row-reverse")}>
            {icon} <h5 className="mx-2 text-center font-medium lg:text-left">{title}</h5>
        </div>
        <p className={clsx("mt-2 text-center leading-relaxed opacity-70 xl:leading-loose", alignRight ? "lg:text-right" : "lg:text-left")}>
            {description}
        </p>
    </div>
);

export default async function Page() {
    return (
        <section className="bg-white py-12 md:py-20">
            <div className="container mx-auto w-full max-w-7xl">
                <h3 className={clsx(displayFont.className, "mb-6 text-center text-2xl lg:text-4xl")}>Why Choose Us?</h3>
                <div className="grid grid-cols-1 gap-8 p-4 lg:grid-cols-2 xl:p-7 2xl:p-8">
                    <Image
                        alt="feature-1-image"
                        className="hidden w-full rounded-lg bg-[#4f5f67] object-cover lg:block"
                        height={400}
                        src="/images/features-1.jpg"
                        unoptimized
                        width={600}
                    />
                    <div className="flex flex-col justify-center gap-8">
                        <FeatureItem
                            description="Stay effortlessly informed about car advertisements that match your interests. Customize your preferences and receive personalized alerts,
                        ensuring you're always updated on relevant listings."
                            icon={<NotificationIcon />}
                            title="Personalized Advert Alerts"
                        />
                        <FeatureItem
                            description="Rest assured that every vehicle listing on our platform undergoes a thorough verification process, providing you with accurate and reliable information about the condition, history, and specifications of each vehicle."
                            icon={<ZapIcon />}
                            title="Confidence in Every Detail"
                        />
                    </div>
                    <div className="flex flex-col justify-center gap-8">
                        <FeatureItem
                            alignRight
                            description="We believe in keeping things simple and transparent. Our user-friendly interface and intuitive search tools make it easy for you to navigate, compare, and make informed decisions, saving you time and effort in your vehicle buying journey"
                            icon={<DropletIcon />}
                            title="Simplify Your Vehicle Buying Experience"
                        />
                        <FeatureItem
                            alignRight
                            description="We provide our services at no cost to you. You can access our wide selection, verified listings, and user-friendly platform without incurring any fees, making it even more convenient for you to find your dream vehicle."
                            icon={<TagIcon />}
                            title="Enjoy the Benefits Without Any Fees"
                        />
                    </div>
                    <Image
                        alt="feature-1-image"
                        className="hidden w-full rounded-lg bg-[#7c7262] object-cover lg:block"
                        height={400}
                        src="/images/features-2.jpg"
                        unoptimized
                        width={600}
                    />
                </div>
            </div>
        </section>
    );
}
