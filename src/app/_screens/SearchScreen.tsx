"use client";
import { useState, useEffect } from "react";
import { Filters } from "../search/_components";
import { PaginatedResponse, ListingItems } from "@/utils/types";
import qs, { StringifiableRecord } from "query-string";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { ListingItem, Pagination } from "../_components";
import { Select } from "../_components/FormElements/Select";
import { PostedListingsFilterSchema } from "@/utils/schemas";

export const SearchScreen = ({ searchParams, listings }: { listings: PaginatedResponse & ListingItems; searchParams?: StringifiableRecord }) => {
    const [parent] = useAutoAnimate();
    const hasSearchParams = Object.keys(PostedListingsFilterSchema.parse(searchParams)).length > 0;
    const [newSearchQuery, setNewSearchQuery] = useState(qs.stringify({ ...searchParams }));
    const isLoading = qs.stringify({ ...searchParams }) !== newSearchQuery;

    useEffect(() => {
        setNewSearchQuery(qs.stringify({ ...searchParams }));
    }, [searchParams]);

    return (
        <div className="my-10 grid grid-cols-4 gap-4 xl:gap-7 2xl:gap-8">
            <div className="col-span-4 lg:col-span-1">
                <Filters
                    setNewSearchQuery={setNewSearchQuery}
                    newSearchQuery={newSearchQuery}
                    // key={`search-filter-${qs.stringify({ ...searchParams })}`}
                />
            </div>
            <div className="col-span-4 lg:col-span-3">
                <div className="mb-5 grid items-center gap-4 md:grid-cols-2 xl:gap-7 2xl:grid-cols-3 2xl:gap-8">
                    <div className="col-span-1 text-sm font-light text-info-content 2xl:col-span-2">
                        {listings?.totalCount} results found
                        {hasSearchParams && <div className="badge badge-outline badge-md ml-2 w-max">Filtered Results</div>}
                    </div>
                    <div className="col-span-1 flex items-center">
                        <label className="mr-5 text-secondary-content">Sort By</label>
                        <Select selectClassName="select-sm flex-1" options={[{ label: "Date: Newest First", value: "date_asc" }]} disabled />
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:gap-7 2xl:grid-cols-3 2xl:gap-8" ref={parent}>
                    {listings?.items?.map((item) => (
                        <ListingItem key={item.id} item={item} detailed loading={isLoading} />
                    ))}

                    <div className="col-span-full">
                        {listings?.totalPages > 1 && (
                            <Pagination
                                pageNumber={listings.pageNumber}
                                totalPages={listings.totalPages}
                                basePath="/search"
                                searchParams={searchParams}
                                setNewSearchQuery={setNewSearchQuery}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
