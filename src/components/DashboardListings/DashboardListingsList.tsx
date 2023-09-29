"use client";

import { Dispatch, FC, SetStateAction } from "react";
import { Empty } from "@/components/Empty";
import { Pagination } from "@/components/Pagination";
import { Session } from "next-auth";
import { PaginatedResponse, ListingItems } from "@/utils/types";
import { StringifiableRecord } from "query-string";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useDashboardSubscriptionsContext } from "@/providers/dashboard-subscriptions-provider";
import clsx from "clsx";
import { useDashboardMySubscriptionsContext } from "@/providers/dashboard-my-subscriptions-provider";
import { DashboardListingItem } from "./DashboardListingItem";

interface Props {
    session?: Session | null;
    listings?: PaginatedResponse & ListingItems;
    pageLoading?: boolean;
    basePath?: string;
    hasSearchParams?: boolean;
}

export const DashboardListingsList: FC<
    Props & { isLoading: boolean; searchParamsObj: Record<string, string>; setNewSearchQuery: Dispatch<SetStateAction<string>> }
> = ({ session, listings, pageLoading, isLoading, searchParamsObj, setNewSearchQuery, basePath, hasSearchParams }) => {
    const [parent] = useAutoAnimate();

    return (
        <div className={clsx("grid gap-1 xl:gap-2", (pageLoading || isLoading) && "animate-pulse")} ref={parent}>
            {!pageLoading && listings?.totalCount === 0 && (
                <Empty
                    text="No advertisements to display."
                    subText={
                        hasSearchParams
                            ? "Try adjusting or resetting your search filters"
                            : "By creating a new new advertisement, you have the opportunity to showcase the vehicle you want to sell to a wide audience."
                    }
                    button={
                        hasSearchParams
                            ? { text: "Reset Filters", href: basePath!, onClick: () => setNewSearchQuery("") }
                            : { text: "Create New", href: "/dashboard/new-listing" }
                    }
                />
            )}

            {listings?.items?.map((item) => (
                <DashboardListingItem basePath={basePath} key={item.id} listingItem={item} isAdmin={session?.user?.isAdmin} />
            ))}

            {pageLoading && new Array(5).fill("").map((_, i) => <DashboardListingItem key={`loading-listing-item-${i}`} loading />)}

            <Pagination
                pageNumber={listings?.pageNumber}
                totalPages={listings?.totalPages}
                basePath={basePath}
                searchParams={searchParamsObj as StringifiableRecord}
                setNewSearchQuery={setNewSearchQuery}
                loading={pageLoading || isLoading}
            />
        </div>
    );
};

export const DashboardMyListingsList: FC<Props> = (props) => {
    const { isLoading, searchParamsObj, setNewSearchQuery, hasSearchParams } = useDashboardMySubscriptionsContext();

    return (
        <DashboardListingsList
            isLoading={isLoading}
            searchParamsObj={searchParamsObj}
            setNewSearchQuery={setNewSearchQuery}
            hasSearchParams={hasSearchParams}
            {...props}
        />
    );
};

export const DashboardAllListingsList: FC<Props> = (props) => {
    const { isLoading, searchParamsObj, setNewSearchQuery, hasSearchParams } = useDashboardSubscriptionsContext();

    return (
        <DashboardListingsList
            isLoading={isLoading}
            searchParamsObj={searchParamsObj}
            setNewSearchQuery={setNewSearchQuery}
            hasSearchParams={hasSearchParams}
            {...props}
        />
    );
};
