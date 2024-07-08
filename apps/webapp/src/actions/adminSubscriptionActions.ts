"use server";
import { PartialMessage } from "@bufbuild/protobuf";
import { createPromiseClient } from "@connectrpc/connect";
import { createGrpcTransport } from "@connectrpc/connect-node";
import { unstable_cache } from "next/cache";
import { AdminSubscriptionsService } from "targabay-protos/gen/ts/dist/admin_subscriptions.v1_connect";
import { GetAdminSubscriptionsRequest } from "targabay-protos/gen/ts/dist/types/admin_subscriptions_pb";
import { GetSubscriptionsResponse } from "targabay-protos/gen/ts/dist/types/common_pb";
import { apiTags, getGrpcHeaders, grpcOptions, revalidationTime } from "@/utils/grpc";

const client = createPromiseClient(AdminSubscriptionsService, createGrpcTransport(grpcOptions));

/** Get list of subscriptions created by the user */
export const getAllSubscriptionsAction = async (reqBody: PartialMessage<GetAdminSubscriptionsRequest>) => {
    const headers = await getGrpcHeaders();
    const getAllSubscriptions = unstable_cache(
        async (reqBody: PartialMessage<GetAdminSubscriptionsRequest>, headers: HeadersInit) => {
            const response = await client.getAllSubscriptions(reqBody, { headers });
            return response.toJson() as any as GetSubscriptionsResponse;
        },
        [apiTags.getAdminSubscriptions()],
        { tags: [apiTags.getAdminSubscriptions()], revalidate: revalidationTime.oneHour },
    );
    return getAllSubscriptions(reqBody, headers);
};
