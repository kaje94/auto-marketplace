"use client";

import { Dispatch, FC, SetStateAction } from "react";
import { Empty, Pagination } from "@/components/Common";
import { PaginatedResponse, ListingSubscriptionItems } from "@/utils/types";
import { StringifiableRecord } from "query-string";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useDashboardSubscriptionsContext } from "@/providers/dashboard-subscriptions-provider";
import clsx from "clsx";
import { useDashboardMySubscriptionsContext } from "@/providers/dashboard-my-subscriptions-provider";
import { DashboardSubscriptionItem } from "./DashboardSubscriptionItem";

interface Props {
    listingSubscriptions?: PaginatedResponse & ListingSubscriptionItems;
    pageLoading?: boolean;
    basePath?: string;
    hasSearchParams?: boolean;
}

export const DashboardSubscriptionList: FC<
    Props & { isLoading: boolean; searchParamsObj: Record<string, string>; setNewSearchQuery: Dispatch<SetStateAction<string>> }
> = ({ listingSubscriptions, pageLoading, isLoading, searchParamsObj, setNewSearchQuery, basePath, hasSearchParams }) => {
    const [parent] = useAutoAnimate();

    return (
        <div className={clsx("grid gap-1 xl:gap-2", (pageLoading || isLoading) && "animate-pulse")} ref={parent}>
            {!pageLoading && listingSubscriptions?.totalCount === 0 && (
                <Empty
                    text="No subscriptions to display."
                    subText={
                        hasSearchParams
                            ? "Try adjusting or resetting your search filters"
                            : "By creating a new subscription, you'll receive notifications about any new advertisements that match your interests."
                    }
                    button={
                        hasSearchParams
                            ? { text: "Reset Filters", href: basePath!, onClick: () => setNewSearchQuery("") }
                            : { text: "Create New", href: "/dashboard/new-subscription" }
                    }
                />
            )}

            {listingSubscriptions?.items?.map((item) => (
                <DashboardSubscriptionItem key={item.id} listingSubscriptionItem={item} basePath={basePath} />
            ))}

            {pageLoading && new Array(5).fill("").map((_, i) => <DashboardSubscriptionItem key={`loading-subscription-item-${i}`} loading />)}

            <Pagination
                pageNumber={listingSubscriptions?.pageNumber}
                totalPages={listingSubscriptions?.totalPages}
                basePath={basePath}
                searchParams={searchParamsObj as StringifiableRecord}
                setNewSearchQuery={setNewSearchQuery}
                loading={pageLoading || isLoading}
            />
        </div>
    );
};

export const DashboardMySubscriptionList: FC<Props> = (props) => {
    const { isLoading, searchParamsObj, setNewSearchQuery, hasSearchParams } = useDashboardMySubscriptionsContext();

    return (
        <DashboardSubscriptionList
            isLoading={isLoading}
            searchParamsObj={searchParamsObj}
            setNewSearchQuery={setNewSearchQuery}
            hasSearchParams={hasSearchParams}
            {...props}
        />
    );
};

export const DashboardAllSubscriptionList: FC<Props> = (props) => {
    const { isLoading, searchParamsObj, setNewSearchQuery, hasSearchParams } = useDashboardSubscriptionsContext();

    return (
        <DashboardSubscriptionList
            isLoading={isLoading}
            searchParamsObj={searchParamsObj}
            setNewSearchQuery={setNewSearchQuery}
            hasSearchParams={hasSearchParams}
            {...props}
        />
    );
};
