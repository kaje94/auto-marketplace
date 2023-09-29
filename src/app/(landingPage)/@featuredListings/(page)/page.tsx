import { ListingIdType } from "@/utils/types";
import { ListingsCarousel } from "@/components/ListingsCarousel";
import { api } from "@/utils/api";

export default async function Page() {
    const featuredListings = await api.getFeaturedListings();
    return (
        <ListingsCarousel
            items={featuredListings}
            emptyPlaceholderText="No featured adverts available to display"
            emptyPlaceholderSubText="Try checking out later"
            bgFromColor="from-base-200"
        />
    );
}
