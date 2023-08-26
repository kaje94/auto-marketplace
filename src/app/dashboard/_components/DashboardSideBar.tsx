"use client";
import { FC, SVGProps } from "react";
import { AdvertIcon, ListIcon, NotificationIcon, SettingsIcon, UserIcon } from "@/icons";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

const NavBarItem: FC<{
    href: string;
    label: string;
    activePaths?: string[];
    regexExp?: RegExp;
    Icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
}> = ({ href, label, activePaths = [], regexExp, Icon }) => {
    const pathname = usePathname();
    return (
        <li>
            <Link
                href={href}
                className={clsx({
                    "px-4 py-3": true,
                    "active hover:!bg-base-content hover:!text-base-300": activePaths.includes(pathname) || regexExp?.test(pathname),
                })}
            >
                <Icon className="h-5 w-5" />
                {label}
            </Link>
        </li>
    );
};

export const DashboardSideBar: FC = () => {
    const session = useSession();

    return (
        <aside className="relative top-0 lg:sticky lg:top-7 2xl:top-8">
            <ul className="menu rounded-box w-full bg-base-100 p-2 shadow-md">
                <NavBarItem href="/dashboard/profile" label="Profile" activePaths={["/dashboard/profile"]} Icon={UserIcon} />
                <NavBarItem
                    href="/dashboard/my-listings"
                    label="My Adverts"
                    activePaths={["/dashboard/my-listings", "/dashboard/new-listing"]}
                    regexExp={new RegExp("^/dashboard/my-listings/(.*?)")}
                    Icon={AdvertIcon}
                />
                <NavBarItem href="/dashboard/preferences" label="Preferences" activePaths={["/dashboard/preferences"]} Icon={SettingsIcon} />
                <NavBarItem
                    href="/dashboard/notifications"
                    label="Notifications"
                    activePaths={["/dashboard/notifications"]}
                    Icon={NotificationIcon}
                />
                {session?.data?.user?.isAdmin && (
                    <NavBarItem
                        href="/dashboard/listings"
                        activePaths={["/dashboard/listings"]}
                        label="All Adverts"
                        regexExp={new RegExp("^/dashboard/listings/(.*?)")}
                        Icon={ListIcon}
                    />
                )}
            </ul>
        </aside>
    );
};
