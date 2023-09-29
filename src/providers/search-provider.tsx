"use client";

import React, { ReactNode, useContext } from "react";
import { PostedListingsFilterSchema } from "@/utils/schemas";
import { FiltersContext, useSearchFilters } from "./common";

export const useSearchContext = () => {
    const data = useContext(FiltersContext);
    return data;
};

export const SearchContextProvider = ({ children }: { children: ReactNode }) => {
    const { searchParamsObj, newSearchQuery, isLoading, setNewSearchQuery, searchParamStr } = useSearchFilters();
    const hasSearchParams = Object.keys(PostedListingsFilterSchema.parse(searchParamsObj)).length > 0;

    return (
        <FiltersContext.Provider value={{ newSearchQuery, isLoading, setNewSearchQuery, searchParamsObj, hasSearchParams, searchParamStr }}>
            {children}
        </FiltersContext.Provider>
    );
};
