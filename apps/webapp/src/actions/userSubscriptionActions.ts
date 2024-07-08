"use server";
import { PartialMessage } from "@bufbuild/protobuf";
import { createPromiseClient } from "@connectrpc/connect";
import { createGrpcTransport } from "@connectrpc/connect-node";
import { revalidateTag, unstable_cache } from "next/cache";
import { GetSubscriptionsResponse, SubscriptionItem, SubscriptionItem_Data } from "targabay-protos/gen/ts/dist/types/common_pb";
import { GetUserSubscriptionsRequest, UpdateSubscriptionRequest } from "targabay-protos/gen/ts/dist/types/user_subscriptions_pb";
import { UserSubscriptionsService } from "targabay-protos/gen/ts/dist/user_subscriptions.v1_connect";
import { apiTags, getGrpcHeaders, grpcOptions, revalidationTime, subscriptionApiTags } from "@/utils/grpc";
import { delay } from "@/utils/helpers";

const client = createPromiseClient(UserSubscriptionsService, createGrpcTransport(grpcOptions));

/** Create a new listing subscription */
export const createSubscriptionAction = async (reqBody: PartialMessage<SubscriptionItem_Data>, email: string) => {
    const response = await client.createSubscription(reqBody, { headers: await getGrpcHeaders() });
    subscriptionApiTags(response.id, email).forEach((tag) => revalidateTag(tag));
    await delay(5000);
    return response.id;
};

/** Edit an existing listing subscription */
export const updateSubscriptionAction = async (reqBody: PartialMessage<UpdateSubscriptionRequest>, userEmail: string) => {
    await client.updateSubscription(reqBody, { headers: await getGrpcHeaders() });
    subscriptionApiTags(reqBody.id!, userEmail).forEach((tag) => revalidateTag(tag));
};

/** Get list of subscriptions created by the user */
export const getUserSubscriptionsAction = async (reqBody: PartialMessage<GetUserSubscriptionsRequest>, userEmail: string) => {
    const headers = await getGrpcHeaders();
    const getUserSubscriptions = unstable_cache(
        async (reqBody: PartialMessage<GetUserSubscriptionsRequest>, headers: HeadersInit) => {
            const response = await client.getUserSubscriptions(reqBody, { headers });
            return response.toJson() as any as GetSubscriptionsResponse;
        },
        [apiTags.getUserSubscriptions(userEmail)],
        { tags: [apiTags.getUserSubscriptions(userEmail)], revalidate: revalidationTime.oneHour },
    );
    return getUserSubscriptions(reqBody, headers);
};

/** Check whether user is eligible to create a new subscription */
export const canCreateSubscriptionAction = async (userEmail: string) => {
    const headers = await getGrpcHeaders();
    const canCreateSubscription = unstable_cache(
        async (headers: HeadersInit) => {
            const response = await client.canCreateSubscription({}, { headers });
            return response.value;
        },
        [apiTags.getCanCreateSubscriptions(userEmail)],
        { tags: [apiTags.getCanCreateSubscriptions(userEmail)], revalidate: revalidationTime.oneHour },
    );
    return canCreateSubscription(headers);
};

/** Get details of an individual subscription item. */
export const getSubscriptionItemAction = async (id: string) => {
    const headers = await getGrpcHeaders();
    const getSubscriptionItem = unstable_cache(
        async (id: string, headers: HeadersInit) => {
            const response = await client.getSubscriptionItem({ id }, { headers });
            return response.toJson() as any as SubscriptionItem;
        },
        [apiTags.getSubscriptionItem(id)],
        { tags: [apiTags.getSubscriptionItem(id)], revalidate: revalidationTime.oneHour },
    );
    return getSubscriptionItem(id, headers);
};

/** Delete an existing listing subscription */
export const deleteListingSubscriptionAction = async (id: string, userEmail: string) => {
    await client.deleteSubscription({ id }, { headers: await getGrpcHeaders() });
    await delay(5000);
    subscriptionApiTags(id, userEmail).forEach((tag) => revalidateTag(tag));
};

/** Activate a listing subscription as active or inactive */
export const activateSubscriptionAction = async (id: string, subscriptionExpiryDate: string, userId: string) => {
    await client.activateSubscription({ id, subscriptionExpiryDate }, { headers: await getGrpcHeaders() });
    subscriptionApiTags(id, userId).forEach((tag) => revalidateTag(tag));
};

/** Deactivate a listing subscription as active or inactive */
export const deactivateSubscriptionAction = async (id: string, userId: string) => {
    await client.deactivateSubscription({ id }, { headers: await getGrpcHeaders() });
    subscriptionApiTags(id, userId).forEach((tag) => revalidateTag(tag));
};
