import { getSession } from "@auth0/nextjs-auth0/edge";
import { NextRequest, NextResponse } from "next/server";
import { COUNTRIES } from "./utils/countries";

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // country code should be available only after deployed
    const userCountryCode = request.geo?.country || "LK";
    const pathLocale: string = pathname.split("/").filter((item) => item !== "")[0] || "";
    const matchingLocal = COUNTRIES[pathLocale];

    if (!matchingLocal) {
        return NextResponse.redirect(new URL(`/${userCountryCode}/${pathname}`, request.url));
    }

    if (new RegExp(`/${userCountryCode}/(dashboard.*)`).test(request.nextUrl.pathname)) {
        const session = await getSession();
        if (!session) {
            return NextResponse.redirect(new URL(`/api/auth/login?returnTo=${request.nextUrl.pathname}`, request.url));
        }
    }

    const res = NextResponse.next();
    res.headers.set("x-pathname", request.nextUrl.pathname);
    res.headers.set("x-locale", pathLocale);
    res.headers.set("x-country-name", matchingLocal[0]);

    // Following is needed for next-international to function
    res.headers.set("X-Next-Locale", "en");
    if (request.cookies.get("Next-Locale")?.value !== "en") {
        res.cookies.set("Next-Locale", "en", { sameSite: "strict" });
    }

    return res;
}

export const config = {
    matcher: [
        // Skip all internal paths (_next)
        "/((?!api|_next/static|_next/image|assets|images|favicons|favicon|robots.txt|manifest).*)",
    ],
};
