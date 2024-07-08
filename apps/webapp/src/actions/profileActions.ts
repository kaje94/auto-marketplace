"use server";
import { PartialMessage } from "@bufbuild/protobuf";
import { createPromiseClient } from "@connectrpc/connect";
import { createGrpcTransport } from "@connectrpc/connect-node";
import { revalidateTag, unstable_cache } from "next/cache";
import { redirect } from "next/navigation";
import { UserProfile, UserProfile_ProfileData } from "targabay-protos/gen/ts/dist/types/common_pb";
import { UserProfileService } from "targabay-protos/gen/ts/dist/user_profile.v1_connect";
import { apiTags, getGrpcHeaders, grpcOptions, revalidationTime } from "@/utils/grpc";

const client = createPromiseClient(UserProfileService, createGrpcTransport(grpcOptions));

/** Edit profile details of logged in user */
export const editProfileAction = async (reqBody: PartialMessage<UserProfile_ProfileData>, email: string) => {
    const profileUpdRes = await client.updateUserProfile(reqBody, { headers: await getGrpcHeaders() });
    revalidateTag(apiTags.getMyProfileDetails(email));
    revalidateTag(apiTags.getMyListings(email));
    revalidateTag(apiTags.getListings());
    profileUpdRes.listingIds?.forEach((listingId) => {
        revalidateTag(apiTags.getPostedListingItem(listingId));
        revalidateTag(apiTags.getRelatedListings(listingId));
        revalidateTag(apiTags.getListingsItem(listingId));
    });
};

/** Get profile details of the logged in user */
export const getMyProfileAction = async (email: string) => {
    const headers = await getGrpcHeaders();
    const getCachedUserProfile = unstable_cache(
        async (_email, headers?: HeadersInit) => {
            const response = await client.getUserProfile({}, { headers });
            return response.toJson() as any as UserProfile;
        },
        [apiTags.getMyProfileDetails(email)],
        { tags: [apiTags.getMyProfileDetails(email)], revalidate: revalidationTime.oneDay },
    );
    const profile = await getCachedUserProfile(email, headers);
    return profile as PartialMessage<UserProfile>;
};

/** Close user account of the logged in user */
export const closeUserAccountAction = async (userId: string) => {
    await client.closeAccount({}, { headers: await getGrpcHeaders() });
    revalidateTag(apiTags.getMyProfileDetails(userId));
    redirect("/api/auth/logout");
};
