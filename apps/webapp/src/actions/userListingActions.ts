"use server";
import { PartialMessage } from "@bufbuild/protobuf";
import { createPromiseClient } from "@connectrpc/connect";
import { createGrpcTransport } from "@connectrpc/connect-node";
import { revalidateTag, unstable_cache } from "next/cache";
import { GetListingsResponse, IdRequest, ListingItem, ListingItem_Data } from "targabay-protos/gen/ts/dist/types/common_pb";
import { GetUserListingsRequest, UpdateListingRequest } from "targabay-protos/gen/ts/dist/types/user_listings_pb";
import { UserListingsService } from "targabay-protos/gen/ts/dist/user_listings.v1_connect";
import { apiTags, listingItemTags, revalidationTime } from "@/utils/api";
import { ListingStatusTypes } from "@/utils/enum";
import { getGrpcHeaders, grpcOptions } from "@/utils/grpc";
import { delay } from "@/utils/helpers";
import { replaceImageUrlWithCdn, transformListingsImages } from "@/utils/imageUtils";

const client = createPromiseClient(UserListingsService, createGrpcTransport(grpcOptions));

/** Create a new listing advert */
export const createListingAction = async (reqBody: PartialMessage<ListingItem_Data>, email: string) => {
    const response = await client.createListing(reqBody, { headers: await getGrpcHeaders() });
    listingItemTags(response.id, email).forEach((tag) => revalidateTag(tag));
    return response.id;
};

/** Edit a listing advert */
export const editListingAction = async (reqBody: PartialMessage<UpdateListingRequest>, email: string) => {
    await client.updateListing(reqBody, { headers: await getGrpcHeaders() });
    listingItemTags(reqBody.id!, email).forEach((tag) => revalidateTag(tag));
};

/** Permanently delete a listing as an admin */
export const deleteListingAction = async (reqBody: PartialMessage<IdRequest>, email: string) => {
    await client.deleteListing(reqBody, { headers: await getGrpcHeaders() });
    await delay(5000);
    listingItemTags(reqBody.id!, email).forEach((tag) => revalidateTag(tag));
};

/** Get all listings created by the user */
export const getUserListingsAction = async (reqBody: PartialMessage<GetUserListingsRequest>, userEmail: string) => {
    const headers = await getGrpcHeaders();
    const getUserListings = unstable_cache(
        async (reqBody: PartialMessage<GetUserListingsRequest>, headers: HeadersInit) => {
            const response = await client.getUserListings(reqBody, { headers });
            return { ...response, items: transformListingsImages((response.toJson() as any as GetListingsResponse).items) };
        },
        [apiTags.getMyListings(userEmail)],
        { tags: [apiTags.getMyListings(userEmail)], revalidate: revalidationTime.oneHour },
    );
    return getUserListings(reqBody, headers);
};

/** Get details of a listing item by author who created it */
export const getUserListingsItemAction = async (id: string) => {
    const headers = await getGrpcHeaders();
    const getUserListingItem = unstable_cache(
        async (id: string, headers: HeadersInit) => {
            const response = await client.getUserListingItem({ id }, { headers });
            return replaceImageUrlWithCdn(response.toJson() as any as ListingItem);
        },
        [apiTags.getListingsItem(id)],
        { tags: [apiTags.getListingsItem(id)], revalidate: revalidationTime.oneHour },
    );
    const response = await getUserListingItem(id, headers);
    return response;
};

/** Renew an expired advert or an advert that is about to be expired */
export const renewListingAction = async (listingId: string, email: string) => {
    await client.renewListing({ id: listingId }, { headers: await getGrpcHeaders() });
    listingItemTags(listingId, email).forEach((tag) => revalidateTag(tag));
};

/**Un-list a listing and hide it from public view*/
export const unListListingAction = async (listingId: string, status: ListingStatusTypes, userId: string) => {
    await client.unListListing({ id: listingId, status }, { headers: await getGrpcHeaders() });
    listingItemTags(listingId, userId).forEach((tag) => revalidateTag(tag));
};
