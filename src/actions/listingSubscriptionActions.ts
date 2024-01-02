"use server";
import { revalidateTag } from "next/cache";
import { api, subscriptionApiTags } from "@/utils/api";
import { CreateSubscriptionReq, EditSubscriptionReq, ListingSubscriptionIdType, ToggleSubscriptionReq } from "@/utils/types";

/** Create a new listing subscription */
export const createListingSubscriptionAction = async (reqBody: CreateSubscriptionReq, userId: string) => {
    const subscriptionId = await api.postListingSubscription(reqBody);
    subscriptionApiTags(subscriptionId, userId).forEach((tag) => revalidateTag(tag));
};

/** Edit an existing listing subscription */
export const editListingSubscriptionAction = async (reqBody: EditSubscriptionReq, userId: string) => {
    await api.putListingSubscription(reqBody);
    subscriptionApiTags(reqBody.listingSubscriptionId, userId).forEach((tag) => revalidateTag(tag));
};

/** Delete an existing listing subscription */
export const deleteListingSubscriptionAction = async (id: ListingSubscriptionIdType, userId: string) => {
    await api.deleteListingSubscriptions(id);
    subscriptionApiTags(id, userId).forEach((tag) => revalidateTag(tag));
};

/** Toggle a listing subscription as active or inactive */
export const toggleListingSubscriptionAction = async (reqBody: ToggleSubscriptionReq, userId: string) => {
    await api.toggleListingSubscription(reqBody);
    subscriptionApiTags(reqBody.listingSubscriptionId, userId).forEach((tag) => revalidateTag(tag));
};
