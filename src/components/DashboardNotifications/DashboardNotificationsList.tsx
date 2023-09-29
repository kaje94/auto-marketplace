"use client";

import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useQuery } from "@tanstack/react-query";
import { clsx } from "clsx";
import { Session } from "next-auth";
import { StringifiableRecord } from "query-string";
import { FC } from "react";
import { setAllNotificationsAsShownActions } from "@/actions/notificationActions";
import { Empty, Pagination } from "@/components/Common";
import { useDashboardMySubscriptionsContext } from "@/providers/dashboard-my-subscriptions-provider";
import { NotificationItems, PaginatedResponse } from "@/utils/types";
import { DashboardNotificationItem } from "./DashboardNotificationItem";

interface Props {
    notifications?: PaginatedResponse & NotificationItems;
    pageLoading?: boolean;
    basePath?: string;
    session?: Session | null;
}

export const DashboardNotificationsList: FC<Props> = ({ notifications, pageLoading, basePath, session }) => {
    const hasNewNotifications = notifications?.items?.some((item) => !item.isShown);
    const { isLoading, searchParamsObj, setNewSearchQuery, hasSearchParams } = useDashboardMySubscriptionsContext();
    const [parent] = useAutoAnimate();

    useQuery({
        queryFn: async () => {
            if (typeof window !== "undefined" && !pageLoading && session?.user && hasNewNotifications) {
                // mark notifications as read after 5 seconds of page load
                await new Promise((resolve) => setTimeout(resolve, 5000));
                await setAllNotificationsAsShownActions(session?.user?.id);
            }
        },
        enabled: !pageLoading && session?.user && hasNewNotifications,
    });

    return (
        <div className={clsx("grid gap-1 xl:gap-2", (pageLoading || isLoading) && "animate-pulse")} ref={parent}>
            {!pageLoading && notifications?.totalCount === 0 && (
                <Empty
                    text="No notifications to display."
                    subText={
                        hasSearchParams
                            ? "Try adjusting or resetting your search filters"
                            : "You do not have any notifications yet. Try checking out again later"
                    }
                    button={hasSearchParams ? { text: "Reset Filters", href: basePath!, onClick: () => setNewSearchQuery("") } : undefined}
                />
            )}

            {notifications?.items?.map((item) => <DashboardNotificationItem key={item.id} notificationItem={item} />)}

            {pageLoading && new Array(5).fill("").map((_, i) => <DashboardNotificationItem key={`loading-notification-item-${i}`} loading />)}

            <Pagination
                pageNumber={notifications?.pageNumber}
                totalPages={notifications?.totalPages}
                basePath={basePath}
                searchParams={searchParamsObj as StringifiableRecord}
                setNewSearchQuery={setNewSearchQuery}
                loading={pageLoading || isLoading}
            />
        </div>
    );
};
