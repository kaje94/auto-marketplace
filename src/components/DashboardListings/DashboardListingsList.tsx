"use client";

import { useAutoAnimate } from "@formkit/auto-animate/react";
import { clsx } from "clsx";
import { Session } from "next-auth";
import { StringifiableRecord } from "query-string";
import { Dispatch, FC, SetStateAction } from "react";
import { Empty, Pagination } from "@/components/Common";
import { useDashboardMySubscriptionsContext } from "@/providers/dashboard-my-subscriptions-provider";
import { useDashboardSubscriptionsContext } from "@/providers/dashboard-subscriptions-provider";
import { ListingItems, PaginatedResponse } from "@/utils/types";
import { DashboardListingItem } from "./DashboardListingItem";

interface Props {
    basePath?: string;
    hasSearchParams?: boolean;
    listings?: PaginatedResponse & ListingItems;
    pageLoading?: boolean;
    session?: Session | null;
}

export const DashboardListingsList: FC<
    Props & { isLoading: boolean; searchParamsObj: Record<string, string>; setNewSearchQuery: Dispatch<SetStateAction<string>> }
> = ({ session, listings, pageLoading, isLoading, searchParamsObj, setNewSearchQuery, basePath, hasSearchParams }) => {
    const [parent] = useAutoAnimate();

    return (
        <div className={clsx("grid gap-1 xl:gap-2", (pageLoading || isLoading) && "animate-pulse")} ref={parent}>
            {!pageLoading && listings?.totalCount === 0 && (
                <Empty
                    button={
                        hasSearchParams
                            ? { text: "Reset Filters", href: basePath!, onClick: () => setNewSearchQuery("") }
                            : { text: "Create New", href: "/dashboard/new-listing" }
                    }
                    subText={
                        hasSearchParams
                            ? "Try adjusting or resetting your search filters"
                            : "By creating a new new advertisement, you have the opportunity to showcase the vehicle you want to sell to a wide audience."
                    }
                    text="No advertisements to display."
                />
            )}

            {listings?.items?.map((item) => (
                <DashboardListingItem key={item.id} basePath={basePath} isAdmin={session?.user?.isAdmin} listingItem={item} />
            ))}

            {pageLoading && new Array(5).fill("").map((_, i) => <DashboardListingItem key={`loading-listing-item-${i}`} loading />)}

            <Pagination
                basePath={basePath}
                loading={pageLoading || isLoading}
                pageNumber={listings?.pageNumber}
                searchParams={searchParamsObj as StringifiableRecord}
                setNewSearchQuery={setNewSearchQuery}
                totalPages={listings?.totalPages}
            />
        </div>
    );
};

export const DashboardMyListingsList: FC<Props> = (props) => {
    const { isLoading, searchParamsObj, setNewSearchQuery, hasSearchParams } = useDashboardMySubscriptionsContext();

    return (
        <DashboardListingsList
            hasSearchParams={hasSearchParams}
            isLoading={isLoading}
            searchParamsObj={searchParamsObj}
            setNewSearchQuery={setNewSearchQuery}
            {...props}
        />
    );
};

export const DashboardAllListingsList: FC<Props> = (props) => {
    const { isLoading, searchParamsObj, setNewSearchQuery, hasSearchParams } = useDashboardSubscriptionsContext();

    return (
        <DashboardListingsList
            hasSearchParams={hasSearchParams}
            isLoading={isLoading}
            searchParamsObj={searchParamsObj}
            setNewSearchQuery={setNewSearchQuery}
            {...props}
        />
    );
};