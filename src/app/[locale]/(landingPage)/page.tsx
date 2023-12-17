import { Metadata, ResolvingMetadata } from "next";
import { ListingsCarousel } from "@/components/ListingsCarousel";
import { api } from "@/utils/api";
import { COUNTRIES } from "@/utils/countries";
import { transformListingResponse } from "@/utils/helpers";
import { LocalePathParam } from "@/utils/types";

export async function generateMetadata({ params }: LocalePathParam, parent: ResolvingMetadata): Promise<Metadata> {
    const previousKeywords = (await parent).keywords || [];
    const previousTwitter = (await parent).twitter || {};
    const previousOpenGraph = (await parent).openGraph || {};

    const country = COUNTRIES[params.locale];
    const title = `Targabay ${country?.[0]} - Your Ultimate Vehicle Marketplace`;
    const description = `Discover a world of automotive excellence tailored for enthusiasts in [Country]. Targabay is your premier destination for a seamless journey of buying and selling. Explore a diverse range of vehicles, from sleek cars to thrilling bikes, all on a personalized and secure platform connecting buyers and sellers. Your ultimate automotive adventure begins here, in ${country?.[0]}`;

    return {
        title,
        description,
        openGraph: { ...previousOpenGraph, title, description },
        twitter: { ...previousTwitter, title, description },
        keywords: [...previousKeywords, country?.[0]!],
    };
}

export default async function Page({ params }: LocalePathParam) {
    const featuredListings = await api.getFeaturedListings(params.locale);

    return (
        <ListingsCarousel
            bgFromColor="from-hero"
            items={featuredListings.map((item) => transformListingResponse(item))}
            tinted
            viewMore={{
                link: "/search",
                title: "View All",
                subTitle: "View all vehicle advertisements available at Targabay",
            }}
        />
    );
}
