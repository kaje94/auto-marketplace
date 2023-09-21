import { ListingIdType } from "@/utils/types";
import { ListingsCarousel } from "@/app/_components/ListingsCarousel";
import { api } from "@/utils/api";

export default async function Page({ params }: { params: { id: ListingIdType } }) {
    const featuredListings = await api.getRelatedListings(params.id);
    if (featuredListings.length > 0) {
        return <ListingsCarousel items={featuredListings} />;
    }
    return null;
}
