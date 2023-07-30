"use client";
import { FC } from "react";
import { AdvertIcon, NotificationIcon, SettingsIcon, UserIcon } from "@/icons";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const DashboardSideBar: FC = () => {
    const pathname = usePathname();

    return (
        <aside className="relative top-0 lg:sticky lg:top-7 2xl:top-8">
            <ul className="menu rounded-box w-full bg-base-100 p-2 shadow-md">
                <li>
                    <Link href="/dashboard/profile" className={clsx({ "px-4 py-3": true, active: pathname === "/dashboard/profile" })}>
                        <UserIcon className="h-5 w-5" />
                        Profile
                    </Link>
                </li>
                <li>
                    <Link
                        href="/dashboard/my-ads"
                        className={clsx({ "px-4 py-3": true, active: ["/dashboard/my-ads", "/dashboard/new-advert"].includes(pathname) })}
                    >
                        <AdvertIcon className="h-5 w-5" />
                        My Adverts
                    </Link>
                </li>
                <li>
                    <Link href="/dashboard/preferences" className={clsx({ "px-4 py-3": true, active: pathname === "/dashboard/preferences" })}>
                        <SettingsIcon className="h-5 w-5" />
                        Preferences
                    </Link>
                </li>

                <li>
                    <Link href="/dashboard/notifications" className={clsx({ "px-4 py-3": true, active: pathname === "/dashboard/notifications" })}>
                        <NotificationIcon className="h-5 w-5" />
                        Notifications
                    </Link>
                </li>
            </ul>
        </aside>
    );
};
