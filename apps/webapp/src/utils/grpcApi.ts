import { createPromiseClient } from "@connectrpc/connect";
import { createConnectTransport } from "@connectrpc/connect-web";
import { Service as GrpcService } from "targabay-protos/gen/ts/service.v1_connect";

const client = createPromiseClient(
    GrpcService,
    createConnectTransport({
        baseUrl: "http://localhost:3000",
    }),
);

export const sayApi = async () => {
    const response = await client.print({
        message: "some message",
    });
    console.log("print res", response);
};
