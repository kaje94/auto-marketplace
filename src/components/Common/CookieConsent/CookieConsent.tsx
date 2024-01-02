"use client";

import { clsx } from "clsx";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LinkWithLocale } from "../LinkWithLocale";

const cookieAcceptedKey = "accepted-cookie-consent-v1";

export const CookieConsent = () => {
    const pathName = usePathname();
    const params = useParams();
    const isLandingPage = pathName === `/${params.locale}`;
    const [accepted, setAccepted] = useState(true);

    useEffect(() => {
        const hasAccepted = window.localStorage.getItem(cookieAcceptedKey);
        setAccepted(!!hasAccepted);
    }, []);

    if (accepted) {
        return null;
    }

    return (
        <div
            className={clsx(
                "sticky bottom-0 z-10 flex w-full justify-center border-t-2  border-secondary bg-hero py-2",
                isLandingPage ? "bg-hero" : "bg-neutral",
            )}
        >
            <div className="container mx-auto flex items-center justify-between gap-1 px-4 md:px-4 lg:px-10">
                <span className="text-xs leading-tight text-neutral-content sm:text-sm">
                    We value your privacy. Targabay uses only essential first-party cookies to enhance your browsing experience. For more information,
                    please visit our{" "}
                    <LinkWithLocale className="link-hover link font-semibold" href="/cookie-policy">
                        Cookie Policy
                    </LinkWithLocale>{" "}
                    page.
                </span>
                <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                        window.localStorage.setItem(cookieAcceptedKey, "true");
                        setAccepted(true);
                    }}
                >
                    Accept
                </button>
            </div>
        </div>
    );
};
