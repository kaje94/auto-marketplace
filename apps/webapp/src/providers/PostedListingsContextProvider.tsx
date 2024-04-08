"use client";

import React, { ReactNode, useContext } from "react";
import { FiltersContext, useSearchFilters } from "@/components/Filters/FiltersContext";
import { PublicListingsFilterSchema } from "@/utils/schemas";

export const usePostedListingsContext = () => {
    const data = useContext(FiltersContext);
    return data;
};

/** Provider to be used in the posted listing search page */
export const PostedListingsContextProvider = ({ children }: { children: ReactNode }) => {
    const { searchParamsObj, newSearchQuery, isLoading, setNewSearchQuery, searchParamStr } = useSearchFilters();
    const hasSearchParams = Object.keys(PublicListingsFilterSchema.parse(searchParamsObj)).length > 0;

    return (
        <FiltersContext.Provider value={{ newSearchQuery, isLoading, setNewSearchQuery, searchParamsObj, hasSearchParams, searchParamStr }}>
            {children}
        </FiltersContext.Provider>
    );
};
