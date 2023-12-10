import queryString from "query-string";
import { FC, Suspense } from "react";
import { getScopedI18n } from "@/locales/server";
import { api } from "@/utils/api";
import { transformListingResponse } from "@/utils/helpers";
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
    const tListingDetails = await getScopedI18n("components.listingDetails");
    return (
        <ListingsCarousel
            items={relatedListings?.map((item) => transformListingResponse(item))}
            viewMore={{
                title: tListingDetails("viewMore"),
                subTitle: tListingDetails("viewMoreSimilarTo", { title: itemDetails.title }),
                link: queryString.stringifyUrl({
                    url: "/search",
                    query: { VehicleType: itemDetails.vehicle.type, Brand: itemDetails.vehicle.brand, Model: itemDetails.vehicle.model },
                }),
            }}
        />
    );
};
