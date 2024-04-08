"use client";

import React, { ReactNode, useContext } from "react";
import { FiltersContext, useSearchFilters } from "@/components/Filters/FiltersContext";
import { UserListingsFilterSchema } from "@/utils/schemas";

export const useDashboardMyListingsContext = () => {
    const data = useContext(FiltersContext);
    return data;
};

/** Provider to be used in my-listings page in the dashboard */
export const DashboardMyListingsContextProvider = ({ children }: { children: ReactNode }) => {
    const { searchParamsObj, newSearchQuery, isLoading, setNewSearchQuery, searchParamStr } = useSearchFilters();
    const hasSearchParams = Object.keys(UserListingsFilterSchema.parse(searchParamsObj)).length > 0;

    return (
        <FiltersContext.Provider value={{ newSearchQuery, isLoading, setNewSearchQuery, searchParamsObj, hasSearchParams, searchParamStr }}>
            {children}
        </FiltersContext.Provider>
    );
};
