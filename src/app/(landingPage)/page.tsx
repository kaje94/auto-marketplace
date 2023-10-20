import { ListingsCarousel } from "@/components/ListingsCarousel";
import { api } from "@/utils/api";
import { transformListingResponse } from "@/utils/helpers";

export default async function Page() {
    const featuredListings = await api.getFeaturedListings();

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
