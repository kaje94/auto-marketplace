import { ListingsCarousel } from "@/components/Listings/ListingsCarousel";
import { api } from "@/utils/api";
import { BOT_LOCALE } from "@/utils/constants";
import { ListingItem, LocalePathParam } from "@/utils/types";

export default async function Page({ params }: LocalePathParam) {
    const featuredListings: ListingItem[] = params.locale === BOT_LOCALE ? [] : await api.getFeaturedListings(params.locale);

    return (
        <ListingsCarousel
            bgFromColor="from-hero"
            items={featuredListings}
            viewMore={{
                link: "/search",
                title: "View All",
                subTitle: "View all vehicle advertisements available at Targabay",
            }}
            tinted
        />
    );
}
