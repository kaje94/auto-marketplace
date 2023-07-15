import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
    const token: any = await getToken({ req: request });
    const headers = new Headers(request.headers);
    if (token?.accessToken) {
        headers.set("Authorization", `Bearer ${token.accessToken}`);
    }

    const resp = NextResponse.next({ request: { headers } });

    return resp;
}
