import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    async (request) => {
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set("x-pathname", request.nextUrl.pathname);

        return NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        });
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token?.access_token && token?.error !== "RefreshAccessTokenError",
        },
    }
);

export const config = {
    // User needs to authenticate themselves before accessing any any of the dashboard pages */
    matcher: ["/(dashboard.*)"],
};
