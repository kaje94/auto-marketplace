"use server";
import { api } from "@/utils/api";
import { AddListingReq } from "@/utils/types";

export const addAdvertAction = async (reqBody: AddListingReq) => {
    const listingId = await api.postListing(reqBody);
    console.log("created: ", listingId);
    return listingId;
};
