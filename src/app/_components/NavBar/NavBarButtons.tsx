"use client";
import { LogoutIcon, SearchIcon } from "@/icons";
import clsx from "clsx";
import { signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

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
    return <NavBarMenuLink label="Logout" icon={<LogoutIcon height={17} className="pl-0.5" />} onClick={() => signOut({ callbackUrl: "/" })} />;
};

export const NavBarMenuLink = (props: { onClick?: () => void; link?: string; label: string; icon: ReactNode; badgeCount?: number }) => {
    const { link, label, icon, badgeCount, onClick } = props;
    const pathname = usePathname();
    const badge = (
        <div className="badge badge-primary badge-md  border-2 border-accent bg-gradient-to-t from-secondary to-primary p-0.5 px-1 text-neutral">
            {badgeCount}
        </div>
    );
    return (
        <li>
            {link ? (
                <Link href={link} className="flex">
                    <div
                        className={clsx({
                            "flex flex-1 items-center justify-between font-medium duration-200 ": true,
                            "text-accent": pathname === link,
                            "text-base-300 hover:text-secondary": pathname !== link,
                        })}
                    >
                        <span className="flex gap-2">
                            {label}
                            {badgeCount && badge}
                        </span>
                        {icon}
                    </div>
                </Link>
            ) : (
                <div onClick={onClick} className="flex">
                    <div className="flex flex-1 items-center justify-between font-medium text-base-300 duration-200 hover:text-secondary">
                        <span className="flex gap-2">
                            {label}
                            {badgeCount && badge}
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
