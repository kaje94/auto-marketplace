"use client";

import { useAutoAnimate } from "@formkit/auto-animate/react";
import { clsx } from "clsx";
import { StringifiableRecord } from "query-string";
import { Dispatch, FC, SetStateAction } from "react";
import { PaginatedResponse, SubscriptionItem } from "targabay-protos/gen/ts/dist/types/common_pb";
import { Empty, Pagination } from "@/components/Common";
import { useDashboardAllSubscriptionsContext } from "@/providers/DashboardAllSubscriptionsProvider";
import { useDashboardMySubscriptionsContext } from "@/providers/DashboardMySubscriptionsContextProvider";
import { DashboardSubscriptionItem } from "./DashboardSubscriptionItem";

interface Props {
    /** Base path to be used when forwarding to a subpath */
    basePath?: string;
    /** Current page number */
    currentPageNumber?: number;
    /** Boolean field to change the text to be shown within the empty component */
    hasSearchParams?: boolean;
    /** To show placeholder subscriptions during initial render without any data */
    pageLoading?: boolean;
    /** Pagination response form the server */
    paginatedResponse?: PaginatedResponse;
    /** Paginated list of subscriptions to be shown */
    subscriptions?: SubscriptionItem[];
}

/** List of subscription items to be shown in the dashboard */
export const DashboardSubscriptionList: FC<
    Props & { isLoading: boolean; searchParamsObj: Record<string, string>; setNewSearchQuery: Dispatch<SetStateAction<string>> }
> = ({
    subscriptions,
    paginatedResponse,
    currentPageNumber,
    pageLoading,
    isLoading,
    searchParamsObj,
    setNewSearchQuery,
    basePath,
    hasSearchParams,
}) => {
    const [parent] = useAutoAnimate();

    return (
        <div className={clsx("grid gap-1 xl:gap-2", (pageLoading || isLoading) && "animate-pulse")} ref={parent}>
            {!pageLoading && (!paginatedResponse?.totalCount || paginatedResponse?.totalCount === 0) && (
                <Empty
                    button={
                        hasSearchParams
                            ? { text: "Reset Filters", href: basePath!, onClick: () => setNewSearchQuery("") }
                            : { text: "Create New", href: "/dashboard/new-subscription" }
                    }
                    subText={
                        hasSearchParams
                            ? "Try adjusting or resetting your search filters"
                            : "By creating a new subscription, you'll receive notifications about any new advertisements that match your interests."
                    }
                    text="No subscriptions to display"
                />
            )}

            {subscriptions?.map((item) => <DashboardSubscriptionItem key={item.id} basePath={basePath} subscriptionItem={item} />)}

            {pageLoading && new Array(5).fill("").map((_, i) => <DashboardSubscriptionItem key={`loading-subscription-item-${i}`} loading />)}

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

/** DashboardListingsList bound with my subscription context */
export const DashboardMySubscriptionList: FC<Props> = (props) => {
    const { isLoading, searchParamsObj, setNewSearchQuery, hasSearchParams } = useDashboardMySubscriptionsContext();

    return (
        <DashboardSubscriptionList
            hasSearchParams={hasSearchParams}
            isLoading={isLoading}
            searchParamsObj={searchParamsObj}
            setNewSearchQuery={setNewSearchQuery}
            {...props}
        />
    );
};

/** DashboardListingsList bound with all subscription context */
export const DashboardAllSubscriptionList: FC<Props> = (props) => {
    const { isLoading, searchParamsObj, setNewSearchQuery, hasSearchParams } = useDashboardAllSubscriptionsContext();

    return (
        <DashboardSubscriptionList
            hasSearchParams={hasSearchParams}
            isLoading={isLoading}
            searchParamsObj={searchParamsObj}
            setNewSearchQuery={setNewSearchQuery}
            {...props}
        />
    );
};
