"use server";
import { PartialMessage } from "@bufbuild/protobuf";
import { createPromiseClient } from "@connectrpc/connect";
import { createGrpcTransport } from "@connectrpc/connect-node";
import { revalidateTag, unstable_cache } from "next/cache";
import { PublicListingsService } from "targabay-protos/gen/ts/dist/public_listings.v1_connect";
import { GetListingsResponse, IdRequest, ListingItem, ListingItem_Data } from "targabay-protos/gen/ts/dist/types/common_pb";
import { GetPublicListingsRequest } from "targabay-protos/gen/ts/dist/types/public_listings_pb";
import { UpdateListingRequest } from "targabay-protos/gen/ts/dist/types/user_listings_pb";
import { apiTags, listingItemTags, revalidationTime } from "@/utils/api";
import { ListingReportReason } from "@/utils/enum";
import { getGrpcHeaders, grpcOptions } from "@/utils/grpc";
import { ListingIdType } from "@/utils/types";

const client = createPromiseClient(PublicListingsService, createGrpcTransport(grpcOptions));

// const getCachedUser = unstable_cache(
//     async (id) => getUser(id),
//     ['my-app-user']
//   );

/** Increment the views count of a listing. */
export const incrementViewsAction = async (listingId: ListingIdType) => {
    await client.incrementListingViews({ id: listingId });
};

/** Get details of a listing item by author who created it */
export const getRelatedListingsAction = async (id: string) => {
    const getRelatedListings = unstable_cache(
        async (id: string) => {
            const response = await client.getRelatedListings({ id });
            return response.toJson() as any as GetListingsResponse;
        },
        [apiTags.getRelatedListings(id)],
        // getUserListingCacheKey(reqBody, userEmail), // todo: remove if not needed
        { tags: [apiTags.getRelatedListings(id)], revalidate: revalidationTime.threeHours },
    );
    return getRelatedListings(id);
};

/** Get featured listings within a country */
export const getFeaturedListingsAction = async (countryCode: string) => {
    const getFeaturedListings = unstable_cache(
        async (countryCode: string) => {
            const response = await client.getFeaturedListings({ countryCode });
            return response.toJson() as any as GetListingsResponse;
        },
        [apiTags.getFeatureListingsByCountry(countryCode)],
        // getUserListingCacheKey(reqBody, userEmail), // todo: remove if not needed
        { tags: [apiTags.getFeaturedListings(), apiTags.getFeatureListingsByCountry(countryCode)], revalidate: revalidationTime.twelveHours },
    );
    return getFeaturedListings(countryCode);
};

/** Get details of a publicly posted listing items */
export const getPublicListingItemAction = async (id: string) => {
    const getPublicListingItem = unstable_cache(
        async (id: string) => {
            const response = await client.getPublicListingItem({ id });
            return response.toJson() as any as ListingItem;
        },
        [apiTags.getPostedListingItem(id)],
        // getUserListingCacheKey(reqBody, userEmail), // todo: remove if not needed
        { tags: [apiTags.getPostedListingItem(id)], revalidate: revalidationTime.oneDay },
    );
    return getPublicListingItem(id);
};

/** Get posted publicly visible listings */
export const getPublicListingsAction = async (reqBody: PartialMessage<GetPublicListingsRequest>) => {
    const getPublicListings = unstable_cache(
        async (reqBody: PartialMessage<GetPublicListingsRequest>) => {
            const response = await client.getPublicListings(reqBody);
            return response.toJson() as any as GetListingsResponse;
        },
        [apiTags.getPostedListings()],
        // getUserListingCacheKey(reqBody, userEmail), // todo: remove if not needed
        {
            tags: [apiTags.getPostedListings(), apiTags.getPostedListingsByCountry(reqBody.filters?.publicFilters?.countryCode!)],
            revalidate: revalidationTime.oneDay,
        },
    );
    const response = await getPublicListings(reqBody);
    return response;
};

/** Report a listing */
export const reportListingAction = async (email: string, listingId: string, message: string, reason: ListingReportReason) => {
    await client.reportListing({ email, listingId, message, reason });
};
