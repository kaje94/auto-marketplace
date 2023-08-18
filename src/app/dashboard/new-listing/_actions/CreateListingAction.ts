"use server";
import { api } from "@/utils/api";
import { CreateListingReq } from "@/utils/types";

export const createListingAction = async (reqBody: CreateListingReq) => {
    const listingId = await api.postListing(reqBody);
    console.log("created: ", listingId);
    return listingId;
};
