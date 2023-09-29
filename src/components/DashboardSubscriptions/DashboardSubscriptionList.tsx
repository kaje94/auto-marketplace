"use client";

import { useAutoAnimate } from "@formkit/auto-animate/react";
import { clsx } from "clsx";
import { StringifiableRecord } from "query-string";
import { Dispatch, FC, SetStateAction } from "react";
import { Empty, Pagination } from "@/components/Common";
import { useDashboardMySubscriptionsContext } from "@/providers/dashboard-my-subscriptions-provider";
import { useDashboardSubscriptionsContext } from "@/providers/dashboard-subscriptions-provider";
import { ListingSubscriptionItems, PaginatedResponse } from "@/utils/types";
import { DashboardSubscriptionItem } from "./DashboardSubscriptionItem";

interface Props {
    basePath?: string;
    hasSearchParams?: boolean;
    listingSubscriptions?: PaginatedResponse & ListingSubscriptionItems;
    pageLoading?: boolean;
}

export const DashboardSubscriptionList: FC<
    Props & { isLoading: boolean; searchParamsObj: Record<string, string>; setNewSearchQuery: Dispatch<SetStateAction<string>> }
> = ({ listingSubscriptions, pageLoading, isLoading, searchParamsObj, setNewSearchQuery, basePath, hasSearchParams }) => {
    const [parent] = useAutoAnimate();

    return (
        <div className={clsx("grid gap-1 xl:gap-2", (pageLoading || isLoading) && "animate-pulse")} ref={parent}>
            {!pageLoading && listingSubscriptions?.totalCount === 0 && (
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
                    text="No subscriptions to display."
                />
            )}

            {listingSubscriptions?.items?.map((item) => (
                <DashboardSubscriptionItem key={item.id} basePath={basePath} listingSubscriptionItem={item} />
            ))}

            {pageLoading && new Array(5).fill("").map((_, i) => <DashboardSubscriptionItem key={`loading-subscription-item-${i}`} loading />)}

            <Pagination
                basePath={basePath}
                loading={pageLoading || isLoading}
                pageNumber={listingSubscriptions?.pageNumber}
                searchParams={searchParamsObj as StringifiableRecord}
                setNewSearchQuery={setNewSearchQuery}
                totalPages={listingSubscriptions?.totalPages}
            />
        </div>
    );
};

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

export const DashboardAllSubscriptionList: FC<Props> = (props) => {
    const { isLoading, searchParamsObj, setNewSearchQuery, hasSearchParams } = useDashboardSubscriptionsContext();

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
