"use client";
import { clsx } from "clsx";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { ReactNode } from "react";
import { LinkWithLocale } from "@/components/Common";
import { LogoutIcon, SearchIcon } from "@/icons";
import { useScopedI18n } from "@/locales/client";

export const NavBarLoginButton = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const tNav = useScopedI18n("nav");

    return (
        <a
            className="btn btn-primary btn-ghost px-2 font-semibold capitalize text-secondary hover:text-accent"
            href={`/api/auth/login?returnTo=${pathname}${searchParams.size > 0 ? `?${searchParams.toString()}` : ""}`}
        >
            {tNav("login")}
        </a>
    );
};

export const NavBarLogoutButton = () => {
    const tNav = useScopedI18n("nav");
    return (
        <a
            className={clsx({
                "flex flex-1 items-center justify-between font-medium duration-200 hover:text-accent px-4 py-2": true,
            })}
            href="/api/auth/logout"
        >
            {tNav("logout")}
            <LogoutIcon className="pl-0.5" height={17} />
        </a>
    );
};

export const NavBarMenuLink = (props: { badgeCount?: number; icon: ReactNode; label: string; link: string }) => {
    const { link, label, icon, badgeCount } = props;
    const pathname = usePathname();
    const params = useParams();
    const badge = (
        <div className="badge badge-primary badge-md  border-2 border-accent bg-primary p-0.5 px-1 text-xs text-neutral">
            {badgeCount && badgeCount > 9 ? `9+` : badgeCount}
        </div>
    );
    return (
        <li>
            <LinkWithLocale className="flex" href={link}>
                <div
                    className={clsx({
                        "flex flex-1 items-center justify-between font-medium duration-200 ": true,
                        "text-accent": pathname === `/${params.locale}${link}`,
                        "text-base-300 hover:text-secondary": pathname !== link,
                    })}
                >
                    <span className="flex gap-2">
                        {label}
                        {badgeCount ? badge : null}
                    </span>
                    {icon}
                </div>
            </LinkWithLocale>
        </li>
    );
};

export const PostAddLink = (props: { isLoggedIn: boolean }) => {
    const tNav = useScopedI18n("nav");
    const pathname = usePathname();
    const params = useParams();
    const active = pathname === `/${params.locale}/dashboard/new-listing`;

    const PostAdvertBtn = (
        <button
            className={clsx({
                "btn text-xs capitalize sm:text-sm px-2": true,
                "btn-link text-secondary cursor-default": active,
                "btn-ghost text-base-300 hover:text-accent": !active,
            })}
        >
            {tNav("postYourAdvert")}
        </button>
    );

    if (!props.isLoggedIn) {
        return <a href={params.locale ? `/${params.locale}/dashboard/new-listing` : "/dashboard/new-listing"}>{PostAdvertBtn}</a>;
    }
    return <LinkWithLocale href="/dashboard/new-listing">{PostAdvertBtn}</LinkWithLocale>;
};

export const SearchLink = () => {
    return (
        <LinkWithLocale href="/search">
            <button className="btn btn-ghost px-2 text-base-300 hover:text-accent">
                <SearchIcon />
            </button>
        </LinkWithLocale>
    );
};