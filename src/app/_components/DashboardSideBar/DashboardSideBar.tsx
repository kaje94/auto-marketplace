"use client";
import { NavBarItem } from "./DashboardSideBarItem";
import { useSession } from "next-auth/react";

export const DashboardSideBar = () => {
    const session = useSession();

    return (
        <aside className="relative top-0 lg:sticky lg:top-7 2xl:top-8">
            <ul className="menu rounded-box w-full bg-base-100 p-2 shadow-md">
                <NavBarItem
                    href="/dashboard/profile"
                    label="Profile"
                    activePaths={["/dashboard/profile"]}
                    iconName="UserIcon"
                    regexExp="^/dashboard/profile/(.*?)"
                />
                <NavBarItem
                    href="/dashboard/my-listings"
                    label="My Adverts"
                    activePaths={["/dashboard/my-listings", "/dashboard/new-listing"]}
                    regexExp="^/dashboard/my-listings/(.*?)"
                    iconName="AdvertIcon"
                />
                <NavBarItem
                    href="/dashboard/my-subscriptions"
                    label="My Subscriptions"
                    activePaths={["/dashboard/my-subscriptions", "/dashboard/new-subscription"]}
                    regexExp="^/dashboard/my-subscriptions/(.*?)"
                    iconName="RssIcon"
                />
                <NavBarItem
                    href="/dashboard/notifications"
                    label="Notifications"
                    activePaths={["/dashboard/notifications"]}
                    iconName="NotificationIcon"
                />
                {session?.data?.user?.isAdmin && (
                    <>
                        <NavBarItem
                            href="/dashboard/listings"
                            activePaths={["/dashboard/listings"]}
                            label="Manage Adverts"
                            regexExp="^/dashboard/listings/(.*?)"
                            iconName="ListIcon"
                        />
                        <NavBarItem
                            href="/dashboard/subscriptions"
                            label="Manage Subscriptions"
                            activePaths={["/dashboard/subscriptions"]}
                            regexExp="^/dashboard/subscriptions/(.*?)"
                            iconName="ClipboardIcon"
                        />
                    </>
                )}
            </ul>
        </aside>
    );
};
