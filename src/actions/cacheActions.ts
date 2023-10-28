"use server";
import { revalidateTag } from "next/cache";
import { apiTags } from "@/utils/api";
import { ListingIdType } from "@/utils/types";

export const revalidateFeaturesAction = async () => {
    revalidateTag(apiTags.getFeaturesList());
};

export const revalidateBrandsAction = async () => {
    revalidateTag(apiTags.getVehicleBrands());
};

export const revalidatePosedListingsAction = async () => {
    revalidateTag(apiTags.getPostedListings());
};

export const revalidateFeaturedListingsAction = async () => {
    revalidateTag(apiTags.getFeaturedListings());
};

export const revalidateRelatedListingsAction = async (listingId: ListingIdType) => {
    revalidateTag(apiTags.getRelatedListings(listingId));
};

export const revalidateUserNotificationsAction = async (userId: string) => {
    revalidateTag(apiTags.getMyNotifications(userId));
};

// todo:revalidate profile get, location details
