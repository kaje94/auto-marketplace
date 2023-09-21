import { ListingIdType } from "@/utils/types";
import { ListingsCarousel } from "@/app/_components/ListingsCarousel";
import { api } from "@/utils/api";

export default async function Page({ params }: { params: { id: ListingIdType } }) {
    const featuredListings = await api.getFeaturedListings();
    return <ListingsCarousel items={featuredListings} emptyPlaceholderText="No featured adverts available to display" bgFromColor="from-base-200" />;
}
