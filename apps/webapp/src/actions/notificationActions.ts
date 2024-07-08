"use server";
import { PartialMessage } from "@bufbuild/protobuf";
import { createPromiseClient } from "@connectrpc/connect";
import { createGrpcTransport } from "@connectrpc/connect-node";
import { revalidateTag, unstable_cache } from "next/cache";
import { NotificationsService } from "targabay-protos/gen/ts/dist/notifications.v1_connect";
import { GetNotificationResponse, GetUserNotificationsRequest } from "targabay-protos/gen/ts/dist/types/notifications_pb";
import { apiTags, getGrpcHeaders, grpcOptions, revalidationTime } from "@/utils/grpc";
import { delay } from "@/utils/helpers";

const client = createPromiseClient(NotificationsService, createGrpcTransport(grpcOptions));

/** Mark all notifications as read */
export const setAllNotificationsAsShownAction = async (userId: string) => {
    await client.markAllNotificationsShown({}, { headers: await getGrpcHeaders() });
    await delay(5000);
    revalidateTag(apiTags.getMyNotifications(userId));
};

/** Get user notifications */
export const getUserNotificationsAction = async (reqBody: PartialMessage<GetUserNotificationsRequest>, userEmail: string) => {
    const headers = await getGrpcHeaders();
    const getUserNotifications = unstable_cache(
        async (reqBody: PartialMessage<GetUserNotificationsRequest>, headers: HeadersInit) => {
            const response = await client.getUserNotifications(reqBody, { headers });
            return response.toJson() as any as GetNotificationResponse;
        },
        [apiTags.getMyNotifications(userEmail)],
        { tags: [apiTags.getMyNotifications(userEmail)], revalidate: revalidationTime.oneHour },
    );
    return getUserNotifications(reqBody, headers);
};
