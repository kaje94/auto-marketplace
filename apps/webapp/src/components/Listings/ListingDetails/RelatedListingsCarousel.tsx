import queryString from "query-string";
import { FC, Suspense } from "react";
import { api } from "@/utils/api";
import { ListingItem } from "@/utils/types";
import { ListingsCarousel } from "../ListingsCarousel";

export const RelatedListingsCarousel: FC<{ itemDetails: ListingItem }> = ({ itemDetails }) => {
    return (
        <Suspense fallback={<ListingsCarousel loading />}>
            <RelatedListingsCarouselWithData itemDetails={itemDetails} />
        </Suspense>
    );
};

const RelatedListingsCarouselWithData: FC<{ itemDetails: ListingItem }> = async ({ itemDetails }) => {
    const relatedListings = await api.getRelatedListings(itemDetails.id);
    return (
        <ListingsCarousel
            items={relatedListings}
            viewMore={{
                title: "View More",
                subTitle: `View advertisements that are similar to ${itemDetails.title}`,
                link: queryString.stringifyUrl({
                    url: "/search",
                    query: { VehicleType: itemDetails.vehicle.type, Brand: itemDetails.vehicle.brand, Model: itemDetails.vehicle.model },
                }),
            }}
        />
    );
};
