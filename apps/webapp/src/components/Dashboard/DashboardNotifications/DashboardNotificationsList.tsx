"use client";

import { Claims } from "@auth0/nextjs-auth0";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useQuery } from "@tanstack/react-query";
import { clsx } from "clsx";
import { StringifiableRecord } from "query-string";
import { FC } from "react";
import { PaginatedResponse } from "targabay-protos/gen/ts/dist/types/common_pb";
import { NotificationItem } from "targabay-protos/gen/ts/dist/types/notifications_pb";
import { setAllNotificationsAsShownAction } from "@/actions/notificationActions";
import { Empty, Pagination } from "@/components/Common";
import { useDashboardMySubscriptionsContext } from "@/providers/DashboardMySubscriptionsContextProvider";
import { delay } from "@/utils/helpers";
import { DashboardNotificationItem } from "./DashboardNotificationItem";

interface Props {
    /** Base path to be used when forwarding to a subpath */
    basePath?: string;
    /** Current page number */
    currentPageNumber?: number;
    /** Paginated list of notifications to be shown */
    notifications?: NotificationItem[];
    /** To show placeholder notifications during initial render without any data */
    pageLoading?: boolean;
    /** Pagination response form the server */
    paginatedResponse?: PaginatedResponse;
    /** User details */
    userClaims?: Claims;
}

/** List of notifications items to be shown in the dashboard */
export const DashboardNotificationsList: FC<Props> = ({ notifications, pageLoading, basePath, userClaims, currentPageNumber, paginatedResponse }) => {
    const hasNewNotifications = notifications?.some((item) => !item.isShown);
    const { isLoading, searchParamsObj, setNewSearchQuery, hasSearchParams } = useDashboardMySubscriptionsContext();
    const [parent] = useAutoAnimate();

    useQuery({
        queryFn: async () => {
            if (typeof window !== "undefined" && !pageLoading && userClaims && hasNewNotifications) {
                // mark notifications as read after 5 seconds of page load
                await delay(5000);
                await setAllNotificationsAsShownAction(userClaims?.email);
            }
            return null;
        },
        enabled: !pageLoading && userClaims && hasNewNotifications,
    });

    return (
        <div className={clsx("grid gap-1 xl:gap-2", (pageLoading || isLoading) && "animate-pulse")} ref={parent}>
            {!pageLoading && (!paginatedResponse?.totalCount || paginatedResponse?.totalCount === 0) && (
                <Empty
                    button={hasSearchParams ? { text: "Reset Filters", href: basePath!, onClick: () => setNewSearchQuery("") } : undefined}
                    subText={
                        hasSearchParams
                            ? "Try adjusting or resetting your search filters"
                            : "You do not have any notifications yet. Try checking out again later"
                    }
                    text="No notifications to display"
                />
            )}

            {notifications?.map((item) => <DashboardNotificationItem key={item.id} notificationItem={item} />)}

            {pageLoading && new Array(5).fill("").map((_, i) => <DashboardNotificationItem key={`loading-notification-item-${i}`} loading />)}

            <Pagination
                basePath={basePath}
                loading={pageLoading || isLoading}
                pageNumber={currentPageNumber}
                searchParams={searchParamsObj as StringifiableRecord}
                setNewSearchQuery={setNewSearchQuery}
                totalPages={paginatedResponse?.totalPages}
            />
        </div>
    );
};
