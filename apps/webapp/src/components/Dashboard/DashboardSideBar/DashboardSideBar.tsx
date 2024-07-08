import { Claims, getSession } from "@auth0/nextjs-auth0";
import { Suspense } from "react";
import { getUserNotificationsAction } from "@/actions/notificationActions";
import { NavBarItem } from "./DashboardSideBarItem";

/** Dashboard sidebar with content loaded using react suspense */
export const DashboardSideBar = async () => {
    return (
        <Suspense fallback={<DashboardSideBarItems />}>
            <DashboardSideBarWithSession />
        </Suspense>
    );
};

const DashboardSideBarWithSession = async () => {
    const session = await getSession();
    const notifications = await getUserNotificationsAction(
        { page: { pageNumber: 1, pageSize: 10 }, filters: { userFilters: {} } },
        session?.user?.email!,
    );
    const notificationCount = notifications.items?.filter((item) => !item.isShown)?.length;
    return <DashboardSideBarItems notificationCount={notificationCount} userClaims={session?.user} />;
};

export const DashboardSideBarItems = ({ userClaims, notificationCount }: { notificationCount?: number; userClaims?: Claims }) => {
    return (
        <aside className="relative top-0 lg:sticky lg:top-7 2xl:top-8">
            <ul className="menu rounded-box w-full bg-base-100 p-2 shadow-md">
                <NavBarItem
                    activePaths={["/dashboard/profile"]}
                    href="/dashboard/profile"
                    iconName="UserIcon"
                    label="My Profile"
                    regexExp="/dashboard/profile/(.*?)"
                />
                <NavBarItem
                    activePaths={["/dashboard/my-listings", "/dashboard/new-listing"]}
                    href="/dashboard/my-listings"
                    iconName="AdvertIcon"
                    label="My Adverts"
                    regexExp="/dashboard/my-listings/(.*?)"
                />
                <NavBarItem
                    activePaths={["/dashboard/my-subscriptions", "/dashboard/new-subscription"]}
                    href="/dashboard/my-subscriptions"
                    iconName="RssIcon"
                    label="My Subscriptions"
                    regexExp="/dashboard/my-subscriptions/(.*?)"
                />
                <NavBarItem
                    activePaths={["/dashboard/notifications"]}
                    badgeCount={notificationCount}
                    href="/dashboard/notifications"
                    iconName="NotificationIcon"
                    label="Notifications"
                />
                {userClaims?.isAdmin && (
                    <>
                        <div className=" divider text-center text-sm">Admin functions</div>
                        <NavBarItem
                            activePaths={["/dashboard/listings"]}
                            href="/dashboard/listings"
                            iconName="ListIcon"
                            label="Manage Adverts"
                            regexExp="/dashboard/listings/(.*?)"
                        />
                        <NavBarItem
                            activePaths={["/dashboard/subscriptions"]}
                            href="/dashboard/subscriptions"
                            iconName="ClipboardIcon"
                            label="Manage Subscriptions"
                            regexExp="/dashboard/subscriptions/(.*?)"
                        />
                        <NavBarItem
                            activePaths={["/dashboard/cache-manage"]}
                            href="/dashboard/cache-manage"
                            iconName="DatabaseIcon"
                            label="Manage Cache"
                        />
                    </>
                )}
            </ul>
        </aside>
    );
};
