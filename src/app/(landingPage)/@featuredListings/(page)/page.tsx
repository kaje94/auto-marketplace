import { ListingsCarousel } from "@/components/ListingsCarousel";
import { api } from "@/utils/api";

export default async function Page() {
    const featuredListings = await api.getFeaturedListings();
    return (
        <ListingsCarousel
            bgFromColor="from-base-200"
            emptyPlaceholderSubText="Try checking out later"
            emptyPlaceholderText="No featured adverts available to display"
            items={featuredListings}
        />
    );
}
