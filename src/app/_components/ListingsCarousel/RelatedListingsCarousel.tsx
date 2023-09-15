import { Suspense } from "react";
import { api } from "@/utils/api";
import { ListingsCarousel } from "./ListingsCarousel";
import { ListingIdType } from "@/utils/types";

export const RelatedListingsCarousel = ({ id }: { id: ListingIdType }) => {
    return (
        <Suspense fallback={<ListingsCarousel loading title="Related Adverts" />}>
            <FeaturedListingsCarousel id={id} />
        </Suspense>
    );
};

const FeaturedListingsCarousel = async ({ id }: { id: ListingIdType }) => {
    const featuredListings = await api.getRelatedListings(id);

    if (featuredListings.length > 0) {
        return <ListingsCarousel items={featuredListings} title="Related Adverts" />;
    }
    return null;
};
