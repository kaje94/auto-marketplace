"use server";
import { revalidateTag } from "next/cache";
import { apiTags } from "@/utils/grpc";
import { ListingIdType } from "@/utils/types";

/** Revalidate all the posted listing results. */
export const revalidateAllPosedListingsAction = async () => {
    revalidateTag(apiTags.getPostedListings());
};

/** Revalidate posted listings for a particular country. */
export const revalidatePosedListingsByCountryAction = async (countryCode: string) => {
    revalidateTag(apiTags.getPostedListingsByCountry(countryCode));
};

/** Revalidate all the featured listings. */
export const revalidateAllFeaturedListingsAction = async () => {
    revalidateTag(apiTags.getFeaturedListings());
};

/** Revalidate featured listings for a particular country. */
export const revalidateFeaturedListingsByCountryAction = async (countryCode: string) => {
    revalidateTag(apiTags.getFeatureListingsByCountry(countryCode));
};

/** Revalidate related listings for a given listing ID. */
export const revalidateRelatedListingsAction = async (listingId: ListingIdType) => {
    revalidateTag(apiTags.getRelatedListings(listingId));
};

/** Revalidate user notifications for a given user ID. */
export const revalidateUserNotificationsAction = async (userId: string) => {
    revalidateTag(apiTags.getMyNotifications(userId));
};

/** Revalidate city and state data. */
export const revalidateCityAndStatesAction = async () => {
    revalidateTag(apiTags.getStates());
    revalidateTag(apiTags.getCities());
};

/** Revalidate user profile details for a given user ID. */
export const revalidateUserProfileDetails = async (userId: string) => {
    revalidateTag(apiTags.getMyProfileDetails(userId));
};
