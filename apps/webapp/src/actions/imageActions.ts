"use server";
import { PartialMessage } from "@bufbuild/protobuf";
import { createPromiseClient } from "@connectrpc/connect";
import { createGrpcTransport } from "@connectrpc/connect-node";
import { ImageService } from "targabay-protos/gen/ts/dist/image.v1_connect";
import { GenerateSignedUrlRequest_Item, GenerateSignedUrlResponse } from "targabay-protos/gen/ts/dist/types/image_pb";
import { getGrpcHeaders, grpcOptions } from "@/utils/grpc";

const client = createPromiseClient(ImageService, createGrpcTransport(grpcOptions));

/** Get pre-signed urls needed to upload listing images */
export const getPresignedS3UrlsAction = async (fileList: PartialMessage<GenerateSignedUrlRequest_Item>[]) => {
    const response = await client.generateSignedUrl({ items: fileList }, { headers: await getGrpcHeaders() });
    return response.toJson() as any as GenerateSignedUrlResponse;
};

/** Delete listing images during the listing update flow */
export const deleteObjectFromS3Action = async (imageKeys: string[]) => {
    await client.deleteS3Images({ keys: imageKeys }, { headers: await getGrpcHeaders() });
};
