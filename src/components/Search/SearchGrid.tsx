"use client";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { clsx } from "clsx";
import { StringifiableRecord } from "query-string";
import { Empty, ListingItem, Pagination } from "@/components/Common";
import { Select } from "@/components/FormElements/Select";
import { useSearchContext } from "@/providers/search-provider";
import { ListingItems, PaginatedResponse } from "@/utils/types";

export const SearchGrid = ({ listings, pageLoading }: { listings?: PaginatedResponse & ListingItems; pageLoading?: boolean }) => {
    const { setNewSearchQuery, isLoading, searchParamsObj, hasSearchParams } = useSearchContext();
    const [parent] = useAutoAnimate();

    return (
        <>
            <div className="mb-5 grid items-center gap-4 md:grid-cols-2 xl:gap-7 2xl:grid-cols-3 2xl:gap-8">
                <div className="col-span-1 text-sm font-light text-info-content 2xl:col-span-2">
                    {pageLoading ? (
                        <div className="h-5 w-28 animate-pulse bg-base-300" />
                    ) : (
                        <>
                            {listings?.totalCount} results found
                            {hasSearchParams && <div className="badge badge-outline badge-md ml-2 w-max">Filtered Results</div>}
                        </>
                    )}
                </div>
                <div className="col-span-1 flex items-center">
                    <label className="mr-5 text-secondary-content">Sort By</label>
                    <Select disabled options={[{ label: "Date: Newest First", value: "date_asc" }]} selectClassName="select-sm flex-1" />
                </div>
            </div>
            <div
                className={clsx("grid gap-4 md:grid-cols-2 xl:gap-7 2xl:grid-cols-3 2xl:gap-8", (pageLoading || isLoading) && "animate-pulse")}
                ref={parent}
            >
                {listings?.items?.map((item) => <ListingItem key={item.id} detailed item={item} />)}

                {pageLoading && new Array(12).fill("").map((_, i) => <ListingItem key={`loading-listing-item-${i}`} loading />)}

                {!pageLoading && listings?.items?.length === 0 && (
                    <Empty
                        button={
                            hasSearchParams
                                ? { text: "Reset Filter", href: "/search", onClick: () => setNewSearchQuery(""), loading: isLoading }
                                : undefined
                        }
                        subText="You can try refining or resetting your search criteria or check again later"
                        text="No adverts to display"
                    />
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
