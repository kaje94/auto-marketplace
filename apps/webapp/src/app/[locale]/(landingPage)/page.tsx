import { Metadata, ResolvingMetadata } from "next/types";
import { GetListingsResponse } from "targabay-protos/gen/ts/dist/types/common_pb";
import { getFeaturedListingsAction } from "@/actions/publicListingActions";
import { ListingsCarousel } from "@/components/Listings/ListingsCarousel";
import { BOT_LOCALE } from "@/utils/constants";
import { COUNTRIES } from "@/utils/countries";
import { LocalePathParam } from "@/utils/types";

export async function generateMetadata({ params }: LocalePathParam, parent: ResolvingMetadata): Promise<Metadata> {
    const previousKeywords = (await parent).keywords || [];
    const previousTwitter = (await parent).twitter || {};
    const previousOpenGraph = (await parent).openGraph || {};

    if (params.locale !== BOT_LOCALE) {
        const country = COUNTRIES[params.locale];
        const title = `Targabay ${country?.[0]} - Your Ultimate Vehicle Marketplace`;
        const description = `Discover a world of automotive excellence tailored for enthusiasts in ${country?.[0]}. Targabay is your premier destination for a seamless journey of buying and selling. Explore a diverse range of vehicles, from sleek cars to thrilling bikes, all on a personalized and secure platform connecting buyers and sellers.`;

        return {
            title,
            description,
            openGraph: { ...previousOpenGraph, title, description },
            twitter: { ...previousTwitter, title, description },
            keywords: [...previousKeywords, country?.[0]!],
        };
    }
    return {};
}

export default async function Page({ params }: LocalePathParam) {
    const featuredListingsRes: Partial<GetListingsResponse> = params.locale === BOT_LOCALE ? {} : await getFeaturedListingsAction(params.locale);

    return (
        <ListingsCarousel
            bgFromColor="from-hero"
            items={featuredListingsRes.items}
            viewMore={{
                link: "/search",
                title: "View All",
                subTitle: "View all vehicle advertisements available at Targabay",
            }}
            tinted
        />
    );
}
