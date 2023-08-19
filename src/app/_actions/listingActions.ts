"use server";
import { api } from "@/utils/api";
import { ListingStatusTypes } from "@/utils/enum";
import { CreateListingReq, EditListingReq, ReviewListingReq } from "@/utils/types";
import { revalidatePath } from "next/cache";

export const reviewListingAction = async (req: ReviewListingReq) => {
    await api.reviewListing(req);
    revalidatePath(`/dashboard/listings/${req.listingId}`);
    revalidatePath("/dashboard/listings");
    if (req.status === ListingStatusTypes.Posted) {
        revalidatePath(`/search/${req.listingId}`);
    }
};

export const createListingAction = async (reqBody: CreateListingReq) => {
    const listingId = await api.postListing(reqBody);
    revalidatePath(`/dashboard/listings/${listingId}`);
    revalidatePath("/dashboard/listings");
    return listingId;
};

export const editListingAction = async (reqBody: EditListingReq) => {
    await api.putListing(reqBody);
    revalidatePath(`/dashboard/listings/${reqBody.listingId}`);
    revalidatePath("/dashboard/listings");
    revalidatePath(`/search/${reqBody.listingId}`);
};

export const deleteListingAction = async (listingId: number) => {
    await api.deleteListing(listingId);
    revalidatePath(`/dashboard/listings/${listingId}`);
    revalidatePath("/dashboard/listings");
    revalidatePath(`/search/${listingId}`);
};
