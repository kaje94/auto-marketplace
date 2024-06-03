"use client";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { clsx } from "clsx";
import { StringifiableRecord } from "query-string";
import { ListingItem as ListingItemType, PaginatedResponse } from "targabay-protos/gen/ts/dist/types/common_pb";
import { Empty, ListingItem, Pagination } from "@/components/Common";
import { usePostedListingsContext } from "@/providers/PostedListingsContextProvider";
import { PublicListingsFilterSchema } from "@/utils/schemas";

export const PostedListingsSearchGrid = ({
    listings = [],
    paginatedResponse,
    pageLoading,
    currentPageNumber,
}: {
    /** Current page number */
    currentPageNumber?: number;
    /** List of listing advert items */
    listings?: ListingItemType[];
    /** To show placeholder listings during initial render without any data */
    pageLoading?: boolean;
    /** Pagination response form the server */
    paginatedResponse?: PaginatedResponse;
}) => {
    const { setNewSearchQuery, isLoading, searchParamsObj, hasSearchParams } = usePostedListingsContext();
    const [parent] = useAutoAnimate();

    const newSearchFiltersParamsObj = { ...searchParamsObj };
    delete newSearchFiltersParamsObj["query"];
    const hasFilters = Object.keys(PublicListingsFilterSchema.parse(newSearchFiltersParamsObj)).length > 0;
    const hasTitleFilter = Object.prototype.hasOwnProperty.call(searchParamsObj, "query");

    let filterText = "";
    if (hasTitleFilter || hasFilters) {
        filterText = "Filtered results";
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
                        {paginatedResponse?.totalCount ?? 0} results found
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
                {listings?.map((item) => <ListingItem key={item.id} item={item} detailed />)}

                {pageLoading && new Array(12).fill("").map((_, i) => <ListingItem key={`loading-listing-item-${i}`} loading />)}

                {!pageLoading && listings?.length === 0 && (
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
                        pageNumber={currentPageNumber}
                        searchParams={searchParamsObj as StringifiableRecord}
                        setNewSearchQuery={setNewSearchQuery}
                        totalPages={paginatedResponse?.totalPages}
                    />
                </div>
            </div>
        </>
    );
};
