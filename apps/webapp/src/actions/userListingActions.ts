"use server";
import { PartialMessage } from "@bufbuild/protobuf";
import { createPromiseClient } from "@connectrpc/connect";
import { createGrpcTransport } from "@connectrpc/connect-node";
import { fromPreTrained } from "@lenml/tokenizer-text_embedding_ada002";
import { revalidateTag, unstable_cache } from "next/cache";
import { GetListingsResponse, IdRequest, ListingItem, ListingItem_Data, UserProfile } from "targabay-protos/gen/ts/dist/types/common_pb";
import { GetUserListingsRequest, UpdateListingRequest } from "targabay-protos/gen/ts/dist/types/user_listings_pb";
import { UserListingsService } from "targabay-protos/gen/ts/dist/user_listings.v1_connect";
import { VEHICLE_BRANDS } from "@/utils/brands";
import { ListingStatusTypes, VehicleConditionTypes, VehicleTypes } from "@/utils/enum";
import { apiTags, getGrpcHeaders, grpcOptions, listingItemTags, revalidationTime } from "@/utils/grpc";
import { delay } from "@/utils/helpers";
import { replaceImageUrlWithCdn, transformListingsImages } from "@/utils/imageUtils";

const client = createPromiseClient(UserListingsService, createGrpcTransport(grpcOptions));

const tokenizer = fromPreTrained();

/** Create a new listing advert */
export const createListingAction = async (reqBody: PartialMessage<ListingItem_Data>, userProfile: PartialMessage<UserProfile>) => {
    const embeddings = getTextEmbeddings(reqBody, userProfile);
    const response = await client.createListing({ ...reqBody, embeddings }, { headers: await getGrpcHeaders() });
    listingItemTags(response.id, userProfile.email!).forEach((tag) => revalidateTag(tag));
    return response.id;
};

/** Edit a listing advert */
export const editListingAction = async (
    reqBody: PartialMessage<UpdateListingRequest>,
    createdUserProfile: PartialMessage<UserProfile>,
    email: string,
) => {
    await client.updateListing(
        { ...reqBody, data: { ...reqBody.data, embeddings: getTextEmbeddings(reqBody.data!, createdUserProfile) } },
        { headers: await getGrpcHeaders() },
    );
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
            const responseJson: any = response.toJson();
            return {
                ...responseJson,
                items: transformListingsImages((responseJson as GetListingsResponse).items),
            } as GetListingsResponse;
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

/** Check whether user is eligible to create a new listing */
export const getCanCreateListingAction = async (userEmail: string) => {
    const headers = await getGrpcHeaders();
    const getCanCreateListing = unstable_cache(
        async (headers: HeadersInit) => {
            const response = await client.canCreateListing({}, { headers });
            return response.value;
        },
        [apiTags.getCanCreateListing(userEmail)],
        { tags: [apiTags.getCanCreateListing(userEmail)], revalidate: revalidationTime.oneHour },
    );
    return getCanCreateListing(headers);
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

const getTextEmbeddings = (listingItemData: PartialMessage<ListingItem_Data>, listingUser: PartialMessage<UserProfile>): number[] => {
    const getVehicleTypeEmbed = (type: string) => {
        if (type === VehicleTypes.ThreeWheeler) {
            return "Auto";
        } else if (type === VehicleTypes.Motorcycle) {
            return "Cycle";
        } else if (type === VehicleTypes.SUV) {
            return "Utility";
        } else {
            return type;
        }
    };
    const embeddings: number[] = [
        tokenizer.encode(VEHICLE_BRANDS.findIndex((item) => item === listingItemData?.brand).toString()).shift() ?? 0,
        parseInt(tokenizer.encode(listingItemData?.model?.replaceAll(" ", "") || "model").join()),
        parseInt(tokenizer.encode(listingItemData?.trim?.replaceAll(" ", "") || "trim").join()),
        tokenizer.encode(listingItemData?.yearOfManufacture?.toString()!).shift() ?? 0,
        tokenizer.encode(listingItemData?.condition === VehicleConditionTypes.BrandNew ? "New" : listingItemData?.condition!).shift() ?? 0,
        tokenizer.encode(getVehicleTypeEmbed(listingItemData?.type!)).shift() ?? 0,
        tokenizer.encode(listingItemData?.transmissionType!).shift() ?? 0,
        tokenizer.encode(listingItemData?.fuelType!).shift() ?? 0,
        parseInt(tokenizer.encode(listingUser?.data?.city?.replaceAll(" ", "") || "city").join()),
        parseInt(tokenizer.encode(listingUser?.data?.state?.replaceAll(" ", "") || "state").join()),
        tokenizer.encode(listingUser?.data?.countryCode!).shift() ?? 0,
    ];

    return embeddings;
};
