import { getSession } from "@auth0/nextjs-auth0/edge";
import { NextRequest, NextResponse } from "next/server";
import { BOT_LOCALE } from "./utils/constants";
import { COUNTRIES } from "./utils/countries";

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // Check if its a search engine crawler or not
    const userAgent = request.headers.get("user-agent");
    const isCrawler = userAgent ? /bot|googlebot|bingbot|yandexbot|slurp|yahoo|duckduckbot/i.test(userAgent) : false;

    // country code should be available only after deployed
    const userCountryCode = request.geo?.country?.toLowerCase() || "lk";
    const pathLocale: string = pathname.split("/").filter((item) => item !== "")[0] || "";
    const matchingLocal = COUNTRIES[pathLocale];

    // Redirect to the correct route by if a valid route does not exist
    if (!matchingLocal) {
        if (isCrawler && pathLocale !== BOT_LOCALE) {
            return NextResponse.redirect(new URL(`/${BOT_LOCALE}/${pathname}`, request.url));
        } else if (!isCrawler) {
            if (pathLocale === BOT_LOCALE) {
                return NextResponse.redirect(new URL(pathname?.replace(`/${BOT_LOCALE}`, `/${userCountryCode}`), request.url));
            } else {
                return NextResponse.redirect(new URL(`/${userCountryCode}/${pathname}`, request.url));
            }
        }
    }

    // Check if a valid user is trying to access the dashboard route
    if (new RegExp(`/${userCountryCode}/(dashboard.*)`).test(request.nextUrl.pathname)) {
        const session = await getSession();
        if (!session) {
            return NextResponse.redirect(new URL(`/api/auth/login?returnTo=${request.nextUrl.pathname}`, request.url));
        }
    }

    const res = NextResponse.next();
    res.headers.set("x-pathname", request.nextUrl.pathname);
    res.headers.set("x-locale", pathLocale);
    res.headers.set("x-origin-locale", userCountryCode);
    if (matchingLocal) {
        res.headers.set("x-country-name", matchingLocal[0]);
    }

    return res;
}

export const config = {
    matcher: [
        // Skip all internal paths (_next)
        "/((?!api|_next/static|_next/image|assets|images|favicons|favicon|robots.txt|manifest|sitemap.xml).*)",
    ],
};
