import { withMiddlewareAuthRequired } from "@auth0/nextjs-auth0/edge";
import { NextResponse } from "next/server";

export default withMiddlewareAuthRequired(async function middleware(req) {
    const res = NextResponse.next();
    res.headers.set("x-pathname", req.nextUrl.pathname);
    return res;
});

export const config = { matcher: ["/(dashboard.*)"] };
