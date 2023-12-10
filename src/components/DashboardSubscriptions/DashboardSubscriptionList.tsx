"use client";

import { useAutoAnimate } from "@formkit/auto-animate/react";
import { clsx } from "clsx";
import { StringifiableRecord } from "query-string";
import { Dispatch, FC, SetStateAction } from "react";
import { Empty, Pagination } from "@/components/Common";
import { useScopedI18n } from "@/locales/client";
import { useDashboardAllSubscriptionsContext } from "@/providers/DashboardAllSubscriptionsProvider";
import { useDashboardMySubscriptionsContext } from "@/providers/DashboardMySubscriptionsContextProvider";
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

    const tCommon = useScopedI18n("common");
    const tDashboardSubscriptions = useScopedI18n("components.dashboardSubscriptions");

    return (
        <div className={clsx("grid gap-1 xl:gap-2", (pageLoading || isLoading) && "animate-pulse")} ref={parent}>
            {!pageLoading && listingSubscriptions?.totalCount === 0 && (
                <Empty
                    button={
                        hasSearchParams
                            ? { text: tCommon("resetFilter"), href: basePath!, onClick: () => setNewSearchQuery("") }
                            : { text: tCommon("createBtn"), href: "/dashboard/new-subscription" }
                    }
                    subText={
                        hasSearchParams ? tDashboardSubscriptions("noSubscriptionsDescWithFilter") : tDashboardSubscriptions("noSubscriptionsDesc")
                    }
                    text={tDashboardSubscriptions("noSubscriptionsTitle")}
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
