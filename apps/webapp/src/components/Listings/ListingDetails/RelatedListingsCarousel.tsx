import queryString from "query-string";
import { FC, Suspense } from "react";
import { ListingItem } from "targabay-protos/gen/ts/dist/types/common_pb";
import { getRelatedListingsAction } from "@/actions/publicListingActions";
import { getListingTitleFromListing } from "@/utils/helpers";
import { ListingsCarousel } from "../ListingsCarousel";

export const RelatedListingsCarousel: FC<{ itemDetails: ListingItem }> = ({ itemDetails }) => {
    return (
        <Suspense fallback={<ListingsCarousel loading />}>
            <RelatedListingsCarouselWithData itemDetails={itemDetails} />
        </Suspense>
    );
};

const RelatedListingsCarouselWithData: FC<{ itemDetails: ListingItem }> = async ({ itemDetails }) => {
    const relatedListingsRes = await getRelatedListingsAction(
        itemDetails.id,
        itemDetails.user?.data?.countryCode!,
        itemDetails.data?.embeddings ?? [],
    );
    const listingTitle = getListingTitleFromListing(itemDetails.data!);

    return (
        <ListingsCarousel
            items={relatedListingsRes.items}
            viewMore={{
                title: "View More",
                subTitle: listingTitle ? `View advertisements that are similar to ${listingTitle}` : "View similar advertisements",
                link: queryString.stringifyUrl({
                    url: "/search",
                    query: { VehicleType: itemDetails.data?.type, Brand: itemDetails.data?.brand, Model: itemDetails.data?.model },
                }),
            }}
        />
    );
};
