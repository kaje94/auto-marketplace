import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";

export default withAuth(
    async (request) => {
        const token = await getToken({ req: request });
        const headers = new Headers(request.headers);
        if (token?.accessToken) {
            headers.set("tokenHeader", `Bearer ${token.accessToken}`);
        }
        const resp = NextResponse.next({ request: { headers } });
        return resp;
    },
    {
        callbacks: {
            authorized: ({ token }) => !!(token as any)?.accessToken,
        },
    }
);

export const config = {
    // User needs to authenticate themselves before accessing any any of the dashboard pages */
    matcher: ["/(dashboard.*)"],
};
