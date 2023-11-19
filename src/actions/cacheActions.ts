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

export const revalidateAllPosedListingsAction = async () => {
    revalidateTag(apiTags.getPostedListings());
};

export const revalidatePosedListingsByCountryAction = async (countryCode: string) => {
    revalidateTag(apiTags.getPostedListingsByCountry(countryCode));
};

export const revalidateAllFeaturedListingsAction = async () => {
    revalidateTag(apiTags.getFeaturedListings());
};

export const revalidateFeaturedListingsByCountryAction = async (countryCode: string) => {
    revalidateTag(apiTags.getFeatureListingsByCountry(countryCode));
};

export const revalidateRelatedListingsAction = async (listingId: ListingIdType) => {
    revalidateTag(apiTags.getRelatedListings(listingId));
};

export const revalidateUserNotificationsAction = async (userId: string) => {
    revalidateTag(apiTags.getMyNotifications(userId));
};

export const revalidateCityAndStatesAction = async () => {
    revalidateTag(apiTags.getStates());
    revalidateTag(apiTags.getCities());
};

export const revalidateUserProfileDetails = async (userId: string) => {
    revalidateTag(apiTags.getMyProfileDetails(userId));
};
