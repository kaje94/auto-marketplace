import { ListingIdType } from "@/utils/types";
import { ListingsCarousel } from "@/app/_components/ListingsCarousel";
import { api } from "@/utils/api";

export default async function Page({ params }: { params: { id: ListingIdType } }) {
    const relatedListings = await api.getRelatedListings(params.id);
    return (
        <ListingsCarousel
            items={relatedListings}
            emptyPlaceholderText="No related adverts available to display"
            emptyPlaceholderSubText="Try checking out a different advert"
        />
    );
}
