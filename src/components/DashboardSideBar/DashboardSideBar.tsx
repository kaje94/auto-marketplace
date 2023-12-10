import { Claims, getSession } from "@auth0/nextjs-auth0/edge";
import { Suspense } from "react";
import { api } from "@/utils/api";
import { DashboardSideBarItems } from "./DashboardSideBarItems";

export const DashboardSideBar = async () => {
    return (
        <Suspense fallback={<DashboardSideBarItems />}>
            <DashboardSideBarWithSession />
        </Suspense>
    );
};

const DashboardSideBarWithSession = async () => {
    const session = await getSession();
    const notifications = await api.getMyNotifications(session?.user?.sub!, { PageNumber: 1 });
    const notificationCount = notifications.items?.filter((item) => !item.isShown)?.length;
    return <DashboardSideBarItems notificationCount={notificationCount} userClaims={session?.user} />;
};
