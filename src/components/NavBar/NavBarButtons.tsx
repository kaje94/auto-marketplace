"use client";
import { clsx } from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signIn, signOut } from "next-auth/react";
import { ReactNode } from "react";
import { LogoutIcon, SearchIcon } from "@/icons";

export const NavBarLoginButton = () => {
    return (
        <button
            className="btn-ghost btn-primary btn px-2 font-semibold capitalize text-secondary hover:text-accent"
            onClick={() => signIn("duende-identityserver6")}
        >
            Login
        </button>
    );
};

export const NavBarLogoutButton = () => {
    return <NavBarMenuLink icon={<LogoutIcon className="pl-0.5" height={17} />} label="Logout" onClick={() => signOut({ callbackUrl: "/" })} />;
};

export const NavBarMenuLink = (props: { onClick?: () => void; link?: string; label: string; icon: ReactNode; badgeCount?: number }) => {
    const { link, label, icon, badgeCount, onClick } = props;
    const pathname = usePathname();
    const badge = (
        <div className="badge badge-primary badge-md  border-2 border-accent bg-primary p-0.5 px-1 text-xs text-neutral">
            {badgeCount && badgeCount > 9 ? `9+` : badgeCount}
        </div>
    );
    return (
        <li>
            {link ? (
                <Link className="flex" href={link}>
                    <div
                        className={clsx({
                            "flex flex-1 items-center justify-between font-medium duration-200 ": true,
                            "text-accent": pathname === link,
                            "text-base-300 hover:text-secondary": pathname !== link,
                        })}
                    >
                        <span className="flex gap-2">
                            {label}
                            {badgeCount ? badge : null}
                        </span>
                        {icon}
                    </div>
                </Link>
            ) : (
                <div className="flex" onClick={onClick}>
                    <div className="flex flex-1 items-center justify-between font-medium text-base-300 duration-200 hover:text-secondary">
                        <span className="flex gap-2">
                            {label}
                            {badgeCount ? badge : null}
                        </span>
                        {icon}
                    </div>
                </div>
            )}
        </li>
    );
};

export const PostAddLink = () => {
    const pathname = usePathname();
    const active = pathname === "/dashboard/new-listing";
    return (
        <Link href="/dashboard/new-listing">
            <button
                className={clsx({
                    "btn text-xs capitalize sm:text-sm px-2": true,
                    "btn-link text-secondary cursor-default": active,
                    "btn-ghost text-base-300 hover:text-accent": !active,
                })}
            >
                Post your Advert
            </button>
        </Link>
    );
};

export const SearchLink = () => {
    return (
        <Link href="/search">
            <button className="btn-ghost btn px-2 text-base-300 hover:text-accent">
                <SearchIcon />
            </button>
        </Link>
    );
};
