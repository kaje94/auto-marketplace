import { getAccessToken } from "@auth0/nextjs-auth0";
import { GrpcTransportOptions } from "@connectrpc/connect-node";
import { headers as nextHeaders } from "next/headers";
import { redirect } from "next/navigation";
import { env } from "@/env.mjs";

const getConfigWithAuth = async (): Promise<string> => {
    try {
        const { accessToken } = await getAccessToken();
        if (accessToken === undefined || accessToken === "") {
            throw new Error("Session not found");
        }
        return `Bearer ${accessToken}`;
    } catch (err) {
        const currentPathname = nextHeaders().get("x-pathname");
        redirect(`/unauthorized${currentPathname ? `?returnTo=${currentPathname}` : ``}`);
    }
};

export const grpcOptions: GrpcTransportOptions = { baseUrl: env.GRPC_API_BASE_URL, httpVersion: "2" };

export const getGrpcHeaders = async () => ({ Authorization: await getConfigWithAuth() });
