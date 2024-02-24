"use server";

import { createPromiseClient } from "@connectrpc/connect";
import { createGrpcTransport } from "@connectrpc/connect-node";

import { Service as GrpcService } from "targabay-protos/gen/ts/dist/service.v1_connect";

const client = createPromiseClient(
    GrpcService,
    createGrpcTransport({
        baseUrl: "http://localhost:50051",
        httpVersion: "2",
    }),
);

export const sayApi = async () => {
    const response = await client.print({
        message: "some message",
    });
    console.log("print res", response);
};
