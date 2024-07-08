import { clsx } from "clsx";
import { Metadata, ResolvingMetadata } from "next";
import { displayFont } from "@/app/fonts";
import { getAlternativeLinks } from "@/utils/countries";

export async function generateMetadata(_: unknown, parent: ResolvingMetadata): Promise<Metadata> {
    const previousTwitter = (await parent).twitter || {};
    const previousOpenGraph = (await parent).openGraph || {};

    const title = "Targabay - About Us";
    const description =
        "Learn more about Targabay, the premier online marketplace for automotive enthusiasts. Discover our journey, mission, and commitment to providing a seamless platform for buying and selling cars, bikes, and more. Join us in the passion for all things automotive.";

    return {
        title,
        description,
        openGraph: { ...previousOpenGraph, title, description },
        twitter: { ...previousTwitter, title, description },
        alternates: getAlternativeLinks("/about-us"),
    };
}

export default function Page() {
    return (
        <div className="container relative mx-auto mb-5 px-4 py-8 md:px-4 lg:px-10">
            <h3 className={clsx(displayFont.className, "mb-4 text-3xl lg:text-center lg:text-4xl xl:mb-6")}>About Us</h3>
            <div className="mx-auto flex flex-col gap-1">
                <p>
                    Welcome to Targabay, where automotive dreams come to life. Targabay is not just an online vehicle marketplace; it&apos;s a vibrant
                    community and a gateway to an extraordinary world of cars. Our mission is to redefine your automotive experience by providing a
                    seamless, transparent, and enjoyable platform for buyers and sellers alike.
                </p>
                <h3 className="mt-4 text-xl font-bold">Our Mission</h3>
                <p>
                    At Targabay, we&apos;re on a mission to reshape the automotive marketplace. We strive to simplify the process of buying and
                    selling vehicles, offering a platform that prioritizes user experience, trust, and community engagement. Whether you&apos;re a
                    first-time buyer, a collector, or a seller looking for the perfect match for your vehicle, Targabay is here to facilitate those
                    connections.
                </p>
                <h3 className="mt-4 text-xl font-bold">What Sets Us Apart</h3>
                <h2 className="mt-2 text-lg font-semibold">1. Unparalleled Selection:</h2>
                <p>
                    Immerse yourself in a meticulously curated selection of vehicles that meet our stringent standards for quality and performance.
                    From sleek modern models to timeless classics, Targabay offers a diverse array of options to suit every automotive taste.
                </p>
                <h2 className="mt-2 text-lg font-semibold">2. User-Friendly Experience:</h2>
                <p>
                    Your journey with Targabay is designed to be intuitive and enjoyable. We understand the significance of buying or selling a
                    vehicle, and our user-friendly interface ensures that every step of the process is straightforward, from browsing listings to
                    sealing the deal.
                </p>
                <h2 className="mt-2 text-lg font-semibold">3. Trust and Security:</h2>
                <p>
                    Trust is at the core of Targabay. Our platform prioritizes security, and we go the extra mile to verify listings, providing you
                    with the confidence to buy or sell. Transparency is our commitment, fostering a community where every transaction is conducted
                    with trust and security.
                </p>
                <h2 className="mt-2 text-lg font-semibold">4. Community-Centric Approach:</h2>
                <p>
                    Targabay is more than a marketplace; it&apos;s a dynamic community of automotive enthusiasts. Join discussions, share experiences,
                    and connect with like-minded individuals who share your passion for cars. Our community-centric approach extends beyond
                    transactions, creating a space for shared experiences, advice, and a celebration of all things automotive.
                </p>
                <h3 className="mt-4 text-xl font-bold">Our Team</h3>
                <p>
                    Behind the scenes at Targabay is a dedicated team of professionals who share a deep love for cars. From our tech experts ensuring
                    the platform runs smoothly to our customer service team ready to assist you, each member is committed to making your experience
                    exceptional. We are not just facilitating transactions; we&apos;re building connections and contributing to the stories that
                    unfold in every vehicle transaction.
                </p>
                <h3 className="mt-4 text-xl font-bold">Join Us on the Journey</h3>
                <p>
                    Whether you&apos;re here to find your dream car or to sell a vehicle that has been a part of your journey, we invite you to join
                    us on this exciting adventure. Targabay is not just a marketplace; it&apos;s a destination for automotive enthusiasts looking to
                    connect, explore, and drive their passions forward.
                </p>
                <p className="mt-4">Thank you for choosing Targabay. We look forward to being a part of your automotive story.</p>
            </div>
        </div>
    );
}
