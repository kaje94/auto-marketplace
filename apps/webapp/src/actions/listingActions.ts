"use server";
import { revalidateTag } from "next/cache";
import { api, apiTags, listingItemTags } from "@/utils/api";
import { CreateListingReq, EditListingReq, ListingIdType, ReportListingReq, ReviewListingReq, UnListListingReq } from "@/utils/types";

/** Review a listing, approve or reject it */
export const reviewListingAction = async (req: ReviewListingReq, userId: string) => {
    await api.reviewListing(req);
    listingItemTags(req.listingId, userId).forEach((tag) => revalidateTag(tag));
    revalidateTag(apiTags.getMyNotifications(userId));
};

/**Un-list a listing and hide it from public view*/
export const unListListingAction = async (req: UnListListingReq, userId: string) => {
    await api.unListListing(req);
    listingItemTags(req.listingId, userId).forEach((tag) => revalidateTag(tag));
};

/** Renew a listing that is expired or about to be expired */
export const renewListingAction = async (listingId: ListingIdType, userId: string) => {
    await api.renewListing(listingId);
    listingItemTags(listingId, userId).forEach((tag) => revalidateTag(tag));
};

/** Create a new listing advert */
export const createListingAction = async (reqBody: CreateListingReq, userId: string) => {
    const listingId = await api.postListing(reqBody);
    listingItemTags(listingId, userId).forEach((tag) => revalidateTag(tag));
    return listingId;
};

/** Edit a listing advert */
export const editListingAction = async (reqBody: EditListingReq, userId: string) => {
    await api.putListing(reqBody);
    listingItemTags(reqBody.listingId, userId).forEach((tag) => revalidateTag(tag));
};

/** Permanently delete a listing as an admin */
export const deleteListingAction = async (listingId: ListingIdType, userId: string) => {
    await api.deleteListing(listingId);
    listingItemTags(listingId, userId).forEach((tag) => revalidateTag(tag));
};

/** Increment the views count of a listing. */
export const incrementViewsAction = async (listingId: ListingIdType) => {
    await api.incrementViews(listingId);
};

/** Report a listing */
export const reportListingAction = async (reqBody: ReportListingReq) => {
    await api.reportListing(reqBody);
};

/** Make a listing featured in order to gain more views*/
export const makeListingFeatured = async (listingId: ListingIdType, countryCode: string, userId: string) => {
    await api.makeListingFeatured(listingId, countryCode);
    listingItemTags(listingId, userId).forEach((tag) => revalidateTag(tag));
    revalidateTag(apiTags.getFeatureListingsByCountry(countryCode));
};
