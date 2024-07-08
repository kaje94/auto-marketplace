"use server";
import { PartialMessage } from "@bufbuild/protobuf";
import { createPromiseClient } from "@connectrpc/connect";
import { createGrpcTransport } from "@connectrpc/connect-node";
import { revalidateTag, unstable_cache } from "next/cache";
import { AdminListingsService } from "targabay-protos/gen/ts/dist/admin_listings.v1_connect";
import { GetAdminListingsRequest } from "targabay-protos/gen/ts/dist/types/admin_listings_pb";
import { GetListingsResponse } from "targabay-protos/gen/ts/dist/types/common_pb";
import { ListingStatusTypes } from "@/utils/enum";
import { apiTags, getGrpcHeaders, grpcOptions, listingItemTags, revalidationTime } from "@/utils/grpc";
import { delay } from "@/utils/helpers";
import { transformListingsImages } from "@/utils/imageUtils";

const client = createPromiseClient(AdminListingsService, createGrpcTransport(grpcOptions));

/** Get all listings created by the all users */
export const getAllListingsAction = async (reqBody: PartialMessage<GetAdminListingsRequest>) => {
    const headers = await getGrpcHeaders();
    const getAllListings = unstable_cache(
        async (reqBody: PartialMessage<GetAdminListingsRequest>, headers: HeadersInit) => {
            const response = await client.getAllListings(reqBody, { headers });
            const responseJson: any = response.toJson();
            return {
                ...responseJson,
                items: transformListingsImages((responseJson as GetListingsResponse).items),
            } as GetListingsResponse;
        },
        [apiTags.getListings()],
        { tags: [apiTags.getListings()], revalidate: revalidationTime.oneHour },
    );
    const response = await getAllListings(reqBody, headers);
    return response;
};

/** Review a listing, approve or reject it */
export const reviewListingAction = async (id: string, status: ListingStatusTypes, adminReview: string, userId: string) => {
    await client.reviewListing({ id, status, adminReview }, { headers: await getGrpcHeaders() });
    listingItemTags(id, userId).forEach((tag) => revalidateTag(tag));
    await delay(5000);
    revalidateTag(apiTags.getMyNotifications(userId));
};
