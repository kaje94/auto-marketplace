"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/authConfig";
import { NavBarItem } from "./DashboardSideBarItem";

export const DashboardSideBar = async () => {
    const session = await getServerSession(authOptions);

    return (
        <aside className="relative top-0 lg:sticky lg:top-7 2xl:top-8">
            <ul className="menu rounded-box w-full bg-base-100 p-2 shadow-md">
                <NavBarItem href="/dashboard/profile" label="Profile" activePaths={["/dashboard/profile"]} iconName="UserIcon" />
                <NavBarItem
                    href="/dashboard/my-listings"
                    label="My Adverts"
                    activePaths={["/dashboard/my-listings", "/dashboard/new-listing"]}
                    regexExp={new RegExp("^/dashboard/my-listings/(.*?)")}
                    iconName="AdvertIcon"
                />
                <NavBarItem href="/dashboard/preferences" label="Preferences" activePaths={["/dashboard/preferences"]} iconName="SettingsIcon" />
                <NavBarItem
                    href="/dashboard/notifications"
                    label="Notifications"
                    activePaths={["/dashboard/notifications"]}
                    iconName="NotificationIcon"
                />
                {session?.user?.isAdmin && (
                    <NavBarItem
                        href="/dashboard/listings"
                        activePaths={["/dashboard/listings"]}
                        label="All Adverts"
                        regexExp={new RegExp("^/dashboard/listings/(.*?)")}
                        iconName="ListIcon"
                    />
                )}
            </ul>
        </aside>
    );
};
