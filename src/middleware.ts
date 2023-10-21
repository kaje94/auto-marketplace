import { getSession } from "@auth0/nextjs-auth0/edge";
import { NextRequest, NextResponse } from "next/server";
import { api } from "./utils/api";

export async function middleware(request: NextRequest) {
    // country code should be available only after deployed
    const userCountryCode = request.geo?.country || "LK";
    const pathname = request.nextUrl.pathname;

    const countries = await api.getCountries();

    if (new RegExp("/(dashboard.*)").test(request.nextUrl.pathname)) {
        const session = await getSession();
        if (!session) {
            return NextResponse.redirect(new URL(`/api/auth/login?returnTo=${request.nextUrl.pathname}`, request.url));
        }
    }

    const matchingLocal = countries.find((item) => pathname.startsWith(`/${item.countryCode}/`) || pathname === `/${item.countryCode}`);

    if (!matchingLocal) {
        return NextResponse.redirect(new URL(`/${userCountryCode}/${pathname}`, request.url));
    }

    const res = NextResponse.next();
    res.headers.set("x-pathname", request.nextUrl.pathname);
    res.headers.set("x-locale", matchingLocal.countryCode);
    res.headers.set("x-country-name", matchingLocal.name);

    return res;
}

export const config = {
    matcher: [
        // Skip all internal paths (_next)
        "/((?!api|_next/static|_next/image|assets|favicon.ico).*)",
    ],
};

// todo: check these examples
// https://github.com/vercel/next.js/issues/41980
