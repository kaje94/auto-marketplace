"use client";

import { Claims } from "@auth0/nextjs-auth0/edge";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useQuery } from "@tanstack/react-query";
import { clsx } from "clsx";
import { StringifiableRecord } from "query-string";
import { FC } from "react";
import { setAllNotificationsAsShownAction } from "@/actions/notificationActions";
import { Empty, Pagination } from "@/components/Common";
import { useScopedI18n } from "@/locales/client";
import { useDashboardMySubscriptionsContext } from "@/providers/DashboardMySubscriptionsContextProvider";
import { NotificationItems, PaginatedResponse } from "@/utils/types";
import { DashboardNotificationItem } from "./DashboardNotificationItem";

interface Props {
    basePath?: string;
    notifications?: PaginatedResponse & NotificationItems;
    pageLoading?: boolean;
    userClaims?: Claims;
}

export const DashboardNotificationsList: FC<Props> = ({ notifications, pageLoading, basePath, userClaims }) => {
    const hasNewNotifications = notifications?.items?.some((item) => !item.isShown);
    const { isLoading, searchParamsObj, setNewSearchQuery, hasSearchParams } = useDashboardMySubscriptionsContext();
    const [parent] = useAutoAnimate();
    const tCommon = useScopedI18n("common");
    const tDashboardNotificationsList = useScopedI18n("components.dashboardNotificationList");

    useQuery({
        queryFn: async () => {
            if (typeof window !== "undefined" && !pageLoading && userClaims && hasNewNotifications) {
                // mark notifications as read after 5 seconds of page load
                await new Promise((resolve) => setTimeout(resolve, 5000));
                await setAllNotificationsAsShownAction(userClaims?.sub);
            }
        },
        enabled: !pageLoading && userClaims && hasNewNotifications,
    });

    return (
        <div className={clsx("grid gap-1 xl:gap-2", (pageLoading || isLoading) && "animate-pulse")} ref={parent}>
            {!pageLoading && notifications?.totalCount === 0 && (
                <Empty
                    button={hasSearchParams ? { text: tCommon("resetFilter"), href: basePath!, onClick: () => setNewSearchQuery("") } : undefined}
                    subText={
                        hasSearchParams
                            ? tDashboardNotificationsList("noNotificationsSubTextWithFilters")
                            : tDashboardNotificationsList("noNotificationsSubText")
                    }
                    text={tDashboardNotificationsList("noNotificationsText")}
                />
            )}

            {notifications?.items?.map((item) => <DashboardNotificationItem key={item.id} notificationItem={item} />)}

            {pageLoading && new Array(5).fill("").map((_, i) => <DashboardNotificationItem key={`loading-notification-item-${i}`} loading />)}

            <Pagination
                basePath={basePath}
                loading={pageLoading || isLoading}
                pageNumber={notifications?.pageNumber}
                searchParams={searchParamsObj as StringifiableRecord}
                setNewSearchQuery={setNewSearchQuery}
                totalPages={notifications?.totalPages}
            />
        </div>
    );
};
