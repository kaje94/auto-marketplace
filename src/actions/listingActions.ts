"use server";
import { revalidateTag } from "next/cache";
import { api, listingItemTags } from "@/utils/api";
import { CreateListingReq, EditListingReq, ListingIdType, ReportListingReq, ReviewListingReq, UnListListingReq } from "@/utils/types";

export const reviewListingAction = async (req: ReviewListingReq, userId: string) => {
    await api.reviewListing(req);
    listingItemTags(req.listingId, userId).forEach((tag) => revalidateTag(tag));
};

export const unListListingAction = async (req: UnListListingReq, userId: string) => {
    await api.unListListing(req);
    listingItemTags(req.listingId, userId).forEach((tag) => revalidateTag(tag));
};

export const renewListingAction = async (listingId: ListingIdType, userId: string) => {
    await api.renewListing(listingId);
    listingItemTags(listingId, userId).forEach((tag) => revalidateTag(tag));
};

export const createListingAction = async (reqBody: CreateListingReq, userId: string) => {
    const listingId = await api.postListing(reqBody);
    listingItemTags(listingId, userId).forEach((tag) => revalidateTag(tag));
    return listingId;
};

export const editListingAction = async (reqBody: EditListingReq, userId: string) => {
    await api.putListing(reqBody);
    listingItemTags(reqBody.listingId, userId).forEach((tag) => revalidateTag(tag));
};

export const deleteListingAction = async (listingId: ListingIdType, userId: string) => {
    await api.deleteListing(listingId);
    listingItemTags(listingId, userId).forEach((tag) => revalidateTag(tag));
};

export const incrementViews = async (listingId: ListingIdType) => {
    await api.incrementViews(listingId);
};

export const reportListingAction = async (reqBody: ReportListingReq) => {
    await api.reportListing(reqBody);
};
