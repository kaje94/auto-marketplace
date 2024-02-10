"use client";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { clsx } from "clsx";
import { StringifiableRecord } from "query-string";
import { Empty, ListingItem, Pagination } from "@/components/Common";
import { usePostedListingsContext } from "@/providers/PostedListingsContextProvider";
import { PostedListingsFilterSchema } from "@/utils/schemas";
import { ListingItems, PaginatedResponse } from "@/utils/types";

export const PostedListingsSearchGrid = ({ listings, pageLoading }: { listings?: PaginatedResponse & ListingItems; pageLoading?: boolean }) => {
    const { setNewSearchQuery, isLoading, searchParamsObj, hasSearchParams } = usePostedListingsContext();
    const [parent] = useAutoAnimate();

    const newSearchFiltersParamsObj = { ...searchParamsObj };
    delete newSearchFiltersParamsObj["Title"];
    const hasFilters = Object.keys(PostedListingsFilterSchema.parse(newSearchFiltersParamsObj)).length > 0;
    const hasTitleFilter = Object.prototype.hasOwnProperty.call(searchParamsObj, "Title");

    let filterText = "";
    if (hasTitleFilter && hasFilters) {
        filterText = "Filtered by Title & Advanced filters";
    } else if (hasFilters) {
        filterText = "Filtered results";
    } else if (hasTitleFilter) {
        filterText = "Filtered by Title";
    }

    return (
        <>
            <div
                className={clsx(
                    "mt-1 flex flex-col items-center justify-center gap-1 pb-4 text-sm font-light text-info-content sm:flex-row lg:col-span-2 lg:pb-8 2xl:col-span-3",
                    isLoading && "animate-pulse",
                )}
            >
                {pageLoading ? (
                    <div className="h-5 w-28 animate-pulse rounded bg-base-300" />
                ) : (
                    <>
                        {listings?.totalCount} results found
                        {filterText && <div className="badge badge-outline badge-md ml-2 w-max">{filterText}</div>}
                    </>
                )}
            </div>
            <div
                className={clsx(
                    "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:gap-7 2xl:grid-cols-4 2xl:gap-8",
                    (pageLoading || isLoading) && "animate-pulse",
                )}
                ref={parent}
            >
                {listings?.items?.map((item) => <ListingItem key={item.id} item={item} detailed />)}

                {pageLoading && new Array(12).fill("").map((_, i) => <ListingItem key={`loading-listing-item-${i}`} loading />)}

                {!pageLoading && listings?.items?.length === 0 && (
                    <div className="col-span-full">
                        <Empty
                            button={
                                hasSearchParams
                                    ? { text: "Reset Filter", href: "/search", onClick: () => setNewSearchQuery(""), loading: isLoading }
                                    : undefined
                            }
                            subText="You can try refining or resetting your search criteria or check again later"
                            text="No adverts to display"
                        />
                    </div>
                )}

                <div className="col-span-full">
                    <Pagination
                        basePath="/search"
                        loading={pageLoading || isLoading}
                        pageNumber={listings?.pageNumber}
                        searchParams={searchParamsObj as StringifiableRecord}
                        setNewSearchQuery={setNewSearchQuery}
                        totalPages={listings?.totalPages}
                    />
                </div>
            </div>
        </>
    );
};
