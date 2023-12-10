"use client";
import { Claims } from "@auth0/nextjs-auth0/edge";
import { useScopedI18n } from "@/locales/client";
import { NavBarItem } from "./DashboardSideBarItem";

export const DashboardSideBarItems = ({ userClaims, notificationCount }: { notificationCount?: number; userClaims?: Claims }) => {
    const tNav = useScopedI18n("nav");
    return (
        <aside className="relative top-0 lg:sticky lg:top-7 2xl:top-8">
            <ul className="menu rounded-box w-full bg-base-100 p-2 shadow-md">
                <NavBarItem
                    activePaths={["/dashboard/profile"]}
                    href="/dashboard/profile"
                    iconName="UserIcon"
                    label={tNav("profile")}
                    regexExp="/dashboard/profile/(.*?)"
                />
                <NavBarItem
                    activePaths={["/dashboard/my-listings", "/dashboard/new-listing"]}
                    href="/dashboard/my-listings"
                    iconName="AdvertIcon"
                    label={tNav("myListing")}
                    regexExp="/dashboard/my-listings/(.*?)"
                />
                <NavBarItem
                    activePaths={["/dashboard/my-subscriptions", "/dashboard/new-subscription"]}
                    href="/dashboard/my-subscriptions"
                    iconName="RssIcon"
                    label={tNav("mySubscriptions")}
                    regexExp="/dashboard/my-subscriptions/(.*?)"
                />
                <NavBarItem
                    activePaths={["/dashboard/notifications"]}
                    badgeCount={notificationCount}
                    href="/dashboard/notifications"
                    iconName="NotificationIcon"
                    label={tNav("notifications")}
                />
                {userClaims?.isAdmin && (
                    <>
                        <div className=" divider text-center text-sm">{tNav("adminFunctions")}</div>
                        <NavBarItem
                            activePaths={["/dashboard/listings"]}
                            href="/dashboard/listings"
                            iconName="ListIcon"
                            label={tNav("manageListings")}
                            regexExp="/dashboard/listings/(.*?)"
                        />
                        <NavBarItem
                            activePaths={["/dashboard/subscriptions"]}
                            href="/dashboard/subscriptions"
                            iconName="ClipboardIcon"
                            label={tNav("manageSubscriptions")}
                            regexExp="/dashboard/subscriptions/(.*?)"
                        />
                        <NavBarItem
                            activePaths={["/dashboard/cache-manage"]}
                            href="/dashboard/cache-manage"
                            iconName="DatabaseIcon"
                            label={tNav("manageCache")}
                        />
                    </>
                )}
            </ul>
        </aside>
    );
};
