import { ListingsCarousel } from "@/components/Listings/ListingsCarousel";
import { api } from "@/utils/api";
import { transformListingResponse } from "@/utils/helpers";
import { LocalePathParam } from "@/utils/types";

export default async function Page({ params }: LocalePathParam) {
    const featuredListings = await api.getFeaturedListings(params.locale);

    return (
        <ListingsCarousel
            bgFromColor="from-hero"
            items={featuredListings.map((item) => transformListingResponse(item))}
            viewMore={{
                link: "/search",
                title: "View All",
                subTitle: "View all vehicle advertisements available at Targabay",
            }}
            tinted
        />
    );
}
