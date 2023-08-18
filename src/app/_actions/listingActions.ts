"use server";
import { api } from "@/utils/api";
import { ListingStatusTypes } from "@/utils/enum";
import { ReviewListingReq } from "@/utils/types";
import { revalidatePath } from "next/cache";

export const reviewListingAction = async (req: ReviewListingReq) => {
    await api.reviewListing(req);
    revalidatePath(`/dashboard/listings/${req.listingId}`);
    revalidatePath("/dashboard/listings");
    revalidatePath(`/search/${req.listingId}`);
    if (req.status === ListingStatusTypes.Posted) {
        revalidatePath(`/search/${req.listingId}`);
    }
};
