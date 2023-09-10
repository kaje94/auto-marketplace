"use server";
import { api, subscriptionApiTags } from "@/utils/api";
import { CreateSubscriptionReq, EditSubscriptionReq, ListingSubscriptionIdType, ToggleSubscriptionReq } from "@/utils/types";
import { revalidateTag } from "next/cache";

export const createListingSubscriptionAction = async (reqBody: CreateSubscriptionReq, userId: string) => {
    const subscriptionId = await api.postListingSubscription(reqBody);
    subscriptionApiTags(subscriptionId, userId).forEach((tag) => revalidateTag(tag));
};

export const editListingSubscriptionAction = async (reqBody: EditSubscriptionReq, userId: string) => {
    await api.putListingSubscription(reqBody);
    subscriptionApiTags(reqBody.listingSubscriptionId, userId).forEach((tag) => revalidateTag(tag));
};

export const deleteListingSubscriptionAction = async (id: ListingSubscriptionIdType, userId: string) => {
    await api.deleteListingSubscriptions(id);
    subscriptionApiTags(id, userId).forEach((tag) => revalidateTag(tag));
};

export const toggleListingSubscriptionAction = async (reqBody: ToggleSubscriptionReq, userId: string) => {
    await api.toggleListingSubscription(reqBody);
    subscriptionApiTags(reqBody.listingSubscriptionId, userId).forEach((tag) => revalidateTag(tag));
};
