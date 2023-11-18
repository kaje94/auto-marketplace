import { getSession } from "@auth0/nextjs-auth0/edge";
import { NextRequest, NextResponse } from "next/server";
import { COUNTRIES } from "./utils/countries";

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    if (new RegExp("/(dashboard.*)").test(request.nextUrl.pathname)) {
        const session = await getSession();
        if (!session) {
            return NextResponse.redirect(new URL(`/api/auth/login?returnTo=${request.nextUrl.pathname}`, request.url));
        }
    }

    // country code should be available only after deployed
    const userCountryCode = request.geo?.country || "LK";
    const pathLocale: string = pathname.split("/").filter((item) => item !== "")[0] || "";
    const matchingLocal = COUNTRIES[pathLocale];

    if (!matchingLocal) {
        return NextResponse.redirect(new URL(`/${userCountryCode}/${pathname}`, request.url));
    }

    const res = NextResponse.next();
    res.headers.set("x-pathname", request.nextUrl.pathname);
    res.headers.set("x-locale", pathLocale);
    res.headers.set("x-country-name", matchingLocal[0]);

    return res;
}

export const config = {
    matcher: [
        // Skip all internal paths (_next)
        "/((?!api|_next/static|_next/image|assets|images|favicons|manifest).*)",
    ],
};
