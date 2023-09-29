import { getServerSession, Session } from "next-auth";
import { Suspense } from "react";
import { authOptions } from "@/auth/authConfig";
import { api } from "@/utils/api";
import { NavBarItem } from "./DashboardSideBarItem";

export const DashboardSideBar = async () => {
    return (
        <Suspense fallback={<DashboardSideBarItems />}>
            <DashboardSideBarWithSession />
        </Suspense>
    );
};

const DashboardSideBarWithSession = async () => {
    const session = await getServerSession(authOptions);
    const notifications = await api.getMyNotifications(session?.user?.id!, { PageNumber: 1 });
    const notificationCount = notifications.items?.filter((item) => !item.isShown)?.length;
    return <DashboardSideBarItems notificationCount={notificationCount} session={session} />;
};

const DashboardSideBarItems = ({ session, notificationCount }: { notificationCount?: number; session?: Session | null }) => {
    return (
        <aside className="relative top-0 lg:sticky lg:top-7 2xl:top-8">
            <ul className="menu rounded-box w-full bg-base-100 p-2 shadow-md">
                <NavBarItem
                    activePaths={["/dashboard/profile"]}
                    href="/dashboard/profile"
                    iconName="UserIcon"
                    label="Profile"
                    regexExp="^/dashboard/profile/(.*?)"
                />
                <NavBarItem
                    activePaths={["/dashboard/my-listings", "/dashboard/new-listing"]}
                    href="/dashboard/my-listings"
                    iconName="AdvertIcon"
                    label="My Adverts"
                    regexExp="^/dashboard/my-listings/(.*?)"
                />
                <NavBarItem
                    activePaths={["/dashboard/my-subscriptions", "/dashboard/new-subscription"]}
                    href="/dashboard/my-subscriptions"
                    iconName="RssIcon"
                    label="My Subscriptions"
                    regexExp="^/dashboard/my-subscriptions/(.*?)"
                />
                <NavBarItem
                    activePaths={["/dashboard/notifications"]}
                    badgeCount={notificationCount}
                    href="/dashboard/notifications"
                    iconName="NotificationIcon"
                    label="Notifications"
                />
                {session?.user?.isAdmin && (
                    <>
                        <NavBarItem
                            activePaths={["/dashboard/listings"]}
                            href="/dashboard/listings"
                            iconName="ListIcon"
                            label="Manage Adverts"
                            regexExp="^/dashboard/listings/(.*?)"
                        />
                        <NavBarItem
                            activePaths={["/dashboard/subscriptions"]}
                            href="/dashboard/subscriptions"
                            iconName="ClipboardIcon"
                            label="Manage Subscriptions"
                            regexExp="^/dashboard/subscriptions/(.*?)"
                        />
                    </>
                )}
            </ul>
        </aside>
    );
};
